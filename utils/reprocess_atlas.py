#!/usr/bin/env python3
"""
Refined Atlas Dataset Reprocessor for MapTap
- Associates real populations to ALL municipalities in the database.
- Marks is_country_capital and is_state_capital distinctly.
- Accurately identifies 27 Brazilian capitals and 50 US state capitals + Washington DC.
- Adds missing country and state capitals worldwide.
- Fixes the order of regions in countries-catalog.ts (Continent before its countries).
"""

import csv
import json
import math
import os
import re
import ssl
import unicodedata
import urllib.request
import zipfile
from collections import Counter
from pathlib import Path
from shapely.geometry import Point, shape

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_RAW_DIR = ROOT_DIR / "data" / "raw"
FRONTEND_DATA_DIR = ROOT_DIR / "frontend" / "public" / "data"
FRONTEND_TS_DIR = ROOT_DIR / "frontend" / "data"

CSV_MAPTAP_PATH = DATA_RAW_DIR / "maptap-atlas-5894-locations-2026-09-25.csv"
CITIES1000_ZIP = DATA_RAW_DIR / "cities1000.zip"
COUNTRIES_GEOJSON_PATH = FRONTEND_DATA_DIR / "countries.geojson"
REGIONS_GEOJSON_PATH = FRONTEND_DATA_DIR / "regions.geojson"
CITIES_JSON_PATH = FRONTEND_DATA_DIR / "cities.json"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

def strip_accents(s):
    if not s:
        return ""
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")

def norm(s):
    return re.sub(r"[^a-z0-9]", "", strip_accents(s).lower())

def clean_city_name(raw_name):
    return raw_name.split(",")[0].strip()

def dist_km(lat1, lon1, lat2, lon2):
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    return 6371 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

# The canonical 27 Brazilian capitals (26 states + Federal District)
BRAZIL_CAPITALS_CANONICAL = {
    "AC": "Rio Branco", "AL": "Maceió", "AP": "Macapá", "AM": "Manaus",
    "BA": "Salvador", "CE": "Fortaleza", "DF": "Brasília", "ES": "Vitória",
    "GO": "Goiânia", "MA": "São Luís", "MT": "Cuiabá", "MS": "Campo Grande",
    "MG": "Belo Horizonte", "PA": "Belém", "PB": "João Pessoa", "PR": "Curitiba",
    "PE": "Recife", "PI": "Teresina", "RJ": "Rio de Janeiro", "RN": "Natal",
    "RS": "Porto Alegre", "RO": "Porto Velho", "RR": "Boa Vista", "SC": "Florianópolis",
    "SP": "São Paulo", "SE": "Aracaju", "TO": "Palmas"
}
BRAZIL_CAPITALS_BY_NORM = {norm(name): (code, name) for code, name in BRAZIL_CAPITALS_CANONICAL.items()}

# Map of US state name to code
US_STATE_NAME_TO_CODE = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
    "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
    "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
    "illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS",
    "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
    "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS",
    "missouri": "MO", "montana": "MT", "nebraska": "NE", "nevada": "NV",
    "newhampshire": "NH", "newjersey": "NJ", "newmexico": "NM", "newyork": "NY",
    "northcarolina": "NC", "northdakota": "ND", "ohio": "OH", "oklahoma": "OK",
    "oregon": "OR", "pennsylvania": "PA", "rhodeisland": "RI", "southcarolina": "SC",
    "southdakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT",
    "vermont": "VT", "virginia": "VA", "washington": "WA", "westvirginia": "WV",
    "wisconsin": "WI", "wyoming": "WY", "districtofcolumbia": "DC"
}

