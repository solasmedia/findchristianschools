-- Geocode provenance for schools (2026-10-14)
-- Records where each school's latitude/longitude came from (US Census
-- batch geocoder, with its confidence class) and when it was written,
-- so the map view decision can be gated on verified rooftop-grade
-- coverage and no import ever overwrites a better coordinate class
-- with a worse one
-- Authoring note: no comment line in this file contains a semicolon,
-- because the boot migration runner splits files on semicolons at line
-- ends and a semicolon inside a comment once corrupted migration 0024
ALTER TABLE `schools` ADD COLUMN `geocodeSource` varchar(64) NULL;
--> statement-breakpoint
ALTER TABLE `schools` ADD COLUMN `geocodedAt` timestamp NULL;
