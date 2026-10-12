-- Teacher Toolkit (/teacher-toolkit):
-- 1. Events audience taxonomy — tag events by who they are for so teacher
--    events (PD, conferences, training) can surface in the Toolkit.
-- 2. Teacher Forum founding-teachers waitlist (phase 1: interest +
--    attestation capture only; forum access opens after admin validation).
ALTER TABLE `events` ADD COLUMN `audience` enum('families','teachers','students','pastors','all') NOT NULL DEFAULT 'all';
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `teacher_forum_waitlist` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL,
  `schoolName` varchar(255) NOT NULL,
  `schoolCity` varchar(128) NULL,
  `schoolState` varchar(64) NULL,
  `role` enum('teacher','admin','homeschool') NOT NULL DEFAULT 'teacher',
  `teachesAtChristianSchool` boolean NOT NULL DEFAULT false,
  `status` enum('pending','validated','rejected') NOT NULL DEFAULT 'pending',
  `adminNotes` text NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_forum_waitlist_status` (`status`),
  INDEX `idx_forum_waitlist_email` (`email`)
);
