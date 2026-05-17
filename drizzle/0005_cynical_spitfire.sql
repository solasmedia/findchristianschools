CREATE TABLE `saved_schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`schoolId` int NOT NULL,
	`schoolType` enum('domestic','international') NOT NULL DEFAULT 'domestic',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_schools_id` PRIMARY KEY(`id`)
);
