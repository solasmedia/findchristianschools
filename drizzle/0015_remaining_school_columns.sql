-- Add remaining schema columns missing from earlier migrations
ALTER TABLE `schools` ADD COLUMN `donationAmount` int;
ALTER TABLE `schools` ADD COLUMN `listingType` enum('free','donate','premium') NOT NULL DEFAULT 'free';
ALTER TABLE `schools` ADD COLUMN `schoolClaimed` boolean DEFAULT false NOT NULL;
ALTER TABLE `schools` ADD COLUMN `schoolId` varchar(64);
ALTER TABLE `schools` ADD COLUMN `stripePaymentIntentId` varchar(255);
