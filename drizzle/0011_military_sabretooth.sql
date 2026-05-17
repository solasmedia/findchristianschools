ALTER TABLE `courses` MODIFY COLUMN `schoolId` int;--> statement-breakpoint
ALTER TABLE `courses` ADD `categoryId` int;--> statement-breakpoint
ALTER TABLE `courses` ADD `ageRange` varchar(64);--> statement-breakpoint
ALTER TABLE `courses` ADD `type` enum('course','class','workshop','program') DEFAULT 'class' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `isFeatured` boolean DEFAULT false NOT NULL;