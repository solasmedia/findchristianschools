CREATE TABLE `claim_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schoolId` int NOT NULL,
	`claimantName` varchar(255) NOT NULL,
	`claimantEmail` varchar(320) NOT NULL,
	`claimantPhone` varchar(20),
	`claimantRole` varchar(128) NOT NULL,
	`relationship` text,
	`verificationNotes` text,
	`status` enum('pending','approved','denied') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `claim_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `removal_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schoolId` int NOT NULL,
	`requesterName` varchar(255) NOT NULL,
	`requesterEmail` varchar(320) NOT NULL,
	`requesterPhone` varchar(20),
	`requesterRole` varchar(128) NOT NULL,
	`reason` text NOT NULL,
	`status` enum('pending','approved','denied') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `removal_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `schools` ADD `importSource` varchar(255);--> statement-breakpoint
ALTER TABLE `schools` ADD `importDate` timestamp;--> statement-breakpoint
ALTER TABLE `schools` ADD `sourceId` varchar(64);--> statement-breakpoint
ALTER TABLE `schools` ADD `listingStatus` enum('verified','unverified','claimed','removed') DEFAULT 'verified' NOT NULL;--> statement-breakpoint
ALTER TABLE `schools` ADD `county` varchar(128);