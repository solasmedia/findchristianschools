-- Data cleanup (2026-10-13 site audit, data artifacts): one school record's
-- name carries stray leading/trailing dashes: "-- Mansfield Christian School-".
-- Normalize it to the school's real name.
--
-- Matched on the exact current name string rather than the slug: the slug
-- cannot be verified without production database access, while this exact
-- artifact string is unique to the one bad record. The UPDATE is a no-op
-- once applied (the WHERE no longer matches), and it touches no other row.
UPDATE `schools` SET `name` = 'Mansfield Christian School' WHERE `name` = '-- Mansfield Christian School-';
