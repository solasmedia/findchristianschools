-- Add colleges and races tables for new content verticals

CREATE TABLE `colleges` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `city` varchar(128) NOT NULL,
  `state` varchar(64) NOT NULL,
  `stateCode` varchar(2) NOT NULL,
  `zip` varchar(10),
  `address` varchar(512),
  `phone` varchar(20),
  `website` varchar(512),
  `denomination` varchar(128),
  `ipedsUnitId` varchar(16),
  `enrollment` int,
  `latitude` decimal(10,7),
  `longitude` decimal(10,7),
  `source` varchar(64) NOT NULL DEFAULT 'ipeds',
  `sourceUrl` varchar(512),
  `importDate` timestamp,
  `listingStatus` enum('verified','unverified','pending','claimed','removed','suspended','community_submitted') NOT NULL DEFAULT 'unverified',
  `isApproved` boolean NOT NULL DEFAULT true,
  `featured` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `colleges_id` PRIMARY KEY(`id`),
  CONSTRAINT `colleges_slug_unique` UNIQUE(`slug`)
);

CREATE TABLE `races` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `raceDate` date,
  `city` varchar(128),
  `state` varchar(64),
  `stateCode` varchar(2),
  `zip` varchar(10),
  `distances` varchar(512),
  `summary` text,
  `signupUrl` varchar(512),
  `runsignupId` varchar(64),
  `source` varchar(64) NOT NULL DEFAULT 'runsignup',
  `sourceUrl` varchar(512),
  `importDate` timestamp,
  `listingStatus` enum('verified','unverified','pending','claimed','removed','suspended','community_submitted') NOT NULL DEFAULT 'unverified',
  `isApproved` boolean NOT NULL DEFAULT true,
  `featured` boolean NOT NULL DEFAULT false,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `races_id` PRIMARY KEY(`id`),
  CONSTRAINT `races_slug_unique` UNIQUE(`slug`)
);

-- Statement of Faith attestation on submissions
ALTER TABLE `jobs` ADD COLUMN `sofAttested` boolean NOT NULL DEFAULT false;
ALTER TABLE `jobs` ADD COLUMN `sofAttestedAt` timestamp NULL;
ALTER TABLE `events` ADD COLUMN `sofAttested` boolean NOT NULL DEFAULT false;
ALTER TABLE `events` ADD COLUMN `sofAttestedAt` timestamp NULL;
ALTER TABLE `schools` ADD COLUMN `sofAttested` boolean NOT NULL DEFAULT false;
ALTER TABLE `schools` ADD COLUMN `sofAttestedAt` timestamp NULL;
ALTER TABLE `international_schools` ADD COLUMN `sofAttested` boolean NOT NULL DEFAULT false;
ALTER TABLE `international_schools` ADD COLUMN `sofAttestedAt` timestamp NULL;