# The canonical 50 US State Capitals
US_STATE_CAPITALS_CANONICAL = {
    "AL": "Montgomery", "AK": "Juneau", "AZ": "Phoenix", "AR": "Little Rock",
    "CA": "Sacramento", "CO": "Denver", "CT": "Hartford", "DE": "Dover",
    "FL": "Tallahassee", "GA": "Atlanta", "HI": "Honolulu", "ID": "Boise",
    "IL": "Springfield", "IN": "Indianapolis", "IA": "Des Moines", "KS": "Topeka",
    "KY": "Frankfort", "LA": "Baton Rouge", "ME": "Augusta", "MD": "Annapolis",
    "MA": "Boston", "MI": "Lansing", "MN": "Saint Paul", "MS": "Jackson",
    "MO": "Jefferson City", "MT": "Helena", "NE": "Lincoln", "NV": "Carson City",
    "NH": "Concord", "NJ": "Trenton", "NM": "Santa Fe", "NY": "Albany",
    "NC": "Raleigh", "ND": "Bismarck", "OH": "Columbus", "OK": "Oklahoma City",
    "OR": "Salem", "PA": "Harrisburg", "RI": "Providence", "SC": "Columbia",
    "SD": "Pierre", "TN": "Nashville", "TX": "Austin", "UT": "Salt Lake City",
    "VT": "Montpelier", "VA": "Richmond", "WA": "Olympia", "WV": "Charleston",
    "WI": "Madison", "WY": "Cheyenne",
}
US_STATE_CAPITALS_BY_NORM = {norm(name): (code, name) for code, name in US_STATE_CAPITALS_CANONICAL.items()}

CUSTOM_COUNTRY_MAP = {
    "united states": "USA", "usa": "USA", "england": "GBR", "scotland": "GBR", "wales": "GBR",
    "northern ireland": "GBR", "united kingdom": "GBR", "georgia (country)": "GEO",
    "côte d'ivoire": "CIV", "cape verde": "CPV", "curacao": "CUW", "sao tome and principe": "STP",
    "guinea bissau": "GNB", "the bahamas": "BHS", "bahamas": "BHS", "congo (republic)": "COG",
    "dr congo": "COD", "democratic republic of the congo": "COD",
    "türkiye": "TUR", "turkey": "TUR", "czechia": "CZE", "eswatini": "SWZ", "north macedonia": "MKD",
    "south korea": "KOR", "north korea": "PRK", "taiwan": "TWN", "palestine": "PSE",
    "vatican city": "VAT", "saint vincent and the grenadines": "VCT", "antigua and barbuda": "ATG",
    "saint kitts and nevis": "KNA", "saint lucia": "LCA", "trinidad and tobago": "TTO",
    "federated states of micronesia": "FSM", "marshall islands": "MHL", "solomon islands": "SLB",
    "us virgin islands": "VIR", "turks & caicos": "TCA", "tokelau": "TKL",
    "saint barthélemy": "BLM", "saint-pierre and miquelon": "SPM", "bonaire": "BES", "saba": "BES",
    "sint eustatius": "BES", "tristan da cunha": "SHN", "ascension island": "SHN",
    "brazil/paraguay": "BRA", "argentina/chile": "ARG", "canada/greenland": "CAN",
    "china/north korea": "PRK", "egypt/sudan": "EGY", "france/italy": "FRA", "nepal/china": "NPL",
    "nepal/india": "IND", "russia/usa": "RUS", "arctic ocean": "NOR", "pacific ocean": "FJI",
    "north atlantic": "CAN", "southern ocean": "ATA", "north sea": "GBR", "midway atoll": "USA",
}

# Tourist POIs to explicitly exclude from capital tagging
EXCLUDED_POIS = {
    "cristoredentor", "brasiliacathedral", "thewhitehouse", "libraryofcongress",
    "lincolnmemorial", "pentagon", "washingtonmonument", "mountwashington",
    "statueofliberty", "eiffeltower", "colosseum", "bigben", "tajmahal"
}

