-- Vacation Bible School (VBS) becomes a first-class Enrichment & Activities
-- category (Dave, 2026-10-12: "VBS for sure should be on there"). Churches
-- list their VBS through the standard enrichment submission flow and parents
-- find programs at /enrichment/vbs, surfaced from /parents.
-- ALTER ... MODIFY restates the FULL enum (existing values + 'vbs'), so the
-- statement is safe to re-run: applying the same definition twice is a no-op.
ALTER TABLE `enrichment_listings` MODIFY `category` enum('tutor','classes','sports','camps','youth_groups','music_arts','homeschool_coop','vbs') NOT NULL;
