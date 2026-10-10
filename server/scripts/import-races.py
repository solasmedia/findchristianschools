#!/usr/bin/env python3
"""
Import Christian races from RunSignup public API.
Uses https://api.runsignup.com/rest/races (no key needed, built for aggregation).
Filters by Christian keywords. Extracts FACTS ONLY - never copies full descriptions.
"""
import json
import os
import re
import sys
import urllib.request
import urllib.parse
from html import unescape

DATA_DIR = "/tmp/races"
os.makedirs(DATA_DIR, exist_ok=True)

# Christian keywords to search/filter
KEYWORDS = [
    "church", "faith", "christian", "ministry", "bible", "worship",
    "gospel", "christ", "jesus", "catholic", "baptist", "methodist",
    "lutheran", "presbyterian", "chapel", "parish", "diocese",
    "run for god", "god", "prayer", "mission",
]

# Keywords that indicate NOT a fit (exclude)
EXCLUDE_KEYWORDS = [
    "bar crawl", "beer", "wine", "brewery", "pub crawl", "cocktail",
]

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
}


def api_get(params):
    url = "https://api.runsignup.com/rest/races?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "FindChristianSchools/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def strip_html(html):
    text = re.sub(r"<[^>]+>", " ", html or "")
    text = unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def is_christian_race(name, description):
    text = (name + " " + description).lower()
    for ex in EXCLUDE_KEYWORDS:
        if ex in text:
            return False
    for kw in KEYWORDS:
        # Word boundary match for short keywords
        if len(kw) <= 4:
            if re.search(r"\b" + re.escape(kw) + r"\b", text):
                return True
        elif kw in text:
            return True
    return False


def make_summary(name, description, distances):
    """Create a brief factual summary - NOT a copy of the description."""
    desc_text = strip_html(description)
    # Take first sentence or first 150 chars as factual basis, then summarize
    first = desc_text.split(".")[0][:150].strip()
    parts = [f"{name}."]
    if distances:
        parts.append(f"Distances: {distances}.")
    if first and len(first) > 20:
        parts.append(first + ".")
    summary = " ".join(parts)
    return summary[:500]


def slugify(name, race_id):
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:150]
    return f"{s}-{race_id}"


def main():
    print("Fetching races from RunSignup API...")
    all_races = []
    seen_ids = set()

    # Search each keyword
    for kw in ["church", "christian", "faith", "ministry", "bible", "worship", "gospel"]:
        print(f"  Searching: {kw}")
        page = 1
        while True:
            try:
                data = api_get({
                    "format": "json",
                    "name": kw,
                    "results_per_page": 200,
                    "page": page,
                    "start_date": "2026-10-10",
                    "only_partner_races": "F",
                })
            except Exception as e:
                print(f"    Error on page {page}: {e}")
                break

            races = data.get("races", [])
            if not races:
                break

            for item in races:
                race = item.get("race", {})
                rid = race.get("race_id")
                if rid in seen_ids:
                    continue
                if race.get("is_draft_race") == "T" or race.get("is_private_race") == "T":
                    continue
                seen_ids.add(rid)
                all_races.append(race)

            # Check pagination
            total = int(data.get("total", 0))
            if page * 200 >= total:
                break
            page += 1
            if page > 10:  # Safety cap
                break

    print(f"\n  Total unique races fetched: {len(all_races)}")

    # Filter for Christian races
    print("Filtering for Christian races...")
    results = []
    seen_slugs = set()

    for race in all_races:
        name = race.get("name", "").strip()
        desc = race.get("description", "")
        if not is_christian_race(name, desc):
            continue

        addr = race.get("address", {}) or {}
        state_code = (addr.get("state") or "").strip().upper()
        if state_code not in STATE_NAMES:
            continue

        # Parse date
        next_date = race.get("next_date", "")
        race_date = None
        m = re.match(r"(\d{2})/(\d{2})/(\d{4})", next_date)
        if m:
            race_date = f"{m.group(3)}-{m.group(1)}-{m.group(2)}"

        # Get distances from events if available
        distances = ""
        # (events endpoint would need separate call; use name parsing)
        dist_match = re.findall(r"\b(5K|10K|half marathon|marathon|1 mile|5 mile|10 mile|15K|50K|ultra)\b", name, re.I)
        if dist_match:
            distances = ", ".join(sorted(set(d.upper() for d in dist_match)))

        slug = slugify(name, race.get("race_id"))
        base = slug
        n = 2
        while slug in seen_slugs:
            slug = f"{base}-{n}"
            n += 1
        seen_slugs.add(slug)

        results.append({
            "name": name[:255],
            "slug": slug,
            "raceDate": race_date,
            "city": (addr.get("city") or "").strip()[:128],
            "state": STATE_NAMES[state_code],
            "stateCode": state_code,
            "zip": (addr.get("zipcode") or "").strip()[:10],
            "distances": distances[:512],
            "summary": make_summary(name, desc, distances),
            "signupUrl": race.get("url", "")[:512],
            "runsignupId": str(race.get("race_id", "")),
            "source": "runsignup",
            "sourceUrl": race.get("url", "")[:512],
            "listingStatus": "unverified",
        })

    out_path = os.path.join(DATA_DIR, "races_import.json")
    with open(out_path, "w") as f:
        json.dump(results, f, indent=1)

    print(f"\nRESULTS:")
    print(f"  Christian races found: {len(results)}")
    print(f"  Output: {out_path}")

    from collections import Counter
    states = Counter(r["stateCode"] for r in results)
    print(f"\nTop 10 states:")
    for s, n in states.most_common(10):
        print(f"  {s}: {n}")

    print(f"\nSample races:")
    for r in results[:5]:
        print(f"  - {r['name'][:60]} ({r['city']}, {r['stateCode']}) {r['raceDate']}")


if __name__ == "__main__":
    main()
