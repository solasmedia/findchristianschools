CREATE TABLE `donations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`donorName` varchar(255),
	`donorEmail` varchar(320),
	`message` text,
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('open_house','conference','fundraiser','workshop','missions','other') NOT NULL DEFAULT 'other',
	`location` varchar(255),
	`state` varchar(64),
	`stateCode` varchar(2),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`website` varchar(512),
	`schoolId` int,
	`imageUrl` varchar(512),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `impact_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricName` varchar(128) NOT NULL,
	`metricValue` int NOT NULL,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `impact_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schoolId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('teacher','administrator','support_staff','coach','other') NOT NULL DEFAULT 'other',
	`location` varchar(255),
	`state` varchar(64),
	`stateCode` varchar(2),
	`salaryRange` varchar(64),
	`employmentType` enum('full_time','part_time','contract') NOT NULL DEFAULT 'full_time',
	`applyUrl` varchar(512),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`category` enum('curriculum','coop','tutor','online_course','testing','special_needs','college_prep','other') NOT NULL DEFAULT 'other',
	`website` varchar(512),
	`state` varchar(64),
	`imageUrl` varchar(512),
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resources_id` PRIMARY KEY(`id`),
	CONSTRAINT `resources_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`city` varchar(128) NOT NULL,
	`state` varchar(64) NOT NULL,
	`stateCode` varchar(2) NOT NULL,
	`zip` varchar(10) NOT NULL,
	`phone` varchar(20),
	`website` varchar(512),
	`email` varchar(320),
	`description` text,
	`logoUrl` varchar(512),
	`coverImageUrl` varchar(512),
	`gradeStart` varchar(10),
	`gradeEnd` varchar(10),
	`programType` enum('traditional','online','hybrid','homeschool_coop','boarding') NOT NULL DEFAULT 'traditional',
	`tuitionType` enum('free','tuition_assisted','tuition_based') NOT NULL DEFAULT 'tuition_based',
	`tuitionMin` int,
	`tuitionMax` int,
	`enrollment` int,
	`denomination` varchar(128),
	`accreditation` varchar(255),
	`statementOfFaith` text,
	`isPremium` boolean NOT NULL DEFAULT false,
	`premiumExpiresAt` timestamp,
	`ownerId` int,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schools_id` PRIMARY KEY(`id`),
	CONSTRAINT `schools_slug_unique` UNIQUE(`slug`)
);
