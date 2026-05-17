ALTER TABLE `events` ADD `isApproved` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `submitterName` varchar(255);--> statement-breakpoint
ALTER TABLE `events` ADD `contactEmail` varchar(320);