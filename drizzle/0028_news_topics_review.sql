-- News upgrades: deterministic topic buckets, faith-flag review holds, and topic index
-- No semicolons at the end of comment lines (boot runner splits on them)
ALTER TABLE `news_items` ADD COLUMN `topic` varchar(32) NOT NULL DEFAULT 'general';
ALTER TABLE `news_items` ADD COLUMN `reviewStatus` varchar(16) NOT NULL DEFAULT 'published';
ALTER TABLE `news_items` ADD COLUMN `holdReason` varchar(255) NULL;
CREATE INDEX `idx_news_topic_published` ON `news_items` (`topic`, `publishedAt`);
--> statement-breakpoint
-- Backfill topic for existing rows with the same deterministic keyword rules the fetcher uses
-- Most specific buckets first, each pass only touches rows still in the general bucket
UPDATE `news_items` SET `topic` = 'accreditation' WHERE `topic` = 'general' AND (LOWER(`title`) LIKE '%accredit%' OR LOWER(`summary`) LIKE '%accredit%' OR LOWER(`title`) LIKE '%academic standards%' OR LOWER(`title`) LIKE '%teacher certification%');
UPDATE `news_items` SET `topic` = 'funding_tax_credit' WHERE `topic` = 'general' AND (LOWER(`title`) LIKE '%tax credit%' OR LOWER(`title`) LIKE '%tax-credit%' OR LOWER(`title`) LIKE '%education funding%' OR LOWER(`title`) LIKE '%school funding%' OR LOWER(`title`) LIKE '%federal funding%' OR LOWER(`summary`) LIKE '%tax credit%');
UPDATE `news_items` SET `topic` = 'homeschooling' WHERE `topic` = 'general' AND (LOWER(`title`) LIKE '%homeschool%' OR LOWER(`summary`) LIKE '%homeschool%');
UPDATE `news_items` SET `topic` = 'school_choice_policy' WHERE `topic` = 'general' AND (LOWER(`title`) LIKE '%school choice%' OR LOWER(`title`) LIKE '%voucher%' OR LOWER(`title`) LIKE '%charter school%' OR LOWER(`title`) LIKE '%education savings account%' OR LOWER(`title`) LIKE '%parental rights%' OR LOWER(`summary`) LIKE '%school choice%');
UPDATE `news_items` SET `topic` = 'christian_schools' WHERE `topic` = 'general' AND (LOWER(`title`) LIKE '%christian school%' OR LOWER(`title`) LIKE '%christian academy%' OR LOWER(`title`) LIKE '%catholic school%' OR LOWER(`title`) LIKE '%private school%' OR LOWER(`title`) LIKE '%christian education%' OR LOWER(`summary`) LIKE '%christian school%');
UPDATE `news_items` SET `topic` = 'faith_culture' WHERE `topic` = 'general' AND (LOWER(`title`) LIKE '%religious liberty%' OR LOWER(`title`) LIKE '%religious freedom%' OR LOWER(`title`) LIKE '%first amendment%' OR LOWER(`title`) LIKE '%title ix%' OR LOWER(`summary`) LIKE '%religious liberty%');
