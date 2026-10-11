-- Add collegeId support to claim requests for college listings
ALTER TABLE `claim_requests` MODIFY COLUMN `schoolId` int NULL;
ALTER TABLE `claim_requests` ADD COLUMN `collegeId` int NULL;

-- Add premium fields to colleges table
ALTER TABLE `colleges` ADD COLUMN `isPremium` boolean NOT NULL DEFAULT false;
ALTER TABLE `colleges` ADD COLUMN `stripeCustomerId` varchar(255) NULL;
ALTER TABLE `colleges` ADD COLUMN `stripeSubscriptionId` varchar(255) NULL;
ALTER TABLE `colleges` ADD COLUMN `stripePaymentIntentId` varchar(255) NULL;
ALTER TABLE `colleges` ADD COLUMN `premiumExpiresAt` timestamp NULL;
