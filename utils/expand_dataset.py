#!/usr/bin/env python3
"""
Pipeline for MapTap dataset expansion (100% English):
1. Extracts subnational regions from Natural Earth 10m Admin 1 for 11 countries in English
2. Processes official MapTap atlas (5,894 locations) with is_maptap_base = True
3. Integrates GeoNames (+100k) cities with is_maptap_base = False
4. Saves 'regions.geojson' and 'cities.json' to frontend/public/data
5. Updates 'countries-catalog.ts' with English tabs and statistics
"""

import csv
import io
import json
import math
import os
import ssl
import urllib.request
import zipfile
from pathlib import Path
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

BASE_DIR = Path(__file__).resolve().parent.parent
CSV_MAPTAP_PATH = BASE_DIR / "data" / "raw" / "maptap-atlas-5894-locations-2026-09-25.csv"
FRONTEND_DATA_DIR = BASE_DIR / "frontend" / "public" / "data"
FRONTEND_TS_DIR = BASE_DIR / "frontend" / "data"

CTX = ssl._create_unverified_context()

COUNTRY_NAMES = {
    "BRA": "Brazil",
    "USA": "United States",
    "CAN": "Canada",
    "MEX": "Mexico",
    "DEU": "Germany",
    "FRA": "France",
    "ESP": "Spain",
    "JPN": "Japan",
    "AUS": "Australia",
    "IND": "India",
    "CHN": "China",
}

COUNTRY_CONTINENTS = {
    "BRA": "South America",
    "USA": "North America",
    "CAN": "North America",
    "MEX": "North America",
    "DEU": "Europe",
    "FRA": "Europe",
    "ESP": "Europe",
    "JPN": "Asia",
    "AUS": "Oceania",
    "IND": "Asia",
    "CHN": "Asia",
}

CONTINENT_NAMES = {
    "South_America": "South America",
    "South America": "South America",
    "North_America": "North America",
    "North America": "North America",
    "Europe": "Europe",
    "Asia": "Asia",
    "Middle_East": "Asia",
    "Middle East": "Asia",
    "Africa": "Africa",
    "Oceania": "Oceania",
}

STATE_EN_OVERRIDES = {
    # Germany
    "Bayern": "Bavaria",
    "Hessen": "Hesse",
    "Niedersachsen": "Lower Saxony",
    "Nordrhein-Westfalen": "North Rhine-Westphalia",
    "Rheinland-Pfalz": "Rhineland-Palatinate",
    "Sachsen": "Saxony",
    "Sachsen-Anhalt": "Saxony-Anhalt",
    "Thüringen": "Thuringia",
    # Spain
    "Andalucía": "Andalusia",
    "Aragón": "Aragon",
    "Canary Is.": "Canary Islands",
    "Castilla y León": "Castile and León",
    "Castilla-La Mancha": "Castile-La Mancha",
    "Cataluña": "Catalonia",
    "Islas Baleares": "Balearic Islands",
    "Madrid": "Community of Madrid",
    "País Vasco": "Basque Country",
    "Valenciana": "Valencian Community",
    # France
    "Bretagne": "Brittany",
    "Bourgogne-Franche-Comté": "Burgundy-Franche-Comté",
    "Corse": "Corsica",
    "Normandie": "Normandy",
    "Nouvelle-Aquitaine": "New Aquitaine",
    "Île-de-France": "Île-de-France",
    "Grand Est": "Grand Est",
}

