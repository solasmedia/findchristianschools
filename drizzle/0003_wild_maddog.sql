CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(128),
	`lastName` varchar(128),
	`state` varchar(64),
	`isActive` boolean NOT NULL DEFAULT true,
	`source` varchar(64) DEFAULT 'signup',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `rate_limit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ip` varchar(64) NOT NULL,
	`endpoint` varchar(255) NOT NULL,
	`count` int NOT NULL DEFAULT 1,
	`windowStart` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rate_limit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_searches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`query` varchar(255),
	`state` varchar(64),
	`programType` varchar(64),
	`gradeLevel` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_searches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(20),
	`website` varchar(512),
	`sponsorType` enum('event','trip','recognition','general') NOT NULL DEFAULT 'general',
	`message` text,
	`budget` varchar(64),
	`status` enum('pending','approved','active','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sponsors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `firstName` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `lastName` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `state` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `newsletterOptIn` boolean DEFAULT true NOT NULL;