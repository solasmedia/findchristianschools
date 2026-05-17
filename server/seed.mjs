import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  console.log("Seeding database...");

  await connection.execute(`INSERT IGNORE INTO schools (name, slug, city, state, stateCode, zip, phone, website, description, gradeStart, gradeEnd, programType, tuitionType, tuitionMin, tuitionMax, enrollment, denomination, accreditation, statementOfFaith, isPremium, featured) VALUES
    ('Grace Christian Academy', 'grace-christian-academy', 'Dallas', 'Texas', 'TX', '75201', '(214) 555-0100', 'https://graceacademy.edu', 'Grace Christian Academy provides a Christ-centered education that nurtures spiritual growth, academic excellence, and character development.', 'PK', '12', 'traditional', 'tuition_based', 8500, 12000, 450, 'Non-Denominational', 'ACSI, AdvancED', 'We believe the Bible is the inspired, infallible Word of God.', true, true),
    ('Lighthouse Christian School', 'lighthouse-christian-school', 'Austin', 'Texas', 'TX', '78701', '(512) 555-0200', 'https://lighthousecs.org', 'Lighthouse Christian School equips students with a biblical worldview while maintaining high academic standards.', 'K', '8', 'traditional', 'tuition_based', 6000, 9000, 200, 'Baptist', 'ACSI', 'We believe in the deity of Jesus Christ, His virgin birth, His sinless life.', true, true),
    ('Heritage Online Academy', 'heritage-online-academy', 'Orlando', 'Florida', 'FL', '32801', '(407) 555-0300', 'https://heritageonline.edu', 'Heritage Online Academy brings Christian education to your home with live interactive classes.', '3', '12', 'online', 'tuition_based', 3500, 7000, 800, 'Non-Denominational', 'ACSI, Cognia', 'We believe the Bible is the only inspired and authoritative Word of God.', true, true),
    ('Covenant Preparatory School', 'covenant-preparatory-school', 'Atlanta', 'Georgia', 'GA', '30301', '(404) 555-0400', 'https://covenantprep.org', 'Covenant Prep offers rigorous college-preparatory academics within a Reformed Christian framework.', '6', '12', 'traditional', 'tuition_based', 15000, 22000, 320, 'Reformed', 'SACS, ACSI', 'We subscribe to the Westminster Confession of Faith.', true, true),
    ('Faith Community Christian School', 'faith-community-christian', 'Phoenix', 'Arizona', 'AZ', '85001', '(602) 555-0500', 'https://faithccs.org', 'Faith Community Christian School provides affordable quality Christian education with a heart for missions.', 'PK', '8', 'traditional', 'tuition_assisted', 2500, 5000, 180, 'Assembly of God', 'ACSI', 'We believe in the baptism of the Holy Spirit.', false, true),
    ('Mountain View Christian Academy', 'mountain-view-christian-academy', 'Denver', 'Colorado', 'CO', '80201', '(303) 555-0600', 'https://mvca.edu', 'Mountain View Christian Academy combines outdoor education with biblical instruction.', 'K', '12', 'traditional', 'tuition_based', 9000, 14000, 280, 'Non-Denominational', 'ACSI', 'We believe in one God, Creator of all things.', true, false),
    ('New Hope Homeschool Co-op', 'new-hope-homeschool-coop', 'Nashville', 'Tennessee', 'TN', '37201', '(615) 555-0700', 'https://newhopecoop.org', 'New Hope Homeschool Co-op provides community and enrichment classes for homeschooling families.', 'K', '12', 'homeschool_coop', 'free', 0, 500, 120, 'Non-Denominational', NULL, 'We believe the Bible is the Word of God.', false, false),
    ('Calvary Christian School', 'calvary-christian-school', 'Charlotte', 'North Carolina', 'NC', '28201', '(704) 555-0800', 'https://calvarychristian.edu', 'Calvary Christian School has served families in Charlotte for over 40 years with excellence.', 'PK', '12', 'traditional', 'tuition_based', 7500, 11000, 600, 'Baptist', 'ACSI, SACS', 'We believe in the verbal plenary inspiration of the Scriptures.', true, true),
    ('Liberty Virtual Academy', 'liberty-virtual-academy', 'Richmond', 'Virginia', 'VA', '23219', '(804) 555-0900', 'https://libertyvirtual.org', 'Liberty Virtual Academy offers flexible self-paced Christian education online.', '6', '12', 'online', 'tuition_based', 2800, 5500, 450, 'Non-Denominational', 'Cognia', 'We believe Jesus Christ is the Son of God.', false, false),
    ('Cornerstone Classical Academy', 'cornerstone-classical-academy', 'Raleigh', 'North Carolina', 'NC', '27601', '(919) 555-1000', 'https://cornerstoneclassical.edu', 'Cornerstone Classical Academy uses the classical trivium method from a Christian worldview.', 'K', '12', 'traditional', 'tuition_based', 10000, 16000, 250, 'Anglican', 'ACCS, SACS', 'We affirm the Nicene Creed and the authority of Holy Scripture.', true, false),
    ('Harvest Christian School', 'harvest-christian-school', 'Sacramento', 'California', 'CA', '95814', '(916) 555-1100', 'https://harvestcs.org', 'Harvest Christian School provides a nurturing environment for spiritual and academic growth.', 'PK', '8', 'traditional', 'tuition_based', 8000, 11000, 300, 'Non-Denominational', 'ACSI, WASC', 'We believe in the triune God: Father, Son, and Holy Spirit.', false, false),
    ('Redeemer Boarding School', 'redeemer-boarding-school', 'Asheville', 'North Carolina', 'NC', '28801', '(828) 555-1200', 'https://redeemerboarding.edu', 'Redeemer Boarding School offers transformative residential Christian education.', '9', '12', 'boarding', 'tuition_based', 28000, 38000, 150, 'Presbyterian', 'SACS, TABS', 'We hold to the Westminster Standards.', true, false)`);

  await connection.execute(`INSERT IGNORE INTO resources (title, slug, description, category, website, featured) VALUES
    ('Abeka Curriculum', 'abeka-curriculum', 'Comprehensive Christian curriculum for PreK-12 with textbooks and video lessons.', 'curriculum', 'https://www.abeka.com', true),
    ('Classical Conversations', 'classical-conversations', 'Classical Christian homeschool community providing curriculum and community.', 'coop', 'https://classicalconversations.com', true),
    ('BJU Press', 'bju-press', 'Bible-based curriculum materials for Christian schools and homeschools.', 'curriculum', 'https://www.bjupress.com', true),
    ('Khan Academy', 'khan-academy', 'Free online courses and practice exercises to supplement education.', 'online_course', 'https://www.khanacademy.org', false),
    ('HSLDA', 'hslda-homeschool-legal', 'Home School Legal Defense Association provides legal support for homeschooling families.', 'other', 'https://hslda.org', true),
    ('Veritas Press', 'veritas-press', 'Classical Christian curriculum with self-paced online courses.', 'curriculum', 'https://veritaspress.com', false),
    ('CLT Exam', 'clt-exam', 'Classic Learning Test - college entrance exam aligned with classical education.', 'college_prep', 'https://www.cltexam.com', true),
    ('Sonlight Curriculum', 'sonlight-curriculum', 'Literature-based Christian homeschool curriculum with complete packages.', 'curriculum', 'https://www.sonlight.com', false)`);

  await connection.execute(`INSERT IGNORE INTO jobs (schoolId, title, description, category, location, state, stateCode, salaryRange, employmentType, isActive) VALUES
    (1, 'High School Math Teacher', 'Seeking a passionate math teacher for grades 9-12 with strong Christian testimony.', 'teacher', 'Dallas, TX', 'Texas', 'TX', '$45,000 - $60,000', 'full_time', true),
    (1, 'Athletic Director', 'Experienced athletic director to lead sports programs and coach varsity basketball.', 'coach', 'Dallas, TX', 'Texas', 'TX', '$55,000 - $70,000', 'full_time', true),
    (4, 'Middle School Science Teacher', 'Science teacher with passion for integrating faith and learning.', 'teacher', 'Atlanta, GA', 'Georgia', 'GA', '$48,000 - $62,000', 'full_time', true),
    (8, 'Elementary Music Teacher', 'Part-time music teacher for K-5. Piano skills required.', 'teacher', 'Charlotte, NC', 'North Carolina', 'NC', '$25,000 - $35,000', 'part_time', true),
    (6, 'Head of School', 'Visionary leader to serve as Head of School beginning Fall 2026.', 'administrator', 'Denver, CO', 'Colorado', 'CO', '$80,000 - $100,000', 'full_time', true)`);

  await connection.execute(`INSERT IGNORE INTO events (title, description, category, location, state, stateCode, startDate, endDate, website, isActive) VALUES
    ('ACSI National Conference 2026', 'Annual conference for Christian school educators with workshops and keynotes.', 'conference', 'Nashville, TN', 'Tennessee', 'TN', '2026-06-15 09:00:00', '2026-06-18 17:00:00', 'https://acsi.org/conference', true),
    ('Grace Academy Open House', 'Tour campus, meet teachers, learn about programs for 2026-2027.', 'open_house', 'Dallas, TX', 'Texas', 'TX', '2026-05-20 10:00:00', '2026-05-20 14:00:00', NULL, true),
    ('Homeschool Convention - Southeast', 'Largest homeschool convention in the Southeast with vendors and workshops.', 'conference', 'Atlanta, GA', 'Georgia', 'GA', '2026-07-10 08:00:00', '2026-07-12 17:00:00', 'https://greathomeschoolconventions.com', true),
    ('Mission Fundraiser Gala', 'Annual fundraising gala supporting Christian education missions in Central America.', 'missions', 'Orlando, FL', 'Florida', 'FL', '2026-09-14 18:00:00', '2026-09-14 22:00:00', NULL, true),
    ('Classical Education Workshop', 'Learn the trivium method for classical Christian education.', 'workshop', 'Raleigh, NC', 'North Carolina', 'NC', '2026-08-05 09:00:00', '2026-08-05 16:00:00', NULL, true)`);

  await connection.execute(`INSERT IGNORE INTO impact_metrics (metricName, metricValue, description) VALUES
    ('Scholarships Funded', 247, 'Full and partial scholarships provided to students in developing nations'),
    ('Classrooms Built', 18, 'New classrooms constructed in partnership with mission organizations'),
    ('Teachers Supported', 64, 'Christian teachers receiving ongoing training and salary support'),
    ('Countries Reached', 12, 'Nations where our mission partners operate Christian schools'),
    ('Students Impacted', 3420, 'Total students receiving Christian education through our mission partnerships')`);

  console.log("Seed complete!");
  await connection.end();
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
