-- Add verification fields to schools table
ALTER TABLE `schools` ADD COLUMN `googleBusinessProfileUrl` varchar(512);
ALTER TABLE `schools` ADD COLUMN `einOrStateRegNumber` varchar(64);
ALTER TABLE `schools` ADD COLUMN `certifiedAccurate` boolean DEFAULT false;
ALTER TABLE `schools` ADD COLUMN `verificationChecklist` text;
ALTER TABLE `schools` ADD COLUMN `verificationNotes` text;
ALTER TABLE `schools` ADD COLUMN `verifiedAt` timestamp;
ALTER TABLE `schools` ADD COLUMN `verifiedBy` varchar(255);
ALTER TABLE `schools` ADD COLUMN `prescreenFlags` text;

-- Modify listingStatus enum to add suspended and community_submitted
ALTER TABLE `schools` MODIFY COLUMN `listingStatus` enum('verified','unverified','pending','claimed','removed','suspended','community_submitted') NOT NULL DEFAULT 'unverified';

-- Create report_listings table
CREATE TABLE `report_listings` (
  `id` int AUTO_INCREMENT NOT NULL,
  `schoolId` int NOT NULL,
  `schoolName` varchar(255),
  `reason` enum('fraudulent','incorrect_info','inappropriate','closed','safety_concern','other') NOT NULL,
  `details` text,
  `reporterEmail` varchar(320),
  `reporterName` varchar(255),
  `status` enum('pending','reviewed','actioned','dismissed') NOT NULL DEFAULT 'pending',
  `adminNotes` text,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `report_listings_id` PRIMARY KEY(`id`)
);
