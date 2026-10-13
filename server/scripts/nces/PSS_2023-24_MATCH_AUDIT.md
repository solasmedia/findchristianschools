# NCES PSS 2023-24 → FindChristianSchools Match Audit

Generated 2026-10-13 by `server/scripts/importNcesPss.ts` (dry-run mode)
against the live directory (9,177 schools, pulled from the public
`schools.search` API the same day) and the official NCES Private School
Universe Survey 2023-24 public-use file (`pss2324_pu.csv`, 22,510 records,
downloaded from https://nces.ed.gov/surveys/pss/pssdata.asp — U.S.
government public-use data published for reuse; no license gate beyond the
standard public-use terms).

**Nothing in this audit was written to any database.** The import runs only
when a reviewer executes the production steps at the bottom of this file.

## Results

| Outcome | Count | Share | Meaning |
| --- | ---: | ---: | --- |
| HIGH confidence | 7,121 | 77.6% | Score ≥ 0.80, margin ≥ 0.05 over runner-up, no competing claim. Only these import. (ZIP-block matches: 6,112; city-block: 1,009.) |
| REVIEW | 455 | 5.0% | Plausible but ambiguous: sub-threshold score, thin margin, or duplicate claim (242 rows are duplicate-claim demotions, incl. exact-name matches where PSS lists a school twice or two directory campuses share one PSS record). Never auto-imported; listed in the review CSV the script writes with `--audit-out`. |
| UNMATCHED | 1,601 | 17.4% | No acceptable PSS record (298 had no candidate at all in their state+ZIP or state+city). These schools show no facts panel. Includes schools founded after the 2023-24 survey, online-only programs, and preschools outside the PSS universe. |

Cross-check: an independent prototype implementation of the same algorithm
produced 7,123 / 453 / 1,601 — agreement within 2 rows (tie-breaking), and
the production script is the more conservative of the two (more duplicate
demotions, fewer auto-accepts).

## Edge cases (the script's own printed sample of 20)

REVIEW, closest to the 0.80 accept line — all are true matches held back by
campus suffixes or duplicate claims, which is exactly what the review band
is for:

1. `[0.80 zip DUPE]` Templeton Hills 7th-day Adventist School (Templeton, CA 93465) ↔ TEMPLETON HILLS SEVENTH-DAY ADVENTIST SCHOOL
2. `[0.80 city DUPE]` Gilbert Christian Schools (Gilbert, AZ 85296) ↔ GILBERT CHRISTIAN SCHOOLS - GREENFIELD CAMPUS (85297)
3. `[0.80 zip DUPE]` Worthington Christian Kindergarten/middle School (Worthington, OH 43085) ↔ WORTHINGTON CHRISTIAN SCHOOL
4. `[0.79 zip]` Hawaiian Mission Academy Winward Campus (Kailua, HI 96734) ↔ HAWAIIAN MISSION ACADEMY WINDWARD CAMPUS
5. `[0.79 zip DUPE]` Grace Christian School (Staunton, VA 24401) ↔ GRACE CHRISTIAN SCHOOL - ELEMENTARY/MIDDLE
6. `[0.79 zip]` Cornerstone Schools-washington (Washington, DC 20019) ↔ CORNERSTONE SCHOOLS OF WASHINGTON, DC, INC.
7. `[0.79 zip DUPE]` Front Range Christian Junior/senior High School (Littleton, CO 80128) ↔ FRONT RANGE CHRISTIAN SCHOOL
8. `[0.81 zip DUPE]` Pantego Christian Academy - Arlington Campus (Arlington, TX 76013) ↔ PANTEGO CHRISTIAN ACADEMY

Lowest-margin non-unmatched — exact names with margin 0.00 because PSS
carries two records or two listings claim one record; correctly NOT
auto-attached:

