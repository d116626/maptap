"""Checks that every region named in frontend/public/data/tips/*.json exists in regions.geojson."""

import json
import sys
from pathlib import Path

PUBLIC_DATA = Path(__file__).resolve().parent.parent / "frontend" / "public" / "data"


def main() -> int:
    regions = json.loads((PUBLIC_DATA / "regions.geojson").read_text())
    names_by_country: dict[str, set[str]] = {}
    for feature in regions["features"]:
        props = feature["properties"]
        names_by_country.setdefault(props["country_code"], set()).add(props["name"])

    errors = 0
    tip_files = sorted((PUBLIC_DATA / "tips").glob("*.json"))
    for path in tip_files:
        tips = json.loads(path.read_text())
        code = tips["country_code"]
        known = names_by_country.get(code, set())
        if not known:
            print(f"{path.name}: no regions for country {code}")
            errors += 1
        for section in tips["sections"]:
            for item in section["items"]:
                for region in item.get("regions", []):
                    if region not in known:
                        print(f"{path.name} [{section['id']}]: unknown region '{region}'")
                        errors += 1

    print(f"Checked {len(tip_files)} tips file(s): {errors} error(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
