#!/usr/bin/env python3
"""
Import Christian colleges from IPEDS data.
Downloads HD2023 (institution info) and IC2023 (religious affiliation),
joins on UNITID, filters for Christian affiliations, outputs import-ready JSON.

Facts only (names, addresses) - no copyrighted content. IPEDS data is explicitly
free to use per NCES guidance.
"""
import csv
import json
import os
import re
import sys
import urllib.request
import zipfile

DATA_DIR = "/tmp/ipeds"
os.makedirs(DATA_DIR, exist_ok=True)

# IPEDS RELAFFIL code -> denomination name (identified empirically from 2023 data)
DENOMINATIONS = {
    "22": "Evangelical Lutheran", "24": "African Methodist Episcopal",
    "27": "Assemblies of God", "28": "Brethren Church",
    "30": "Roman Catholic",
    "33": "Wisconsin Evangelical Lutheran Synod", "34": "Christian and Missionary Alliance",
    "35": "Christian Reformed Church", "37": "Evangelical Covenant Church",
    "38": "Evangelical Free Church", "39": "Evangelical Lutheran Church in America",
    "41": "Free Will Baptist", "42": "Interdenominational",
    "43": "Mennonite Brethren", "44": "Moravian Church",
    "45": "Nondenominational", "47": "Pentecostal",
    "48": "Christian Churches/Churches of Christ", "49": "Reformed Church in America",
    "50": "Episcopal", "51": "African Methodist Episcopal",
    "52": "American Baptist", "54": "Southern Baptist",
    "55": "Christian Methodist Episcopal", "57": "Church of God (Anderson)",
    "58": "Church of the Brethren", "59": "Church of the Nazarene",
    "60": "Presbyterian", "61": "Christian Church (Disciples of Christ)",
    "64": "Free Methodist", "65": "Friends (Quaker)",
    "66": "Presbyterian Church (USA)", "67": "Lutheran",
    "68": "Lutheran Church-Missouri Synod", "69": "Mennonite",
    "71": "United Methodist", "73": "Episcopal",
    "74": "Churches of Christ", "75": "Southern Baptist",
    "76": "United Church of Christ", "78": "Interdenominational",
    "79": "International Church of the Foursquare Gospel",
    "81": "Reformed Presbyterian", "84": "Church of the United Brethren",
    "87": "Baptist General Conference", "88": "Nondenominational/Evangelical",
    "89": "Wesleyan Church", "91": "Greek Orthodox",
    "92": "Orthodox", "94": "Latter-day Saints",
    "95": "Seventh-day Adventist", "97": "Presbyterian Church in America",
    "99": "Community of Christ", "100": "Free Will Baptist",
    "102": "Independent/Fundamentalist", "103": "Presbyterian",
    "105": "General Baptist", "107": "Plymouth Brethren",
    "108": "Interdenominational", "110": "Orthodox",
}

# Codes to EXCLUDE (not Christian)
EXCLUDE_CODES = {"80", "93"}  # 80=Jewish, 93=Unitarian Universalist

# Codes to FLAG for manual review (theologically distinct - Dave decides)
FLAG_CODES = {"30", "91", "92", "94", "95", "110"}  # Catholic, Orthodox, LDS, Adventist

STATE_NAMES = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
    "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
    "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
    "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire",
    "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina",
    "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania",
    "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee",
    "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington",
    "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming", "DC": "District of Columbia",
    "PR": "Puerto Rico", "GU": "Guam", "VI": "Virgin Islands",
}


def download(url, dest):
    if os.path.exists(dest):
        print(f"  Using cached {dest}")
        return
    print(f"  Downloading {url}...")
    urllib.request.urlretrieve(url, dest)
    print(f"  Saved {dest}")


def slugify(name):
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:200]