9. `[1.00 m=0.00]` Abner Montessori School (Chapin, SC) ↔ ABNER MONTESSORI SCHOOL
10. `[1.00 m=0.00]` Academy of Excellence (Jacksonville, FL) ↔ ACADEMY OF EXCELLENCE
11. `[1.00 m=0.00]` Ahlberg Academy (Nelson, GA) ↔ AHLBERG ACADEMY
12. `[1.00 m=0.00]` Albuquerque Christian School (Albuquerque, NM) ↔ ALBUQUERQUE CHRISTIAN SCHOOL
13. `[0.87 m=0.00 DUPE]` Amazing Grace Renton Prep Christian School (Renton, WA) ↔ RENTON PREP CHRISTIAN SCHOOL
14. `[1.00 m=0.00]` Ambassador High School (Torrance, CA) ↔ AMBASSADOR HIGH SCHOOL

UNMATCHED despite a superficially similar candidate — correctly rejected:

15. `[0.70]` Regents School of Charlottesville (VA) ↔ FIELD SCHOOL OF CHARLOTTESVILLE (different school)
16. `[0.70]` Northstar Academy (Southaven, MS) ↔ NORTHSTAR INTERNATIONAL ACADEMY ONLINE (different school)
17. `[0.70]` Greater Grace Christian Academy (Baltimore, MD) ↔ GREATER YOUTH CHRISTIAN ACADEMY (different school)
18. `[0.69]` Shepherd's Heart Christian School (Bradenton, FL) ↔ SHEPHERDS HEART CHRISTIAN SCHOOL (probable true match lost to an apostrophe token; lands below the review floor — acceptable loss, recoverable in a future pass)
19. `[0.69]` Kings Court Christian Academy (Greenville, MS) ↔ KING'S COURT CHRISTIAN ACADEMY (same apostrophe effect)
20. `[0.69]` King's Gate Christian School (Yukon, OK) ↔ KINGS GATE CHRISTIAN SCHOOL (same apostrophe effect)

## Fields mapped (PSS → `school_nces_facts`)

| PSS column | Meaning | Stored as |
| --- | --- | --- |
| PPIN | NCES school ID | `ncesSchoolId` |
| PINST | School name as reported | `ncesSchoolName` |
| NUMSTUDS | Total students (K-12 + ungraded) | `totalEnrollment` |
| NUMTEACH | K-12 teachers (FTE) | `fteTeachers` |
| STTCH_RT | Student-teacher ratio | `studentTeacherRatio` (2 dp) |
| ORIENT | Religious orientation code | `religiousOrientation` label (codes 1-29; 30 = nonsectarian/n-a → null) |
| TYPOLOGY | School typology code | `schoolTypology` label |
| Q15 items P455-P555 (flag = 1) | Association memberships | `associations` JSON array |
| Q4 *_ENRL items P140-P300 | Enrollment by grade | `gradeEnrollment` JSON (reported grades only) |

Blanks/non-positive values are stored as NULL and simply not displayed.
No values are estimated, averaged, or interpolated, ever.

## Production import procedure (for reviewer execution — NOT yet run)

1. Deploy this branch. On boot, `server/migrate.ts` applies
   `drizzle/0024_nces_school_facts.sql` (creates the empty side table;
   hash-tracked, idempotent).
2. Download the data on the server or a trusted machine:
   `curl -LO https://nces.ed.gov/surveys/pss/zip/pss2324_pu_csv.zip && unzip pss2324_pu_csv.zip`
3. Dry-run against production data and eyeball the audit:
   `DATABASE_URL=<prod> pnpm tsx server/scripts/importNcesPss.ts --pss pss2324_pu.csv --audit-out ./nces-audit`
   (reads the directory from the DB; expect ≈7,121 HIGH — small drift is
   normal as listings change).
4. Load: same command plus `--apply`. Upserts HIGH matches only into
   `school_nces_facts` (idempotent; re-runnable). The `schools` table is
   never written by this script.
5. Work the review queue from `nces-audit/nces-review-cases.csv` by hand if
   desired; confirmed pairs can be inserted manually with their matchScore
   recorded. Rollback at any point: `DROP TABLE school_nces_facts;` — the
   site behaves exactly as before.
