-- Fix schema drift: create missing tables and add missing columns

CREATE TABLE `contact_messages` (
  `id` int AUTO_INCREMENT NOT NULL,
  `reason` varchar(128) NOT NULL,
  `senderName` varchar(255) NOT NULL,
  `senderEmail` varchar(320) NOT NULL,
  `senderPhone` varchar(20),
  `schoolName` varchar(255),
  `message` text NOT NULL,
  `status` enum('new','read','responded','archived') NOT NULL DEFAULT 'new',
  `adminNotes` text,
  `category` varchar(64),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);

CREATE TABLE `feedback` (
  `id` int AUTO_INCREMENT NOT NULL,
  `message` text NOT NULL,
  `name` varchar(255),
  `email` varchar(320),
  `feedbackType` enum('bug_report','feature_request','general_feedback','other') NOT NULL DEFAULT 'general_feedback',
  `status` enum('new','read','in_progress','completed','archived') NOT NULL DEFAULT 'new',
  `adminNotes` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);

CREATE TABLE `page_views` (
  `id` int AUTO_INCREMENT NOT NULL,
  `path` varchar(512) NOT NULL,
  `referrer` varchar(512),
  `userAgent` varchar(512),
  `sessionId` varchar(64) NOT NULL,
  `userId` int,
  `duration` int,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `page_views_id` PRIMARY KEY(`id`)
);

CREATE TABLE `funnel_events` (
  `id` int AUTO_INCREMENT NOT NULL,
  `sessionId` varchar(64) NOT NULL,
  `userId` int,
  `eventType` varchar(64) NOT NULL,
  `eventData` text,
  `path` varchar(512),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `funnel_events_id` PRIMARY KEY(`id`)
);

ALTER TABLE `jobs` ADD COLUMN `applicationDeadline` timestamp;
ALTER TABLE `jobs` ADD COLUMN `applicationEmail` varchar(320);
ALTER TABLE `jobs` ADD COLUMN `applicationUrl` varchar(512);
ALTER TABLE `jobs` ADD COLUMN `archivedAt` timestamp;
ALTER TABLE `jobs` ADD COLUMN `certificationRequired` boolean DEFAULT false;
ALTER TABLE `jobs` ADD COLUMN `contactPhone` varchar(30);
ALTER TABLE `jobs` ADD COLUMN `degreeRequired` enum('none','high_school','associates','bachelors','masters','doctorate') DEFAULT 'bachelors';
ALTER TABLE `jobs` ADD COLUMN `faithRequirement` varchar(512);
ALTER TABLE `jobs` ADD COLUMN `gradeLevel` varchar(128);
ALTER TABLE `jobs` ADD COLUMN `isApproved` boolean DEFAULT false NOT NULL;
ALTER TABLE `jobs` ADD COLUMN `isArchived` boolean DEFAULT false NOT NULL;
ALTER TABLE `jobs` ADD COLUMN `isPublished` boolean DEFAULT false NOT NULL;
ALTER TABLE `jobs` ADD COLUMN `payMax` int;
ALTER TABLE `jobs` ADD COLUMN `payMin` int;
ALTER TABLE `jobs` ADD COLUMN `payType` enum('annual','hourly','daily','monthly') DEFAULT 'annual';
ALTER TABLE `jobs` ADD COLUMN `positionType` enum('teacher','administrator','principal','counselor','coach','support_staff','librarian','it_tech','custodian','finance','admissions','chaplain','music_director','other') DEFAULT 'other' NOT NULL;
ALTER TABLE `jobs` ADD COLUMN `schoolName` varchar(255);
ALTER TABLE `jobs` ADD COLUMN `schoolWebsite` varchar(512);
ALTER TABLE `jobs` ADD COLUMN `startDate` timestamp;
ALTER TABLE `jobs` ADD COLUMN `subjectArea` varchar(255);
ALTER TABLE `jobs` ADD COLUMN `submitterEmail` varchar(320);
ALTER TABLE `jobs` ADD COLUMN `submitterName` varchar(255);
ALTER TABLE `jobs` ADD COLUMN `yearsExperience` int DEFAULT 0;
ALTER TABLE `jobs` ADD COLUMN `zip` varchar(10);
ALTER TABLE `classes` ADD COLUMN `isPublished` boolean DEFAULT false NOT NULL;
ALTER TABLE `courses` ADD COLUMN `isPublished` boolean DEFAULT false NOT NULL;
ALTER TABLE `events` ADD COLUMN `isPublished` boolean DEFAULT false NOT NULL;
ALTER TABLE `international_schools` ADD COLUMN `intlProgramType` enum('day_school','boarding','hybrid','online') DEFAULT 'day_school' NOT NULL;
