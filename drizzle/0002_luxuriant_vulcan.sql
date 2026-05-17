ALTER TABLE `schools` ADD `address` varchar(512);--> statement-breakpoint
ALTER TABLE `schools` ADD `missionStatement` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `galleryImages` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `studentTeacherRatio` varchar(20);--> statement-breakpoint
ALTER TABLE `schools` ADD `yearFounded` int;--> statement-breakpoint
ALTER TABLE `schools` ADD `hasTransportation` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `hasLunchProgram` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `hasAfterSchool` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `hasSpecialNeeds` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `hasSports` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `hasArts` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `hasSTEM` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `uniformRequired` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `acceptsVouchers` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `schools` ADD `sportsOffered` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `extracurriculars` text;--> statement-breakpoint
ALTER TABLE `schools` ADD `contactName` varchar(255);--> statement-breakpoint
ALTER TABLE `schools` ADD `contactTitle` varchar(128);--> statement-breakpoint
ALTER TABLE `schools` ADD `contactPhone` varchar(20);--> statement-breakpoint
ALTER TABLE `schools` ADD `contactEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `schools` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `schools` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `schools` ADD `isApproved` boolean DEFAULT false NOT NULL;