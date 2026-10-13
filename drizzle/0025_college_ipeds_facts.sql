-- College IPEDS facts enrichment (2026-10-13).
-- Adds federal-data fact columns to colleges, populated by
-- server/scripts/importIpeds.ts from IPEDS bulk downloads (NCES):
--   tuition              published tuition & fees per year (undergraduate,
--                        in-state where the institution distinguishes)
--   graduationRate       overall graduation rate (% within 150% of normal time)
--   highestDegreeOffered label derived from HD HLOFFER (IPEDS award levels)
--   ipedsDataYear        survey vintage the facts came from, e.g. '2023-24'
-- All columns are nullable: colleges with no confident IPEDS match keep
-- NULLs and the profile page simply renders no College Facts panel.
-- Safe to re-run only in the sense that ADD COLUMN will error if the column
-- already exists; apply exactly once per environment.
ALTER TABLE `colleges` ADD COLUMN `tuition` int NULL;
ALTER TABLE `colleges` ADD COLUMN `graduationRate` decimal(5,2) NULL;
ALTER TABLE `colleges` ADD COLUMN `highestDegreeOffered` varchar(64) NULL;
ALTER TABLE `colleges` ADD COLUMN `ipedsDataYear` varchar(16) NULL;