CUSTOM_COUNTRY_MAP = {
    "united states": "USA", "usa": "USA", "england": "GBR", "scotland": "GBR", "wales": "GBR",
    "northern ireland": "GBR", "united kingdom": "GBR", "georgia (country)": "GEO",
    "côte d'ivoire": "CIV", "cape verde": "CPV", "curacao": "CUW", "sao tome and principe": "STP",
    "guinea bissau": "GNB", "the bahamas": "BHS", "bahamas": "BHS", "congo (republic)": "COG",
    "dr congo": "COD", "democratic republic of the congo": "COD", "democratic republic of the congo/uganda": "COD",
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

def round_coords(geom, precision=3):
    geo = mapping(geom)
    def _r(coords):
        if not coords:
            return coords
        if isinstance(coords[0], (int, float)):
            return [round(coords[0], precision), round(coords[1], precision)]
        return [_r(c) for c in coords]
    geo["coordinates"] = _r(geo["coordinates"])
    return geo

def dist_km(lat1, lon1, lat2, lon2):
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    return 6371 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def clean_city_name(raw_name):
    return raw_name.split(",")[0].strip()

def download_external_resources():
    print("1. Downloading Natural Earth 10m Admin 1...")
    ne_url = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson"
    req = urllib.request.Request(ne_url, headers={"User-Agent": "MapTap/1.0"})
    with urllib.request.urlopen(req, context=CTX) as resp:
        ne_data = json.loads(resp.read().decode("utf-8"))

    print("2. Downloading GeoNames cities15000...")
    cities_url = "https://download.geonames.org/export/dump/cities15000.zip"
    req = urllib.request.Request(cities_url, headers={"User-Agent": "MapTap/1.0"})
    with urllib.request.urlopen(req, context=CTX) as resp:
        cities_zip_data = resp.read()

    print("3. Downloading GeoNames admin1CodesASCII...")
    admin1_url = "https://download.geonames.org/export/dump/admin1CodesASCII.txt"
    req = urllib.request.Request(admin1_url, headers={"User-Agent": "MapTap/1.0"})
    with urllib.request.urlopen(req, context=CTX) as resp:
        admin1_text = resp.read().decode("utf-8")

    return ne_data, cities_zip_data, admin1_text

def build_regions(ne_data):
    print("Building English subnational regions GeoJSON...")
    target_countries = set(COUNTRY_NAMES.keys())

    regions_existing_file = FRONTEND_DATA_DIR / "regions.geojson"
    brazil_features = []
    if regions_existing_file.exists():
        with open(regions_existing_file, "r", encoding="utf-8") as f:
            b_data = json.load(f)
            brazil_features = [
                feat for feat in b_data.get("features", [])
                if feat.get("properties", {}).get("country_code") == "BRA"
            ][:27]

    out_features = []
    for f in brazil_features:
        props = f.get("properties", {})
        props["country"] = "Brazil"
        props["country_code"] = "BRA"
        props["continent"] = "South America"
        out_features.append(f)

    other_countries = [c for c in target_countries if c != "BRA"]

    for country_code in other_countries:
        country_name = COUNTRY_NAMES[country_code]
        continent = COUNTRY_CONTINENTS[country_code]
        country_ne_feats = [
            f for f in ne_data["features"]
            if (f["properties"].get("adm0_a3") == country_code or f["properties"].get("sov_a3") == country_code)
        ]

        if country_code in ("FRA", "ESP"):
            by_region = {}
            for f in country_ne_feats:
                r_name = f["properties"].get("region") or f["properties"].get("name")
                if r_name:
                    by_region.setdefault(r_name, []).append(f)

            for r_name, feats in by_region.items():
                if r_name in ("Clipperton Island", "French Southern and Antarctic Lands"):
                    continue
                geoms = [shape(f["geometry"]) for f in feats if f.get("geometry")]
                merged = unary_union(geoms)
                simplified = merged.simplify(0.012, preserve_topology=True)
                if simplified.is_empty:
                    continue

                display_name = STATE_EN_OVERRIDES.get(r_name, r_name)
                state_code = feats[0]["properties"].get("region_cod") or feats[0]["properties"].get("iso_3166_2") or r_name[:4].upper()
                if "-" in state_code:
                    state_code = state_code.split("-")[-1]

                out_features.append({
                    "type": "Feature",
                    "properties": {
                        "name": display_name,
                        "state_name": display_name,
                        "state_code": state_code,
                        "country": country_name,
                        "country_code": country_code,
                        "continent": continent,
                        "type": "state",
                    },
                    "geometry": round_coords(simplified, precision=3),
                })
        else:
            for f in country_ne_feats:
                p = f["properties"]
                orig_name = p.get("name_en") or p.get("name")
                raw_name = p.get("name")
                display_name = STATE_EN_OVERRIDES.get(raw_name, STATE_EN_OVERRIDES.get(orig_name, orig_name))

                code = p.get("postal") or p.get("iso_3166_2") or p.get("code_local") or ""
                if "-" in code:
                    code = code.split("-")[-1]
                if not code and display_name:
                    code = display_name[:3].upper()

                geom = shape(f["geometry"])
                simplified = geom.simplify(0.012, preserve_topology=True)
                if simplified.is_empty:
                    continue

                out_features.append({
                    "type": "Feature",
                    "properties": {
                        "name": display_name,
                        "state_name": display_name,
                        "state_code": code,
                        "country": country_name,
                        "country_code": country_code,
                        "continent": continent,
                        "type": "state",
                    },
                    "geometry": round_coords(simplified, precision=3),
                })

    print(f"Total subnational regions created: {len(out_features)}")
    return {"type": "FeatureCollection", "features": out_features}

def build_cities(cities_zip_data, admin1_text, countries_geo):
    print("Processing MapTap Atlas CSV in English (5,894 locations)...")
    name_to_iso3 = {feat["properties"]["name"].lower(): feat["properties"]["code"] for feat in countries_geo["features"]}

    def resolve_country(c_name):
        c_lower = c_name.strip().lower()
        if c_lower in CUSTOM_COUNTRY_MAP:
            return CUSTOM_COUNTRY_MAP[c_lower]
        if c_lower in name_to_iso3:
            return name_to_iso3[c_lower]
        for k, v in name_to_iso3.items():
            if k in c_lower or c_lower in k:
                return v
        return "UNK"

    iso3_to_en_name = {}
    for feat in countries_geo["features"]:
        props = feat["properties"]
        iso3_to_en_name[props["code"]] = props["name"]

    for k, v in COUNTRY_NAMES.items():
        iso3_to_en_name[k] = v

    maptap_cities = []

    if CSV_MAPTAP_PATH.exists():
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
                iso3 = resolve_country(c_name)
                country_display = iso3_to_en_name.get(iso3, c_name)
                continent_display = CONTINENT_NAMES.get(cont, cont)

                try:
                    level = int(row.get("level", 1))
                except ValueError:
                    level = 1

                try:
                    find_rate = float(row.get("world_find_rate_pct", 0))
                except ValueError:
                    find_rate = 0.0

                city_item = {
                    "id": f"mt-{loc_id}" if loc_id else f"mt-{clean_name.lower().replace(' ', '-')}",
                    "name": clean_name,
                    "country": country_display,
                    "country_code": iso3,
                    "state": STATE_EN_OVERRIDES.get(prov, prov) if prov else None,
                    "lat": lat,
                    "lng": lng,
                    "population": 0,
                    "is_capital": (level == 1 and prov == ""),
                    "continent": continent_display,
                    "is_maptap_base": True,
                    "level": level,
                    "world_find_rate_pct": find_rate,
                }
                maptap_cities.append(city_item)

    print(f"MapTap Atlas locations processed: {len(maptap_cities)}")

    # 2. Process GeoNames > 100k
    print("Processing GeoNames cities (+100k) for the 11 key countries...")
    admin1_map = {}
    for line in admin1_text.splitlines():
        parts = line.strip().split("\t")
        if len(parts) >= 2:
            admin1_map[parts[0]] = parts[1]

    iso2_to_iso3 = {
        "BR": "BRA", "US": "USA", "CN": "CHN", "IN": "IND",
        "AU": "AUS", "CA": "CAN", "MX": "MEX", "DE": "DEU",
        "FR": "FRA", "ES": "ESP", "JP": "JPN"
    }

    z = zipfile.ZipFile(io.BytesIO(cities_zip_data))
    new_cities = []

    with z.open("cities15000.txt") as f:
        for line in f:
            parts = line.decode("utf-8", errors="ignore").strip().split("\t")
            if len(parts) <= 14:
                continue

            iso2 = parts[8]
            if iso2 not in iso2_to_iso3:
                continue

            iso3 = iso2_to_iso3[iso2]
            try:
                pop = int(parts[14])
            except ValueError:
                pop = 0

            if pop < 100000:
                continue

            lat = round(float(parts[4]), 4)
            lng = round(float(parts[5]), 4)
            name = parts[1]
            ascii_name = parts[2]
            geoname_id = parts[0]
            admin1_code = parts[10]

            matched_maptap = None
            for mc in maptap_cities:
                if mc["country_code"] == iso3:
                    if dist_km(lat, lng, mc["lat"], mc["lng"]) < 18:
                        matched_maptap = mc
                        break

            if matched_maptap:
                if matched_maptap.get("population", 0) == 0:
                    matched_maptap["population"] = pop
                continue

            admin_key = f"{iso2}.{admin1_code}"
            state_name = admin1_map.get(admin_key, "")
            state_clean = STATE_EN_OVERRIDES.get(state_name, state_name)

            slug = ascii_name.lower().replace(" ", "-").replace("'", "").replace(".", "")
            city_item = {
                "id": f"geo-{geoname_id}-{slug}",
                "name": name,
                "country": COUNTRY_NAMES[iso3],
                "country_code": iso3,
                "state": state_clean or None,
                "state_code": admin1_code if len(admin1_code) <= 4 else None,
                "lat": lat,
                "lng": lng,
                "population": pop,
                "is_capital": False,
                "continent": COUNTRY_CONTINENTS[iso3],
                "is_maptap_base": False,
            }
            new_cities.append(city_item)

    print(f"New +100k cities added outside MapTap base: {len(new_cities)}")
    all_cities = maptap_cities + new_cities
    print(f"Total overall cities: {len(all_cities)}")

    return {
        "version": "2.2.0",
        "updated_at": "2026-09-25T21:15:00.000Z",
        "cities": all_cities,
    }

def update_all(regions_geojson, cities_data, countries_geo):
    regions_file = FRONTEND_DATA_DIR / "regions.geojson"
    with open(regions_file, "w", encoding="utf-8") as f:
        json.dump(regions_geojson, f, ensure_ascii=False)
    print(f"Saved: {regions_file} ({regions_file.stat().st_size / 1024:.1f} KB)")

    cities_file = FRONTEND_DATA_DIR / "cities.json"
    with open(cities_file, "w", encoding="utf-8") as f:
        json.dump(cities_data, f, ensure_ascii=False)
    print(f"Saved: {cities_file} ({cities_file.stat().st_size / 1024:.1f} KB)")

    from collections import Counter
    cities_by_country = Counter(c["country_code"] for c in cities_data["cities"])
    maptap_by_country = Counter(c["country_code"] for c in cities_data["cities"] if c.get("is_maptap_base"))
    regions_by_country = Counter(f["properties"]["country_code"] for f in regions_geojson["features"])

    # Load existing countries-catalog
    catalog_path = FRONTEND_TS_DIR / "countries-catalog.ts"
    with open(catalog_path, "r", encoding="utf-8") as f:
        content = f.read()

    prefix = "export const REGION_TABS: RegionTabDefinition[] = "
    start_idx = content.find(prefix) + len(prefix)
    end_idx = content.rfind(";\n\n// Flat map")
    json_str = content[start_idx:end_idx].strip()
    tabs = json.loads(json_str)

    # Translate tab labels to English
    tab_label_map = {
        "main": ("Highlights", "⭐"),
        "south_america": ("S. America", "🌎"),
        "north_america": ("N. America", "🌎"),
        "europe": ("Europe", "🇪🇺"),
        "asia": ("Asia", "🌏"),
        "africa": ("Africa", "🌍"),
        "oceania": ("Oceania", "🏝️"),
    }

    # Also translate country names in catalog to English
    with open("/tmp/rest_countries.json", "r", encoding="utf-8") as rf:
        rest_data = json.load(rf)
    rest_en_map = {r.get("cca3"): r.get("name", {}).get("common") for r in rest_data if r.get("cca3")}

    for tab in tabs:
        tid = tab["id"]
        if tid in tab_label_map:
            tab["label"], tab["icon"] = tab_label_map[tid]

        for item in tab["items"]:
            cid = item["id"]
            if cid in rest_en_map and rest_en_map[cid]:
                item["name"] = rest_en_map[cid]

            num_reg = regions_by_country.get(cid, 0)
            num_cit = cities_by_country.get(cid, 0)
            if num_reg > 0 and num_cit > 0:
                item["badge"] = f"{num_reg} regions | {num_cit} cities"
            elif num_cit > 0:
                item["badge"] = f"{num_cit} cities"
            elif num_reg > 0:
                item["badge"] = f"{num_reg} regions"

    # Fix continent items inside tabs
    continent_name_map = {
        "SOUTH_AMERICA": "South America",
        "NORTH_AMERICA": "North America",
        "EUR": "Europe",
        "ASIA": "Asia",
        "AFRICA": "Africa",
        "OCEANIA": "Oceania",
        "ALL": "Whole World",
    }
    for tab in tabs:
        for item in tab["items"]:
            if item["id"] in continent_name_map:
                item["name"] = continent_name_map[item["id"]]

    main_tab_items = [
        {"id": "ALL", "name": "Whole World", "flag": "🌍", "center": [0, 20], "zoom": 1.8, "badge": f"{len(countries_geo['features'])} countries"},
        {"id": "SOUTH_AMERICA", "name": "South America", "flag": "🌎", "center": [-58.0, -20.0], "zoom": 3.2, "badge": "13 countries"},
        {"id": "BRA", "name": "Brazil", "flag": "🇧🇷", "center": [-47.89, -15.79], "zoom": 4.0, "badge": f"{regions_by_country['BRA']} regions | {cities_by_country['BRA']} cities"},
        {"id": "USA", "name": "United States", "flag": "🇺🇸", "center": [-98.57, 39.82], "zoom": 3.8, "badge": f"{regions_by_country['USA']} regions | {cities_by_country['USA']} cities"},
        {"id": "CAN", "name": "Canada", "flag": "🇨🇦", "center": [-106.34, 56.13], "zoom": 3.5, "badge": f"{regions_by_country['CAN']} regions | {cities_by_country['CAN']} cities"},
        {"id": "MEX", "name": "Mexico", "flag": "🇲🇽", "center": [-102.55, 23.63], "zoom": 4.5, "badge": f"{regions_by_country['MEX']} regions | {cities_by_country['MEX']} cities"},
        {"id": "NORTH_AMERICA", "name": "North America", "flag": "🌎", "center": [-98.57, 39.82], "zoom": 3.2, "badge": "39 countries"},
        {"id": "DEU", "name": "Germany", "flag": "🇩🇪", "center": [10.45, 51.16], "zoom": 5.0, "badge": f"{regions_by_country['DEU']} regions | {cities_by_country['DEU']} cities"},
        {"id": "FRA", "name": "France", "flag": "🇫🇷", "center": [2.21, 46.22], "zoom": 5.0, "badge": f"{regions_by_country['FRA']} regions | {cities_by_country['FRA']} cities"},
        {"id": "ESP", "name": "Spain", "flag": "🇪🇸", "center": [-3.74, 40.46], "zoom": 5.0, "badge": f"{regions_by_country['ESP']} regions | {cities_by_country['ESP']} cities"},
        {"id": "EUR", "name": "Europe", "flag": "🇪🇺", "center": [10.0, 50.0], "zoom": 3.8, "badge": "53 countries"},
        {"id": "CHN", "name": "China", "flag": "🇨🇳", "center": [104.19, 35.86], "zoom": 3.8, "badge": f"{regions_by_country['CHN']} regions | {cities_by_country['CHN']} cities"},
        {"id": "IND", "name": "India", "flag": "🇮🇳", "center": [78.96, 20.59], "zoom": 4.0, "badge": f"{regions_by_country['IND']} regions | {cities_by_country['IND']} cities"},
        {"id": "JPN", "name": "Japan", "flag": "🇯🇵", "center": [138.25, 36.20], "zoom": 4.8, "badge": f"{regions_by_country['JPN']} regions | {cities_by_country['JPN']} cities"},
        {"id": "ASIA", "name": "Asia", "flag": "🌏", "center": [100.0, 35.0], "zoom": 3.0, "badge": "50 countries"},
        {"id": "AUS", "name": "Australia", "flag": "🇦🇺", "center": [133.77, -25.27], "zoom": 3.8, "badge": f"{regions_by_country['AUS']} regions | {cities_by_country['AUS']} cities"},
        {"id": "OCEANIA", "name": "Oceania", "flag": "🏝️", "center": [133.77, -25.27], "zoom": 3.5, "badge": "28 countries"},
        {"id": "AFRICA", "name": "Africa", "flag": "🌍", "center": [20.0, 5.0], "zoom": 3.0, "badge": "58 countries"},
    ]

    tabs[0]["items"] = main_tab_items

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

    print("countries-catalog.ts successfully generated in English!")

if __name__ == "__main__":
    with open(FRONTEND_DATA_DIR / "countries.geojson", "r", encoding="utf-8") as f:
        countries_geo = json.load(f)

    ne_data, cities_zip_data, admin1_text = download_external_resources()
    regions_geojson = build_regions(ne_data)
    cities_data = build_cities(cities_zip_data, admin1_text, countries_geo)
    update_all(regions_geojson, cities_data, countries_geo)
