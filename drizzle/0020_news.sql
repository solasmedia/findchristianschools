-- Christian education news aggregation (RSS auto-fetch)
CREATE TABLE IF NOT EXISTS `news_items` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `sourceName` varchar(128) NOT NULL,
  `sourceUrl` varchar(1024) NOT NULL UNIQUE,
  `summary` text NULL,
  `category` enum('national','state','policy','school_choice','curriculum') NOT NULL DEFAULT 'national',
  `stateCode` varchar(2) NULL,
  `publishedAt` timestamp NULL,
  `fetchedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `imageUrl` varchar(512) NULL,
  `isActive` boolean NOT NULL DEFAULT true,
  INDEX `idx_news_category_published` (`category`, `publishedAt`),
  INDEX `idx_news_state` (`stateCode`),
  INDEX `idx_news_published` (`publishedAt`)
);

CREATE TABLE IF NOT EXISTS `news_fetch_log` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `startedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finishedAt` timestamp NULL,
  `itemsFetched` int NOT NULL DEFAULT 0,
  `itemsInserted` int NOT NULL DEFAULT 0,
  `status` varchar(32) NOT NULL DEFAULT 'running',
  `errorMessage` text NULL,
  INDEX `idx_news_fetch_started` (`startedAt`)
);
