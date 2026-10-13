-- Parent inquiries from school profile pages (2026-10-13).
-- Backs the "Ask this school a question" form on each school profile.
-- One row per parent question. Every inquiry is saved here first, then
-- delivered by email only when the school has claimed its listing and
-- has a contact email on file. Rows that could not be delivered stay
-- visible to admins in the Messages view and serve as claim outreach
-- leads, so the deliveredToSchool flag records what actually happened.
-- Authoring note: no comment line in this file contains a semicolon,
-- because the boot migration runner splits files on semicolons at line
-- ends and a semicolon inside a comment once corrupted migration 0024.
CREATE TABLE IF NOT EXISTS `school_inquiries` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `schoolId` int NOT NULL,
  `parentName` varchar(255) NOT NULL,
  `parentEmail` varchar(320) NOT NULL,
  `parentPhone` varchar(20) NULL,
  `childGrade` varchar(32) NULL,
  `message` text NOT NULL,
  `status` enum('new','read','responded','archived') NOT NULL DEFAULT 'new',
  `deliveredToSchool` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `school_inquiries_schoolId_idx` (`schoolId`),
  INDEX `school_inquiries_status_idx` (`status`)
);