def main():
    # Download data files
    hd_zip = os.path.join(DATA_DIR, "HD2023.zip")
    ic_zip = os.path.join(DATA_DIR, "IC2023.zip")
    download("https://nces.ed.gov/ipeds/datacenter/data/HD2023.zip", hd_zip)
    download("https://nces.ed.gov/ipeds/datacenter/data/IC2023.zip", ic_zip)

    with zipfile.ZipFile(hd_zip) as z:
        z.extract("HD2023.csv", DATA_DIR)
    with zipfile.ZipFile(ic_zip) as z:
        z.extract("IC2023.csv", DATA_DIR)

    # Load HD (institution info)
    print("Loading HD2023 (institution info)...")
    hd = {}
    with open(os.path.join(DATA_DIR, "HD2023.csv"), encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            uid = row["UNITID"].strip()
            hd[uid] = row
    print(f"  {len(hd)} institutions")

    # Load IC (religious affiliation) and filter
    print("Loading IC2023 (religious affiliation) and filtering...")
    colleges = []
    flagged = []
    seen_slugs = set()

    with open(os.path.join(DATA_DIR, "IC2023.csv"), encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            code = (row.get("RELAFFIL") or "").strip()
            if not code or code == "-2" or code in EXCLUDE_CODES:
                continue
            if code not in DENOMINATIONS:
                continue  # Unknown code, skip

            uid = row["UNITID"].strip()
            info = hd.get(uid)
            if not info:
                continue

            name = info["INSTNM"].strip()
            city = info["CITY"].strip().title()
            state_code = info["STABBR"].strip()
            if state_code not in STATE_NAMES:
                continue

            slug = slugify(name)
            # Dedupe slugs
            base_slug = slug
            n = 2
            while slug in seen_slugs:
                slug = f"{base_slug}-{n}"
                n += 1
            seen_slugs.add(slug)

            website = (info.get("WEBADDR") or "").strip()
            if website and not website.startswith("http"):
                website = "https://" + website

            # Clean phone: take first 10 digits only (IPEDS appends extensions)
            raw_phone = re.sub(r'[^0-9]', '', (info.get("GENTELE") or ""))
            phone = raw_phone[:10] if len(raw_phone) >= 10 else raw_phone

            college = {
                "name": name,
                "slug": slug,
                "city": city,
                "state": STATE_NAMES[state_code],
                "stateCode": state_code,
                "zip": (info.get("ZIP") or "").strip()[:10],
                "address": (info.get("ADDR") or "").strip(),
                "phone": phone,
                "website": website[:512] if website else None,
                "denomination": DENOMINATIONS[code],
                "ipedsUnitId": uid,
                "latitude": float(info["LATITUDE"]) if info.get("LATITUDE", "").strip() not in ("", "-2") else None,
                "longitude": float(info["LONGITUD"]) if info.get("LONGITUD", "").strip() not in ("", "-2") else None,
                "source": "ipeds",
                "sourceUrl": f"https://nces.ed.gov/collegenavigator/?id={uid}",
                "listingStatus": "unverified",
                "needsReview": code in FLAG_CODES,
            }

            if code in FLAG_CODES:
                flagged.append(college)
            else:
                colleges.append(college)

    out_path = os.path.join(DATA_DIR, "colleges_import.json")
    with open(out_path, "w") as f:
        json.dump(colleges, f, indent=1)

    flagged_path = os.path.join(DATA_DIR, "colleges_flagged.json")
    with open(flagged_path, "w") as f:
        json.dump(flagged, f, indent=1)

    print(f"\nRESULTS:")
    print(f"  Christian colleges (import-ready): {len(colleges)}")
    print(f"  Flagged for review (Catholic/Orthodox/LDS/Adventist): {len(flagged)}")
    print(f"  Output: {out_path}")
    print(f"  Flagged: {flagged_path}")

    # State breakdown
    from collections import Counter
    states = Counter(c["stateCode"] for c in colleges)
    print(f"\nTop 10 states:")
    for s, n in states.most_common(10):
        print(f"  {s}: {n}")


if __name__ == "__main__":
    main()