def main():
    print("=== Step 1: Loading Geospatial Reference Metadata ===")
    with open(COUNTRIES_GEOJSON_PATH, "r", encoding="utf-8") as f:
        countries_data = json.load(f)

    iso3_to_country = {}
    iso3_to_continent = {}
    for feat in countries_data["features"]:
        p = feat["properties"]
        code = p.get("code", "").upper()
        if code:
            iso3_to_country[code] = p.get("name", code)
            iso3_to_continent[code] = p.get("continent", "Unknown")

    with open(REGIONS_GEOJSON_PATH, "r", encoding="utf-8") as f:
        regions_data = json.load(f)

    shapes_by_country = {}
    state_name_to_code = {}
    for feat in regions_data["features"]:
        p = feat["properties"]
        c_code = (p.get("country_code") or "").upper()
        s_code = (p.get("state_code") or "").upper()
        s_name = norm(p.get("name"))
        s_statename = norm(p.get("state_name"))
        if c_code and s_code:
            state_name_to_code[(c_code, s_name)] = s_code
            state_name_to_code[(c_code, s_statename)] = s_code
        if feat.get("geometry"):
            shapes_by_country.setdefault(c_code, []).append((p, shape(feat["geometry"])))

    print("=== Step 2: Downloading and Parsing GeoNames countryInfo.txt ===")
    ci_url = "https://download.geonames.org/export/dump/countryInfo.txt"
    req = urllib.request.Request(ci_url, headers={"User-Agent": "Mozilla/5.0"})
    iso2_to_iso3 = {}
    official_country_capitals = {}  # iso3 -> list of normalized capital names
    with urllib.request.urlopen(req, context=CTX) as resp:
        for line in resp.read().decode("utf-8").splitlines():
            if line.startswith("#") or not line.strip():
                continue
            parts = line.split("\t")
            if len(parts) >= 9:
                i2, i3, cap_name = parts[0], parts[1], parts[5]
                iso2_to_iso3[i2] = i3
                if cap_name:
                    # In case of comma/slash multiple capitals
                    caps = [norm(c) for c in re.split(r"[,/]", cap_name) if c.strip()]
                    official_country_capitals[i3] = caps

    print(f"Loaded official country capitals for {len(official_country_capitals)} countries.")

    print("=== Step 3: Loading GeoNames Database (cities1000.txt) ===")
    geonames_records = []
    geonames_by_country = {}
    with zipfile.ZipFile(CITIES1000_ZIP) as zf:
        with zf.open("cities1000.txt") as f:
            for line in f.read().decode("utf-8").splitlines():
                parts = line.split("\t")
                if len(parts) > 14:
                    g_name = parts[1]
                    g_ascii = parts[2]
                    g_lat = float(parts[4])
                    g_lng = float(parts[5])
                    g_fcode = parts[7]
                    g_iso2 = parts[8]
                    g_iso3 = iso2_to_iso3.get(g_iso2, g_iso2)
                    g_admin1 = parts[10]
                    g_pop = int(parts[14] or 0)
                    rec = {
                        "name": g_name,
                        "ascii": g_ascii,
                        "norm": norm(g_ascii or g_name),
                        "lat": g_lat,
                        "lng": g_lng,
                        "fcode": g_fcode,
                        "iso3": g_iso3,
                        "admin1": g_admin1,
                        "pop": g_pop,
                    }
                    geonames_records.append(rec)
                    geonames_by_country.setdefault(g_iso3, []).append(rec)

    print(f"Parsed {len(geonames_records)} GeoNames records!")

    print("=== Step 4: Processing MapTap Base CSV (5,894 locations) ===")
    maptap_cities = []
    with open(CSV_MAPTAP_PATH, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            loc_id = row.get("id", "").strip()
            raw_name = row.get("name", "").strip()
            c_name = row.get("country", "").strip()
            prov = row.get("province", "").strip()
            cont = row.get("continent", "").strip()
            lat_str = row.get("lat", "").strip()
            lng_str = row.get("lng", "").strip()
            if not lat_str or not lng_str:
                continue
            try:
                lat = round(float(lat_str), 4)
                lng = round(float(lng_str), 4)
            except ValueError:
                continue

            clean_name = clean_city_name(raw_name)
            norm_name = norm(clean_name)

            c_lower = c_name.strip().lower()
            iso3 = CUSTOM_COUNTRY_MAP.get(c_lower)
            if not iso3:
                for k, v in iso3_to_country.items():
                    if v.lower() == c_lower or k.lower() == c_lower:
                        iso3 = k
                        break
            if not iso3:
                iso3 = "UNK"

            maptap_cities.append({
                "id": loc_id or f"mt-{iso3.lower()}-{norm_name}",
                "name": clean_name,
                "norm_name": norm_name,
                "country": iso3_to_country.get(iso3, c_name),
                "country_code": iso3,
                "province_raw": prov,
                "continent": iso3_to_continent.get(iso3, cont),
                "lat": lat,
                "lng": lng,
                "population": 0,
                "is_country_capital": False,
                "is_state_capital": False,
                "is_capital": False,
                "is_maptap_base": True,
            })

    # Associate populations and exact capital tags
    matched_pop_count = 0
    for m in maptap_cities:
        iso3 = m["country_code"]
        mlat = m["lat"]
        mlng = m["lng"]
        mnorm = m["norm_name"]

        # 1. Match population from GeoNames
        best_pop = 0
        best_dist = 999999
        best_fcode = ""
        best_admin1 = ""

        candidates = geonames_by_country.get(iso3, [])
        for g in candidates:
            if abs(g["lat"] - mlat) < 0.35 and abs(g["lng"] - mlng) < 0.35:
                d = dist_km(mlat, mlng, g["lat"], g["lng"])
                is_exact = mnorm == g["norm"]
                if is_exact and d < 40:
                    if d < best_dist:
                        best_dist = d
                        best_pop = g["pop"]
                        best_fcode = g["fcode"]
                        best_admin1 = g["admin1"]

        # Fallback to proximity search if name had slight difference
        if best_pop == 0:
            for g in candidates:
                if abs(g["lat"] - mlat) < 0.15 and abs(g["lng"] - mlng) < 0.15:
                    d = dist_km(mlat, mlng, g["lat"], g["lng"])
                    if d < 12 and g["pop"] > best_pop:
                        best_pop = g["pop"]
                        best_fcode = g["fcode"]
                        best_admin1 = g["admin1"]

        if best_pop > 0:
            m["population"] = best_pop
            matched_pop_count += 1

        # 2. Strict Capital Tagging
        if mnorm not in EXCLUDED_POIS:
            # Special Brazil Handling (Exactly 27 canonical capitals)
            if iso3 == "BRA":
                if mnorm in BRAZIL_CAPITALS_BY_NORM:
                    scode, canonical_name = BRAZIL_CAPITALS_BY_NORM[mnorm]
                    m["name"] = canonical_name
                    m["state_code"] = scode
                    m["is_state_capital"] = True
                    if scode == "DF":
                        m["is_country_capital"] = True

            # Special USA Handling (Exactly 50 state capitals + Washington D.C.)
            elif iso3 == "USA":
                prov_code = US_STATE_NAME_TO_CODE.get(norm(m.get("province_raw", "")))
                if prov_code and prov_code in US_STATE_CAPITALS_CANONICAL:
                    expected_cap = norm(US_STATE_CAPITALS_CANONICAL[prov_code])
                    if mnorm == expected_cap:
                        m["name"] = US_STATE_CAPITALS_CANONICAL[prov_code]
                        m["state_code"] = prov_code
                        m["state"] = m.get("province_raw")
                        m["is_state_capital"] = True
                if mnorm in ["washington", "washingtondc"]:
                    m["name"] = "Washington, D.C."
                    m["state_code"] = "DC"
                    m["state"] = "District of Columbia"
                    m["is_country_capital"] = True

            # General World Handling
            else:
                # Country capital
                if iso3 in official_country_capitals and mnorm in official_country_capitals[iso3]:
                    m["is_country_capital"] = True
                elif best_fcode == "PPLC":
                    m["is_country_capital"] = True

                # State capital
                if best_fcode == "PPLA":
                    m["is_state_capital"] = True

        m["is_capital"] = m["is_country_capital"] or m["is_state_capital"]

        # State code assignment via polygon
        c_code = m["country_code"]
        prov = m["province_raw"]
        if not m.get("state_code") and prov:
            k = (c_code, norm(prov))
            if k in state_name_to_code:
                m["state_code"] = state_name_to_code[k]
                m["state"] = prov

        if not m.get("state_code") and c_code in shapes_by_country:
            pt = Point(m["lng"], m["lat"])
            for sp, geom in shapes_by_country[c_code]:
                if geom.contains(pt):
                    m["state"] = m.get("state") or sp.get("state_name") or sp.get("name")
                    m["state_code"] = sp.get("state_code")
                    break

    print(f"Matched real populations for {matched_pop_count} of {len(maptap_cities)} MapTap cities!")

    print("=== Step 5: Adding Missing Capitals and Major Global Cities (+100k) ===")
    existing_city_keys = {(c["country_code"], c["norm_name"]) for c in maptap_cities}
    # Normalize synonyms for existing capitals
    if ("USA", "washingtondc") in existing_city_keys:
        existing_city_keys.add(("USA", "washington"))
    if ("BRA", "brasilia") in existing_city_keys:
        existing_city_keys.add(("BRA", "brasiliadf"))

    extra_capitals = []

    # 1. Ensure all 50 US State capitals are present
    for scode, sname in US_STATE_CAPITALS_CANONICAL.items():
        snorm = norm(sname)
        if ("USA", snorm) not in existing_city_keys:
            cand = [g for g in geonames_by_country.get("USA", []) if g["norm"] == snorm]
            if cand:
                g = cand[0]
                extra_capitals.append({
                    "id": f"cap-usa-{scode.lower()}",
                    "name": sname,
                    "norm_name": snorm,
                    "country": "United States",
                    "country_code": "USA",
                    "state": sname,
                    "state_code": scode,
                    "lat": round(g["lat"], 4),
                    "lng": round(g["lng"], 4),
                    "population": g["pop"],
                    "is_country_capital": False,
                    "is_state_capital": True,
                    "is_capital": True,
                    "continent": "North America",
                    "is_maptap_base": False,
                })
                existing_city_keys.add(("USA", snorm))

    # 2. Ensure all 27 Brazilian capitals are present
    for scode, sname in BRAZIL_CAPITALS_CANONICAL.items():
        snorm = norm(sname)
        if ("BRA", snorm) not in existing_city_keys:
            cand = [g for g in geonames_by_country.get("BRA", []) if g["norm"] == snorm]
            if cand:
                g = cand[0]
                extra_capitals.append({
                    "id": f"cap-bra-{scode.lower()}",
                    "name": sname,
                    "norm_name": snorm,
                    "country": "Brazil",
                    "country_code": "BRA",
                    "state": scode,
                    "state_code": scode,
                    "lat": round(g["lat"], 4),
                    "lng": round(g["lng"], 4),
                    "population": g["pop"],
                    "is_country_capital": (scode == "DF"),
                    "is_state_capital": True,
                    "is_capital": True,
                    "continent": "South America",
                    "is_maptap_base": False,
                })
                existing_city_keys.add(("BRA", snorm))

    # 3. Add all official country capitals from GeoNames (PPLC)
    for g in geonames_records:
        if g["fcode"] == "PPLC":
            iso3 = g["iso3"]
            if not iso3 or iso3 == "UNK":
                continue
            gnorm = g["norm"]
            if (iso3, gnorm) not in existing_city_keys and gnorm not in EXCLUDED_POIS:
                extra_capitals.append({
                    "id": f"cap-{iso3.lower()}-{gnorm}",
                    "name": g["name"],
                    "norm_name": gnorm,
                    "country": iso3_to_country.get(iso3, iso3),
                    "country_code": iso3,
                    "state": None,
                    "state_code": None,
                    "lat": round(g["lat"], 4),
                    "lng": round(g["lng"], 4),
                    "population": g["pop"],
                    "is_country_capital": True,
                    "is_state_capital": False,
                    "is_capital": True,
                    "continent": iso3_to_continent.get(iso3, "Unknown"),
                    "is_maptap_base": False,
                })
                existing_city_keys.add((iso3, gnorm))

    # 4. Add major global state capitals (PPLA) with population >= 15,000
    for g in geonames_records:
        if g["fcode"] == "PPLA" and g["pop"] >= 15000:
            iso3 = g["iso3"]
            if not iso3 or iso3 == "UNK":
                continue
            gnorm = g["norm"]
            if (iso3, gnorm) not in existing_city_keys and gnorm not in EXCLUDED_POIS:
                extra_capitals.append({
                    "id": f"statecap-{iso3.lower()}-{gnorm}",
                    "name": g["name"],
                    "norm_name": gnorm,
                    "country": iso3_to_country.get(iso3, iso3),
                    "country_code": iso3,
                    "state": None,
                    "state_code": None,
                    "lat": round(g["lat"], 4),
                    "lng": round(g["lng"], 4),
                    "population": g["pop"],
                    "is_country_capital": False,
                    "is_state_capital": True,
                    "is_capital": True,
                    "continent": iso3_to_continent.get(iso3, "Unknown"),
                    "is_maptap_base": False,
                })
                existing_city_keys.add((iso3, gnorm))

    # 5. Add cities with population >= 100,000 to enrich the expanded dataset
    major_cities = []
    for g in geonames_records:
        if g["pop"] >= 100000:
            iso3 = g["iso3"]
            if not iso3 or iso3 == "UNK":
                continue
            gnorm = g["norm"]
            if (iso3, gnorm) not in existing_city_keys and gnorm not in EXCLUDED_POIS:
                is_country_cap = (g["fcode"] == "PPLC")
                is_state_cap = (g["fcode"] == "PPLA")
                major_cities.append({
                    "id": f"geo-{iso3.lower()}-{gnorm}",
                    "name": g["name"],
                    "norm_name": gnorm,
                    "country": iso3_to_country.get(iso3, iso3),
                    "country_code": iso3,
                    "state": None,
                    "state_code": None,
                    "lat": round(g["lat"], 4),
                    "lng": round(g["lng"], 4),
                    "population": g["pop"],
                    "is_country_capital": is_country_cap,
                    "is_state_capital": is_state_cap,
                    "is_capital": is_country_cap or is_state_cap,
                    "continent": iso3_to_continent.get(iso3, "Unknown"),
                    "is_maptap_base": False,
                })
                existing_city_keys.add((iso3, gnorm))

    print(f"Added {len(extra_capitals)} missing capitals and {len(major_cities)} cities +100k.")

    # Assign state_code via spatial geometry check
    for c in extra_capitals + major_cities:
        c_code = c["country_code"]
        if not c.get("state_code") and c_code in shapes_by_country:
            pt = Point(c["lng"], c["lat"])
            for sp, geom in shapes_by_country[c_code]:
                if geom.contains(pt):
                    c["state"] = c.get("state") or sp.get("state_name") or sp.get("name")
                    c["state_code"] = sp.get("state_code")
                    break

    all_cities = []
    for c in maptap_cities + extra_capitals + major_cities:
        all_cities.append({
            "id": c["id"],
            "name": c["name"],
            "country": c["country"],
            "country_code": c["country_code"],
            "state": c.get("state"),
            "state_code": c.get("state_code"),
            "lat": c["lat"],
            "lng": c["lng"],
            "population": c["population"],
            "is_country_capital": c["is_country_capital"],
            "is_state_capital": c["is_state_capital"],
            "is_capital": c["is_capital"],
            "continent": c["continent"],
            "is_maptap_base": c["is_maptap_base"],
        })

    # Output verification
    bra_caps = [c for c in all_cities if c["country_code"] == "BRA" and c["is_capital"]]
    usa_caps = [c for c in all_cities if c["country_code"] == "USA" and c["is_capital"]]

    print(f"=== Results Summary ===")
    print(f"Total consolidated cities: {len(all_cities)}")
    print(f"  - MapTap Atlas Base: {sum(1 for c in all_cities if c['is_maptap_base'])}")
    print(f"  - Total Country Capitals: {sum(1 for c in all_cities if c['is_country_capital'])}")
    print(f"  - Total State Capitals: {sum(1 for c in all_cities if c['is_state_capital'])}")
    print(f"  - Total Capitals: {sum(1 for c in all_cities if c['is_capital'])}")
    print(f"  - Brazilian Capitals: {len(bra_caps)} (Expect exactly 27)")
    print(f"  - US Capitals: {len(usa_caps)} (Expect exactly 51)")

    # Save compact cities.json
    compact_cities = []
    for c in all_cities:
        obj = {
            "id": c["id"],
            "n": c["name"],
            "c": c["country"],
            "cc": c["country_code"],
            "y": c["lat"],
            "x": c["lng"],
            "p": c["population"],
        }
        if c.get("state"):
            obj["s"] = c["state"]
        if c.get("state_code"):
            obj["sc"] = c["state_code"]
        if c.get("continent"):
            obj["ct"] = c["continent"]
        if c.get("is_country_capital"):
            obj["is_cc"] = 1
        if c.get("is_state_capital"):
            obj["is_sc"] = 1
        if c.get("is_capital"):
            obj["is_cap"] = 1
        if c.get("is_maptap_base"):
            obj["mt"] = 1
        compact_cities.append(obj)

    output_dict = {
        "version": "2.4.0",
        "total_cities": len(compact_cities),
        "cities": compact_cities,
    }
    with open(CITIES_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(output_dict, f, ensure_ascii=False)
    print(f"Saved: {CITIES_JSON_PATH} ({CITIES_JSON_PATH.stat().st_size / 1024:.1f} KB)")

    print("=== Step 6: Updating Region Tabs in countries-catalog.ts ===")
    cities_by_country = Counter(c["country_code"] for c in all_cities)
    regions_by_country = Counter(f["properties"]["country_code"] for f in regions_data["features"])

    catalog_path = FRONTEND_TS_DIR / "countries-catalog.ts"
    with open(catalog_path, "r", encoding="utf-8") as f:
        content = f.read()

    prefix = "export const REGION_TABS: RegionTabDefinition[] = "
    start_idx = content.find(prefix) + len(prefix)
    end_idx = content.rfind(";\n\n// Flat map")
    json_str = content[start_idx:end_idx].strip()
    tabs = json.loads(json_str)

    highlight_items = [
        {"id": "ALL", "name": "Whole World", "flag": "🌍", "center": [0, 20], "zoom": 1.8, "badge": f"{len(countries_data['features'])} countries"},

        {"id": "SOUTH_AMERICA", "name": "South America", "flag": "🌎", "center": [-58.0, -20.0], "zoom": 3.2, "badge": "13 countries"},
        {"id": "BRA", "name": "Brazil", "flag": "🇧🇷", "center": [-47.89, -15.79], "zoom": 4.0, "badge": f"{regions_by_country['BRA']} regions | {cities_by_country['BRA']} cities"},

        {"id": "NORTH_AMERICA", "name": "North America", "flag": "🌎", "center": [-98.57, 39.82], "zoom": 3.2, "badge": "39 countries"},
        {"id": "USA", "name": "United States", "flag": "🇺🇸", "center": [-98.57, 39.82], "zoom": 3.8, "badge": f"{regions_by_country['USA']} regions | {cities_by_country['USA']} cities"},
        {"id": "CAN", "name": "Canada", "flag": "🇨🇦", "center": [-106.34, 56.13], "zoom": 3.5, "badge": f"{regions_by_country['CAN']} regions | {cities_by_country['CAN']} cities"},
        {"id": "MEX", "name": "Mexico", "flag": "🇲🇽", "center": [-102.55, 23.63], "zoom": 4.5, "badge": f"{regions_by_country['MEX']} regions | {cities_by_country['MEX']} cities"},

        {"id": "EUR", "name": "Europe", "flag": "🇪🇺", "center": [10.0, 50.0], "zoom": 3.8, "badge": "53 countries"},
        {"id": "DEU", "name": "Germany", "flag": "🇩🇪", "center": [10.45, 51.16], "zoom": 5.0, "badge": f"{regions_by_country['DEU']} regions | {cities_by_country['DEU']} cities"},
        {"id": "FRA", "name": "France", "flag": "🇫🇷", "center": [2.21, 46.22], "zoom": 5.0, "badge": f"{regions_by_country['FRA']} regions | {cities_by_country['FRA']} cities"},
        {"id": "ESP", "name": "Spain", "flag": "🇪🇸", "center": [-3.74, 40.46], "zoom": 5.0, "badge": f"{regions_by_country['ESP']} regions | {cities_by_country['ESP']} cities"},

        {"id": "ASIA", "name": "Asia", "flag": "🌏", "center": [100.0, 35.0], "zoom": 3.0, "badge": "50 countries"},
        {"id": "CHN", "name": "China", "flag": "🇨🇳", "center": [104.19, 35.86], "zoom": 3.8, "badge": f"{regions_by_country['CHN']} regions | {cities_by_country['CHN']} cities"},
        {"id": "IND", "name": "India", "flag": "🇮🇳", "center": [78.96, 20.59], "zoom": 4.0, "badge": f"{regions_by_country['IND']} regions | {cities_by_country['IND']} cities"},
        {"id": "JPN", "name": "Japan", "flag": "🇯🇵", "center": [138.25, 36.20], "zoom": 4.8, "badge": f"{regions_by_country['JPN']} regions | {cities_by_country['JPN']} cities"},

        {"id": "OCEANIA", "name": "Oceania", "flag": "🏝️", "center": [133.77, -25.27], "zoom": 3.5, "badge": "28 countries"},
        {"id": "AUS", "name": "Australia", "flag": "🇦🇺", "center": [133.77, -25.27], "zoom": 3.8, "badge": f"{regions_by_country['AUS']} regions | {cities_by_country['AUS']} cities"},

        {"id": "AFRICA", "name": "Africa", "flag": "🌍", "center": [20.0, 5.0], "zoom": 3.0, "badge": "58 countries"},
    ]

    tabs[0]["items"] = highlight_items

    ts_output = """// Generated country database with separated continents and badge statistics (English)
export interface RegionItem {
  id: string;
  name: string;
  flag: string;
  center: [number, number];
  zoom: number;
  badge?: string;
}

export interface RegionTabDefinition {
  id: string;
  label: string;
  icon: string;
  items: RegionItem[];
}

export const REGION_TABS: RegionTabDefinition[] = """ + json.dumps(tabs, ensure_ascii=False, indent=2) + """;

// Flat map for quick lookup by ISO/ID
export const ALL_REGION_OPTIONS: RegionItem[] = Array.from(
  new Map(
    REGION_TABS.flatMap((tab) => tab.items).map((item) => [item.id, item])
  ).values()
);
"""
    with open(catalog_path, "w", encoding="utf-8") as f:
        f.write(ts_output)
    print(f"Updated: {catalog_path}")

if __name__ == "__main__":
    main()
