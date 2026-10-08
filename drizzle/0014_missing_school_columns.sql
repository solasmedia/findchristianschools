-- Add columns present in schema.ts but missing from earlier migrations
ALTER TABLE `schools` ADD COLUMN `isVerified` boolean DEFAULT false NOT NULL;
ALTER TABLE `schools` ADD COLUMN `denominationTag` varchar(64);
ALTER TABLE `schools` ADD COLUMN `schoolType` varchar(64);
ALTER TABLE `schools` ADD COLUMN `enrollmentTier` varchar(20);
ALTER TABLE `schools` ADD COLUMN `dataCompletenessScore` int;
ALTER TABLE `schools` ADD COLUMN `needsReview` boolean DEFAULT false;
ALTER TABLE `schools` ADD COLUMN `pointOfContact` varchar(255);
ALTER TABLE `schools` ADD COLUMN `internalNotes` text;
ALTER TABLE `schools` ADD COLUMN `dateLastUpdated` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
