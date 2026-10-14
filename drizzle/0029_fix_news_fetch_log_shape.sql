-- Repair news_fetch_log shape. A legacy temp import script created this table with the wrong columns (feedName, fetchedAt, itemCount) before migration 0020 ran, and 0020 used CREATE TABLE IF NOT EXISTS, so the schema shape (startedAt, finishedAt, itemsFetched, itemsInserted, status, errorMessage) never landed. Every read and write against the table fails with an unknown-column error, which is why news.meta reported null/0 while news items themselves were healthy. The wrong-shape table holds no run history the current code can read, so the table is dropped and recreated in the schema shape
DROP TABLE IF EXISTS `news_fetch_log`;
--> statement-breakpoint
CREATE TABLE `news_fetch_log` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `startedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finishedAt` timestamp NULL,
  `itemsFetched` int NOT NULL DEFAULT 0,
  `itemsInserted` int NOT NULL DEFAULT 0,
  `status` varchar(32) NOT NULL DEFAULT 'running',
  `errorMessage` text NULL,
  INDEX `idx_news_fetch_started` (`startedAt`)
);
