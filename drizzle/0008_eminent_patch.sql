CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schoolId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`gradeLevel` varchar(50) NOT NULL,
	`deliveryType` enum('in_person','online','hybrid') NOT NULL DEFAULT 'in_person',
	`teacherName` varchar(255),
	`maxStudents` int,
	`currentEnrollment` int NOT NULL DEFAULT 0,
	`tuition` int,
	`startDate` date,
	`endDate` date,
	`schedule` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schoolId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`subject` varchar(128),
	`gradeLevel` varchar(50),
	`deliveryType` enum('in_person','online','hybrid') NOT NULL DEFAULT 'in_person',
	`credits` int,
	`tuition` int,
	`maxStudents` int,
	`instructor` varchar(255),
	`startDate` date,
	`endDate` date,
	`schedule` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_schoolId_schools_id_fk` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;