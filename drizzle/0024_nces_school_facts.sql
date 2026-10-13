-- NCES Private School Universe Survey (PSS) 2023-24 school facts.
-- One row per directory school that server/scripts/importNcesPss.ts matched
-- to a PSS record at HIGH confidence (score >= 0.80 with a clear margin over
-- the runner-up, and no competing claim on the same PSS record). Facts live
-- in this side table — never in `schools` — so federal survey data stays
-- separate from school-claimed data and the whole import can be rolled back
-- by dropping the table. Schools without a row simply show no facts panel;
-- nothing is estimated or interpolated.
-- Source: U.S. Dept. of Education, NCES PSS 2023-24 public-use file
-- (nces.ed.gov/surveys/pss/zip/pss2324_pu_csv.zip), public-use data.
CREATE TABLE IF NOT EXISTS `school_nces_facts` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `schoolId` int NOT NULL UNIQUE,
  `ncesSchoolId` varchar(16) NOT NULL,
  `surveyYear` varchar(16) NOT NULL DEFAULT '2023-24',
  `ncesSchoolName` varchar(255) NULL,
  `totalEnrollment` int NULL,
  `fteTeachers` decimal(8,2) NULL,
  `studentTeacherRatio` decimal(6,2) NULL,
  `religiousOrientation` varchar(128) NULL,
  `schoolTypology` varchar(128) NULL,
  `associations` text NULL,
  `gradeEnrollment` text NULL,
  `matchScore` decimal(4,3) NULL,
  `matchMethod` varchar(16) NULL,
  `sourceName` varchar(255) NOT NULL DEFAULT 'NCES Private School Universe Survey (PSS) 2023-24',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
