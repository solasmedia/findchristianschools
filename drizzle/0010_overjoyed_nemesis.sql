CREATE TABLE `courseCategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`description` text,
	`icon` varchar(64),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `courseCategories_id` PRIMARY KEY(`id`),
	CONSTRAINT `courseCategories_slug_unique` UNIQUE(`slug`)
);
