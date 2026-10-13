import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, date } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  email: varchar("email", { length: 320 }),
  state: varchar("state", { length: 64 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  newsletterOptIn: boolean("newsletterOptIn").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const schools = mysqlTable("schools", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 64 }).notNull(),
  stateCode: varchar("stateCode", { length: 2 }).notNull(),
  zip: varchar("zip", { length: 10 }).notNull(),
  address: varchar("address", { length: 512 }),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 512 }),
  email: varchar("email", { length: 320 }),
  description: text("description"),
  missionStatement: text("missionStatement"),
  logoUrl: varchar("logoUrl", { length: 512 }),
  coverImageUrl: varchar("coverImageUrl", { length: 512 }),
  galleryImages: text("galleryImages"), // JSON array of image URLs
  gradeStart: varchar("gradeStart", { length: 10 }),
  gradeEnd: varchar("gradeEnd", { length: 10 }),
  programType: mysqlEnum("programType", ["traditional", "online", "hybrid", "homeschool_coop", "boarding"]).default("traditional").notNull(),
  educationalModel: mysqlEnum("educationalModel", ["traditional", "classical", "charlotte_mason", "montessori", "unschooling", "eclectic", "university_model"]).default("traditional"),
  tuitionType: mysqlEnum("tuitionType", ["free", "tuition_assisted", "tuition_based"]).default("tuition_based").notNull(),
  tuitionMin: int("tuitionMin"),
  tuitionMax: int("tuitionMax"),
  enrollment: int("enrollment"),
  studentTeacherRatio: varchar("studentTeacherRatio", { length: 20 }),
  yearFounded: int("yearFounded"),
  denomination: varchar("denomination", { length: 128 }),
  accreditation: varchar("accreditation", { length: 255 }),
  statementOfFaith: text("statementOfFaith"),
  // Additional parent-useful fields
  hasTransportation: boolean("hasTransportation").default(false),
  hasLunchProgram: boolean("hasLunchProgram").default(false),
  hasAfterSchool: boolean("hasAfterSchool").default(false),
  hasSpecialNeeds: boolean("hasSpecialNeeds").default(false),
  hasSports: boolean("hasSports").default(false),
  hasArts: boolean("hasArts").default(false),
  hasSTEM: boolean("hasSTEM").default(false),
  uniformRequired: boolean("uniformRequired").default(false),
  acceptsVouchers: boolean("acceptsVouchers").default(false),
  sportsOffered: text("sportsOffered"),
  extracurriculars: text("extracurriculars"),
  contactName: varchar("contactName", { length: 255 }),
  contactTitle: varchar("contactTitle", { length: 128 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  // Premium & location
  isPremium: boolean("isPremium").default(false).notNull(),
  premiumExpiresAt: timestamp("premiumExpiresAt"),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  listingType: mysqlEnum("listingType", ["free", "donate", "premium"]).default("free").notNull(),
  donationAmount: int("donationAmount"), // Donation amount in dollars if listingType is 'donate'
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }), // For tracking payments
  ownerId: int("ownerId"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  featured: boolean("featured").default(false).notNull(),
  isApproved: boolean("isApproved").default(false).notNull(),
  promoCode: varchar("promoCode", { length: 50 }), // e.g., "FOUNDER50" for Founders promo
  promoDiscountPercent: int("promoDiscountPercent"), // e.g., 50 for 50% off
  // Import tracking fields
  importSource: varchar("importSource", { length: 255 }), // e.g., "NCES PSS 2023-24 private school search export"
  importDate: timestamp("importDate"),
  sourceId: varchar("sourceId", { length: 64 }), // External ID from data source
  listingStatus: mysqlEnum("listingStatus", ["verified", "unverified", "pending", "claimed", "removed", "suspended", "community_submitted"]).default("unverified").notNull(),
  schoolClaimed: boolean("schoolClaimed").default(false).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  schoolId: varchar("schoolId", { length: 64 }),
  denominationTag: varchar("denominationTag", { length: 64 }),
  schoolType: varchar("schoolType", { length: 64 }),
  enrollmentTier: varchar("enrollmentTier", { length: 20 }),
  dataCompletenessScore: int("dataCompletenessScore"),
  needsReview: boolean("needsReview").default(false),
  pointOfContact: varchar("pointOfContact", { length: 255 }),
  internalNotes: text("internalNotes"),
  // Verification fields
  googleBusinessProfileUrl: varchar("googleBusinessProfileUrl", { length: 512 }),
  einOrStateRegNumber: varchar("einOrStateRegNumber", { length: 64 }),
  certifiedAccurate: boolean("certifiedAccurate").default(false),
  // Admin verification checklist (stored as JSON booleans)
  verificationChecklist: text("verificationChecklist"), // JSON: {gbpExists, nameMatches, phoneMatches, cityMatches, websiteLoads, websiteLegit}
  verificationNotes: text("verificationNotes"),
  verifiedAt: timestamp("verifiedAt"),
  verifiedBy: varchar("verifiedBy", { length: 255 }),
  // Pre-screening flags
  prescreenFlags: text("prescreenFlags"), // JSON array of flag strings
  dateLastUpdated: timestamp("dateLastUpdated").defaultNow().onUpdateNow(),
  county: varchar("county", { length: 128 }),
  // Statement of Faith attestation
  sofAttested: boolean("sofAttested").default(false).notNull(),
  sofAttestedAt: timestamp("sofAttestedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type School = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;

// NCES Private School Universe Survey (PSS) facts, matched to a directory
// school by server/scripts/importNcesPss.ts. Kept in a side table (never
// written into `schools`) so imported federal data stays separate from
// school-claimed data, is fully reversible, and every row carries its match
// score/method for audit. A row exists ONLY for a high-confidence match;
// review-band and unmatched schools have no row and show no panel.
export const schoolNcesFacts = mysqlTable("school_nces_facts", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().unique(), // schools.id
  ncesSchoolId: varchar("ncesSchoolId", { length: 16 }).notNull(), // PSS PPIN
  surveyYear: varchar("surveyYear", { length: 16 }).notNull().default("2023-24"),
  ncesSchoolName: varchar("ncesSchoolName", { length: 255 }), // PINST as reported to NCES
  totalEnrollment: int("totalEnrollment"), // NUMSTUDS (K-12 + ungraded)
  fteTeachers: decimal("fteTeachers", { precision: 8, scale: 2 }), // NUMTEACH
  studentTeacherRatio: decimal("studentTeacherRatio", { precision: 6, scale: 2 }), // STTCH_RT
  religiousOrientation: varchar("religiousOrientation", { length: 128 }), // ORIENT label
  schoolTypology: varchar("schoolTypology", { length: 128 }), // TYPOLOGY label
  associations: text("associations"), // JSON array of association names (PSS Q15, flag = 1)
  gradeEnrollment: text("gradeEnrollment"), // JSON object {gradeLabel: count}, reported grades only
  matchScore: decimal("matchScore", { precision: 4, scale: 3 }),
  matchMethod: varchar("matchMethod", { length: 16 }), // 'zip' | 'city'
  sourceName: varchar("sourceName", { length: 255 })
    .notNull()
    .default("NCES Private School Universe Survey (PSS) 2023-24"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SchoolNcesFact = typeof schoolNcesFacts.$inferSelect;
export type InsertSchoolNcesFact = typeof schoolNcesFacts.$inferInsert;

export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  category: mysqlEnum("category", ["curriculum", "coop", "tutor", "online_course", "testing", "special_needs", "college_prep", "other"]).default("other").notNull(),
  website: varchar("website", { length: 512 }),
  state: varchar("state", { length: 64 }),
  imageUrl: varchar("imageUrl", { length: 512 }),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  // School / submitter info
  schoolId: int("schoolId"),
  schoolName: varchar("schoolName", { length: 255 }),
  schoolWebsite: varchar("schoolWebsite", { length: 512 }),
  submitterName: varchar("submitterName", { length: 255 }),
  submitterEmail: varchar("submitterEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 30 }),
  // Job details
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  positionType: mysqlEnum("positionType", [
    "teacher", "administrator", "principal", "counselor", "coach",
    "support_staff", "librarian", "it_tech", "custodian", "finance",
    "admissions", "chaplain", "music_director", "other"
  ]).default("other").notNull(),
  employmentType: mysqlEnum("employmentType", ["full_time", "part_time", "contract", "substitute", "volunteer"]).default("full_time").notNull(),
  location: varchar("location", { length: 255 }),
  state: varchar("state", { length: 64 }),
  stateCode: varchar("stateCode", { length: 2 }),
  zip: varchar("zip", { length: 10 }),
  // Compensation (optional)
  payMin: int("payMin"),
  payMax: int("payMax"),
  payType: mysqlEnum("payType", ["annual", "hourly", "daily", "monthly"]).default("annual"),
  // Qualifications
  degreeRequired: mysqlEnum("degreeRequired", ["none", "high_school", "associates", "bachelors", "masters", "doctorate"]).default("bachelors"),
  yearsExperience: int("yearsExperience").default(0),
  certificationRequired: boolean("certificationRequired").default(false),
  faithRequirement: varchar("faithRequirement", { length: 512 }),
  subjectArea: varchar("subjectArea", { length: 255 }),
  gradeLevel: varchar("gradeLevel", { length: 128 }),
  // Application info
  applicationEmail: varchar("applicationEmail", { length: 320 }),
  applicationUrl: varchar("applicationUrl", { length: 512 }),
  applicationDeadline: timestamp("applicationDeadline"),
  startDate: timestamp("startDate"),
  // Status & lifecycle
  isApproved: boolean("isApproved").default(false).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(), // Only show on site if approved & published
  isActive: boolean("isActive").default(true).notNull(),
  isArchived: boolean("isArchived").default(false).notNull(),
  archivedAt: timestamp("archivedAt"),
  // Statement of Faith attestation
  sofAttested: boolean("sofAttested").default(false).notNull(),
  sofAttestedAt: timestamp("sofAttestedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["open_house", "conference", "fundraiser", "workshop", "missions", "other"]).default("other").notNull(),
  // Audience taxonomy (Teacher Toolkit): who the event is for. Teacher
  // events (PD, conferences, training) surface on /teacher-toolkit.
  audience: mysqlEnum("audience", ["families", "teachers", "students", "pastors", "all"]).default("all").notNull(),
  location: varchar("location", { length: 255 }),
  state: varchar("state", { length: 64 }),
  stateCode: varchar("stateCode", { length: 2 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  website: varchar("website", { length: 512 }),
  schoolId: int("schoolId"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  isActive: boolean("isActive").default(true).notNull(),
  isApproved: boolean("isApproved").default(false).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(), // Only show on site if approved & published
  submitterName: varchar("submitterName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  // Statement of Faith attestation
  sofAttested: boolean("sofAttested").default(false).notNull(),
  sofAttestedAt: timestamp("sofAttestedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const donations = mysqlTable("donations", {
  id: int("id").autoincrement().primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  donorName: varchar("donorName", { length: 255 }),
  donorEmail: varchar("donorEmail", { length: 320 }),
  message: text("message"),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;

export const courseCategories = mysqlTable("courseCategories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }), // lucide icon name
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CourseCategory = typeof courseCategories.$inferSelect;
export type InsertCourseCategory = typeof courseCategories.$inferInsert;

export const impactMetrics = mysqlTable("impact_metrics", {
  id: int("id").autoincrement().primaryKey(),
  metricName: varchar("metricName", { length: 128 }).notNull(),
  metricValue: int("metricValue").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ImpactMetric = typeof impactMetrics.$inferSelect;

export const savedSearches = mysqlTable("saved_searches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  query: varchar("query", { length: 255 }),
  state: varchar("state", { length: 64 }),
  programType: varchar("programType", { length: 64 }),
  gradeLevel: varchar("gradeLevel", { length: 10 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedSearch = typeof savedSearches.$inferSelect;

export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  state: varchar("state", { length: 64 }),
  isActive: boolean("isActive").default(true).notNull(),
  source: varchar("source", { length: 64 }).default("signup"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export const sponsors = mysqlTable("sponsors", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }),
  website: varchar("website", { length: 512 }),
  sponsorType: mysqlEnum("sponsorType", ["event", "trip", "recognition", "general"]).default("general").notNull(),
  message: text("message"),
  budget: varchar("budget", { length: 64 }),
  status: mysqlEnum("status", ["pending", "approved", "active", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Sponsor = typeof sponsors.$inferSelect;

export const internationalSchools = mysqlTable("international_schools", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  // Location
  country: varchar("country", { length: 128 }).notNull(),
  countryCode: varchar("countryCode", { length: 3 }).notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  region: varchar("region", { length: 128 }),
  address: varchar("address", { length: 512 }),
  // Contact
  phone: varchar("phone", { length: 30 }),
  website: varchar("website", { length: 512 }),
  email: varchar("email", { length: 320 }),
  // Academics
  description: text("description"),
  missionStatement: text("missionStatement"),
  primaryLanguage: varchar("primaryLanguage", { length: 64 }).notNull(),
  secondaryLanguage: varchar("secondaryLanguage", { length: 64 }),
  curriculumType: mysqlEnum("curriculumType", ["american", "british", "ib", "national", "hybrid", "other"]).default("other").notNull(),
  gradeStart: varchar("gradeStart", { length: 10 }),
  gradeEnd: varchar("gradeEnd", { length: 10 }),
  // Type & Affiliation
  programType: mysqlEnum("intlProgramType", ["day_school", "boarding", "hybrid", "online"]).default("day_school").notNull(),
  missionAffiliation: varchar("missionAffiliation", { length: 255 }),
  denomination: varchar("denomination", { length: 128 }),
  accreditation: varchar("accreditation", { length: 255 }),
  statementOfFaith: text("statementOfFaith"),
  // Practical Info
  tuitionRange: varchar("tuitionRange", { length: 128 }),
  enrollment: int("enrollment"),
  studentTeacherRatio: varchar("studentTeacherRatio", { length: 20 }),
  yearFounded: int("yearFounded"),
  acceptsExpats: boolean("acceptsExpats").default(true),
  visaSupport: boolean("visaSupport").default(false),
  hasBoarding: boolean("hasBoarding").default(false),
  hasSports: boolean("hasSports").default(false),
  hasArts: boolean("hasArts").default(false),
  hasESL: boolean("hasESL").default(false),
  // Media
  logoUrl: varchar("logoUrl", { length: 512 }),
  coverImageUrl: varchar("coverImageUrl", { length: 512 }),
  galleryImages: text("galleryImages"),
  // Contact Person
  contactName: varchar("contactName", { length: 255 }),
  contactTitle: varchar("contactTitle", { length: 128 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  // Meta
  isPremium: boolean("isPremium").default(false).notNull(),
  isApproved: boolean("isApproved").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  ownerId: int("ownerId"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  // Statement of Faith attestation
  sofAttested: boolean("sofAttested").default(false).notNull(),
  sofAttestedAt: timestamp("sofAttestedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InternationalSchool = typeof internationalSchools.$inferSelect;
export type InsertInternationalSchool = typeof internationalSchools.$inferInsert;

export const rateLimitLog = mysqlTable("rate_limit_log", {
  id: int("id").autoincrement().primaryKey(),
  ip: varchar("ip", { length: 64 }).notNull(),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  count: int("count").default(1).notNull(),
  windowStart: timestamp("windowStart").defaultNow().notNull(),
});

export const savedSchools = mysqlTable("saved_schools", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  schoolId: int("schoolId").notNull(),
  schoolType: mysqlEnum("schoolType", ["domestic", "international"]).default("domestic").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedSchool = typeof savedSchools.$inferSelect;
export type InsertSavedSchool = typeof savedSchools.$inferInsert;

// Admin authentication tables
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

export const twoFASessions = mysqlTable("twofa_sessions", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type TwoFASession = typeof twoFASessions.$inferSelect;
export type InsertTwoFASession = typeof twoFASessions.$inferInsert;

// Courses table
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").references(() => schools.id), // nullable for standalone courses
  categoryId: int("categoryId"), // references courseCategories.id
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  subject: varchar("subject", { length: 128 }), // Math, Science, History, Language, etc.
  gradeLevel: varchar("gradeLevel", { length: 50 }), // K-12, 9-12, etc.
  ageRange: varchar("ageRange", { length: 64 }),
  type: mysqlEnum("type", ["course", "class", "workshop", "program"]).default("class").notNull(),
  deliveryType: mysqlEnum("deliveryType", ["in_person", "online", "hybrid"]).default("in_person").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(), // Only show on site if approved & published
  isFeatured: boolean("isFeatured").default(false).notNull(),
  credits: int("credits"),
  tuition: int("tuition"),
  maxStudents: int("maxStudents"),
  instructor: varchar("instructor", { length: 255 }),
  startDate: date("startDate"),
  endDate: date("endDate"),
  schedule: varchar("schedule", { length: 255 }), // e.g., "MWF 9am-10am"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// Classes table
export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull().references(() => schools.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  gradeLevel: varchar("gradeLevel", { length: 50 }).notNull(), // K, 1, 2, ... 12
  deliveryType: mysqlEnum("deliveryType", ["in_person", "online", "hybrid"]).default("in_person").notNull(),
  teacherName: varchar("teacherName", { length: 255 }),
  maxStudents: int("maxStudents"),
  currentEnrollment: int("currentEnrollment").default(0).notNull(),
  tuition: int("tuition"),
  isPublished: boolean("isPublished").default(false).notNull(), // Only show on site if approved & published
  startDate: date("startDate"),
  endDate: date("endDate"),
  schedule: varchar("schedule", { length: 255 }), // e.g., "MWF 9am-3pm"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Class = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;

// Claim requests table - for schools imported from external data that want to be claimed by their owners
export const claimRequests = mysqlTable("claim_requests", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId"),
  collegeId: int("collegeId"),
  claimantName: varchar("claimantName", { length: 255 }).notNull(),
  claimantEmail: varchar("claimantEmail", { length: 320 }).notNull(),
  claimantPhone: varchar("claimantPhone", { length: 20 }),
  claimantRole: varchar("claimantRole", { length: 128 }).notNull(), // e.g., "Principal", "Administrator", "Owner", "Teacher"
  relationship: text("relationship"), // Description of relationship to school
  verificationNotes: text("verificationNotes"), // Any proof or notes
  status: mysqlEnum("status", ["pending", "approved", "denied"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ClaimRequest = typeof claimRequests.$inferSelect;
export type InsertClaimRequest = typeof claimRequests.$inferInsert;

// Removal requests table - for schools that want to be removed from the directory
export const removalRequests = mysqlTable("removal_requests", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull(),
  requesterName: varchar("requesterName", { length: 255 }).notNull(),
  requesterEmail: varchar("requesterEmail", { length: 320 }).notNull(),
  requesterPhone: varchar("requesterPhone", { length: 20 }),
  requesterRole: varchar("requesterRole", { length: 128 }).notNull(), // e.g., "Principal", "Administrator", "Owner"
  reason: text("reason").notNull(), // Why they want to be removed
  status: mysqlEnum("status", ["pending", "approved", "denied"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type RemovalRequest = typeof removalRequests.$inferSelect;
export type InsertRemovalRequest = typeof removalRequests.$inferInsert;

// Report listings table - for user-submitted reports about listings
export const reportListings = mysqlTable("report_listings", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull(),
  schoolName: varchar("schoolName", { length: 255 }),
  reason: mysqlEnum("reason", ["fraudulent", "incorrect_info", "inappropriate", "closed", "safety_concern", "other"]).notNull(),
  details: text("details"),
  reporterEmail: varchar("reporterEmail", { length: 320 }),
  reporterName: varchar("reporterName", { length: 255 }),
  status: mysqlEnum("status", ["pending", "reviewed", "actioned", "dismissed"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ReportListing = typeof reportListings.$inferSelect;
export type InsertReportListing = typeof reportListings.$inferInsert;

// Contact messages table - for storing all contact form submissions
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  reason: varchar("reason", { length: 128 }).notNull(), // claim_school, premium_upgrade, add_school, report_error, general_question, partnership, technical_issue, other
  senderName: varchar("senderName", { length: 255 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  senderPhone: varchar("senderPhone", { length: 20 }),
  schoolName: varchar("schoolName", { length: 255 }), // optional, for school-related inquiries
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "responded", "archived"]).default("new").notNull(),
  adminNotes: text("adminNotes"), // Admin's internal notes/response
  category: varchar("category", { length: 64 }), // privacy, dmca, billing, support, legal, general
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

// School inquiries table - parent questions submitted from school profile
// pages ("Ask this school a question"). Every inquiry is stored here first;
// deliveredToSchool records whether it was also emailed to the school,
// which only happens when the school has claimed its listing and has a
// contact email on file.
export const schoolInquiries = mysqlTable("school_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  schoolId: int("schoolId").notNull(), // schools.id
  parentName: varchar("parentName", { length: 255 }).notNull(),
  parentEmail: varchar("parentEmail", { length: 320 }).notNull(),
  parentPhone: varchar("parentPhone", { length: 20 }),
  childGrade: varchar("childGrade", { length: 32 }), // grade the parent is exploring, free text
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "responded", "archived"]).default("new").notNull(),
  deliveredToSchool: boolean("deliveredToSchool").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type SchoolInquiry = typeof schoolInquiries.$inferSelect;
export type InsertSchoolInquiry = typeof schoolInquiries.$inferInsert;

// Page views table - for internal analytics tracking
export const pageViews = mysqlTable("page_views", {
  id: int("id").autoincrement().primaryKey(),
  path: varchar("path", { length: 512 }).notNull(),
  referrer: varchar("referrer", { length: 512 }),
  userAgent: varchar("userAgent", { length: 512 }),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: int("userId"),
  duration: int("duration"), // time on page in seconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

// Funnel events table - for tracking customer journey steps
export const funnelEvents = mysqlTable("funnel_events", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: int("userId"),
  eventType: varchar("eventType", { length: 64 }).notNull(), // visit, search, view_school, contact, list_school, premium_checkout, donation, newsletter_signup
  eventData: text("eventData"), // JSON metadata
  path: varchar("path", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type FunnelEvent = typeof funnelEvents.$inferSelect;
export type InsertFunnelEvent = typeof funnelEvents.$inferInsert;


// Feedback table - for storing user feedback about the site and feature requests
export const feedback = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  message: text("message").notNull(),
  name: varchar("name", { length: 255 }), // optional
  email: varchar("email", { length: 320 }), // optional
  feedbackType: mysqlEnum("feedbackType", ["bug_report", "feature_request", "general_feedback", "other"]).default("general_feedback").notNull(),
  status: mysqlEnum("status", ["new", "read", "in_progress", "completed", "archived"]).default("new").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;

// ============ COLLEGES (IPEDS import) ============
export const colleges = mysqlTable("colleges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 64 }).notNull(),
  stateCode: varchar("stateCode", { length: 2 }).notNull(),
  zip: varchar("zip", { length: 10 }),
  address: varchar("address", { length: 512 }),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 512 }),
  denomination: varchar("denomination", { length: 128 }),
  ipedsUnitId: varchar("ipedsUnitId", { length: 16 }),
  enrollment: int("enrollment"),
  // IPEDS enrichment facts (populated by server/scripts/importIpeds.ts).
  // tuition = published tuition & fees per year (undergraduate, in-state
  // where applicable); graduationRate = overall rate, % completing within
  // 150% of normal time; ipedsDataYear = survey vintage, e.g. "2023-24".
  tuition: int("tuition"),
  graduationRate: decimal("graduationRate", { precision: 5, scale: 2 }),
  highestDegreeOffered: varchar("highestDegreeOffered", { length: 64 }),
  ipedsDataYear: varchar("ipedsDataYear", { length: 16 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  source: varchar("source", { length: 64 }).default("ipeds").notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }),
  importDate: timestamp("importDate"),
  listingStatus: mysqlEnum("listingStatus", ["verified", "unverified", "pending", "claimed", "removed", "suspended", "community_submitted"]).default("unverified").notNull(),
  isApproved: boolean("isApproved").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  premiumExpiresAt: timestamp("premiumExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type College = typeof colleges.$inferSelect;
export type InsertCollege = typeof colleges.$inferInsert;

// ============ RACES (RunSignup import) ============
export const races = mysqlTable("races", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  raceDate: date("raceDate"),
  city: varchar("city", { length: 128 }),
  state: varchar("state", { length: 64 }),
  stateCode: varchar("stateCode", { length: 2 }),
  zip: varchar("zip", { length: 10 }),
  distances: varchar("distances", { length: 512 }),
  summary: text("summary"), // Brief factual summary only, never copied descriptions
  signupUrl: varchar("signupUrl", { length: 512 }),
  runsignupId: varchar("runsignupId", { length: 64 }),
  source: varchar("source", { length: 64 }).default("runsignup").notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }),
  importDate: timestamp("importDate"),
  listingStatus: mysqlEnum("listingStatus", ["verified", "unverified", "pending", "claimed", "removed", "suspended", "community_submitted"]).default("unverified").notNull(),
  isApproved: boolean("isApproved").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Race = typeof races.$inferSelect;
export type InsertRace = typeof races.$inferInsert;

// ============ BLOG (Teacher Resource Hub) ============
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"), // meta description / card preview
  category: mysqlEnum("category", [
    "bible_lessons", "classroom_activities", "crafts", "critical_thinking",
    "character_education", "seasonal", "chapel", "teaching_tips",
    "family_resources", "school_leadership",
  ]).default("teaching_tips").notNull(),
  ageGroup: varchar("ageGroup", { length: 64 }), // e.g. "K-2", "3-5", "6-8", "9-12", "All ages"
  content: text("content").notNull(), // HTML article body
  readingTimeMinutes: int("readingTimeMinutes").default(5),
  status: mysqlEnum("status", ["draft", "scheduled", "published"]).default("draft").notNull(),
  scheduledFor: timestamp("scheduledFor"), // auto-publish when this passes
  publishedAt: timestamp("publishedAt"),
  featured: boolean("featured").default(false).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  // SEO
  seoTitle: varchar("seoTitle", { length: 255 }),
  heroImageUrl: varchar("heroImageUrl", { length: 512 }), // Unsplash hero image
  // Downloadable resource attached to this post
  resourceTitle: varchar("resourceTitle", { length: 255 }),
  resourceDescription: text("resourceDescription"),
  resourceContent: text("resourceContent"), // printable HTML for the download
  resourceType: varchar("resourceType", { length: 64 }), // "lesson_plan", "worksheet", "activity_packet", "craft_guide"
  downloadCount: int("downloadCount").default(0).notNull(),
  // Freemium: free resources are email-gated; premium resources are purchased
  isPremiumResource: boolean("isPremiumResource").default(false).notNull(),
  resourcePriceCents: int("resourcePriceCents"), // e.g. 700 = $7.00
  resourcePageCount: int("resourcePageCount"), // for display ("12-page unit")
  resourcePreviewContent: text("resourcePreviewContent"), // free preview HTML (first pages)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Email-gated download log (feeds newsletter list)
export const resourceDownloads = mysqlTable("resource_downloads", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  firstName: varchar("firstName", { length: 255 }),
  userType: varchar("userType", { length: 32 }).default("other"), // teacher, parent, school, other
  downloadedAt: timestamp("downloadedAt").defaultNow().notNull(),
});

export type ResourceDownload = typeof resourceDownloads.$inferSelect;
export type InsertResourceDownload = typeof resourceDownloads.$inferInsert;

// One-time purchases of premium resource packets
export const resourcePurchases = mysqlTable("resource_purchases", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  amountCents: int("amountCents").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type ResourcePurchase = typeof resourcePurchases.$inferSelect;
export type InsertResourcePurchase = typeof resourcePurchases.$inferInsert;

// Aggregated Christian education news (RSS auto-fetch, summaries link to originals)
export const newsItems = mysqlTable("news_items", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sourceName: varchar("sourceName", { length: 128 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull().unique(), // original article URL (dedup key)
  summary: text("summary"), // neutral 2-3 sentence summary from the feed's own description
  category: mysqlEnum("category", [
    "national", "state", "policy", "school_choice", "curriculum",
  ]).default("national").notNull(),
  stateCode: varchar("stateCode", { length: 2 }), // nullable, for state-tagged news
  publishedAt: timestamp("publishedAt"),
  fetchedAt: timestamp("fetchedAt").defaultNow().notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }),
  isActive: boolean("isActive").default(true).notNull(),
});

export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = typeof newsItems.$inferInsert;

// Tracks feed fetch runs (drives the >12h staleness check)
export const newsFetchLog = mysqlTable("news_fetch_log", {
  id: int("id").autoincrement().primaryKey(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  finishedAt: timestamp("finishedAt"),
  itemsFetched: int("itemsFetched").default(0).notNull(),
  itemsInserted: int("itemsInserted").default(0).notNull(),
  status: varchar("status", { length: 32 }).default("running").notNull(), // running | success | error
  errorMessage: text("errorMessage"),
});

export type NewsFetchLog = typeof newsFetchLog.$inferSelect;
export type InsertNewsFetchLog = typeof newsFetchLog.$inferInsert;

// ============ ENRICHMENT & ACTIVITIES ============
// Tutors, classes, sports, camps, youth groups, music & arts, homeschool
// co-ops/resources. Mirrors the schools table patterns (slug, premium/Stripe
// fields, promo columns, listingStatus, SoF attestation) plus a verification
// workflow: verificationStatus is admin-reviewed only — a listing shows a
// verification badge ONLY when verificationStatus = "approved".
// Badge wording lives in shared/enrichment.ts and is liability-critical:
// "Documents Verified" (business/org) / "ID & Background Check Verified"
// (individual). Never "trusted" / "safe" / "vetted".
export const enrichmentListings = mysqlTable("enrichment_listings", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: mysqlEnum("category", ["tutor", "classes", "sports", "camps", "youth_groups", "music_arts", "homeschool_coop", "vbs"]).notNull(),
  // Free-text subcategory / org type, e.g. "American Heritage Girls Troop",
  // "Trail Life USA Troop", "Piano lessons", "Soccer league"
  subcategory: varchar("subcategory", { length: 128 }),
  listerType: mysqlEnum("listerType", ["individual", "business", "organization"]).default("business").notNull(),
  description: text("description"),
  // Location
  address: varchar("address", { length: 512 }),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 64 }).notNull(),
  stateCode: varchar("stateCode", { length: 2 }).notNull(),
  zip: varchar("zip", { length: 10 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  // Contact
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 512 }),
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  // Program details
  agesOrGrades: varchar("agesOrGrades", { length: 128 }), // e.g. "Ages 8-14", "Grades K-6"
  denomination: varchar("denomination", { length: 128 }),
  logoUrl: varchar("logoUrl", { length: 512 }),
  coverImageUrl: varchar("coverImageUrl", { length: 512 }),
  // Faith attestation (site standard — required at submission)
  statementOfFaith: text("statementOfFaith"),
  sofAttested: boolean("sofAttested").default(false).notNull(),
  sofAttestedAt: timestamp("sofAttestedAt"),
  certifiedAccurate: boolean("certifiedAccurate").default(false),
  // Premium / Stripe (mirrors schools)
  listingType: mysqlEnum("listingType", ["free", "premium"]).default("free").notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  premiumExpiresAt: timestamp("premiumExpiresAt"),
  featured: boolean("featured").default(false).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  promoCode: varchar("promoCode", { length: 50 }),
  promoDiscountPercent: int("promoDiscountPercent"),
  ownerId: int("ownerId"),
  // Verification workflow (admin-reviewed; no external check APIs)
  verificationStatus: mysqlEnum("verificationStatus", ["none", "pending", "approved", "rejected"]).default("none").notNull(),
  verificationType: mysqlEnum("verificationType", ["none", "documents", "id_background"]).default("none").notNull(),
  // Businesses/orgs: EIN + legal name must match
  ein: varchar("ein", { length: 32 }),
  legalName: varchar("legalName", { length: 255 }),
  // Individuals: attestations captured at submission (admin reviews)
  idAttested: boolean("idAttested").default(false),
  backgroundCheckAttested: boolean("backgroundCheckAttested").default(false),
  backgroundCheckDate: date("backgroundCheckDate"), // date of the individual's most recent background check
  reference1Name: varchar("reference1Name", { length: 255 }),
  reference1Contact: varchar("reference1Contact", { length: 255 }), // church/school name + contact
  reference2Name: varchar("reference2Name", { length: 255 }),
  reference2Contact: varchar("reference2Contact", { length: 255 }),
  verifiedAt: timestamp("verifiedAt"),
  verifiedBy: varchar("verifiedBy", { length: 255 }),
  verificationNotes: text("verificationNotes"),
  // Publication workflow — public search shows only isApproved listings that
  // are not removed/suspended (same pattern as colleges/races sitemap filter)
  listingStatus: mysqlEnum("listingStatus", ["pending", "active", "removed", "suspended", "community_submitted"]).default("community_submitted").notNull(),
  isApproved: boolean("isApproved").default(false).notNull(),
  internalNotes: text("internalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EnrichmentListing = typeof enrichmentListings.$inferSelect;
export type InsertEnrichmentListing = typeof enrichmentListings.$inferInsert;

// Reports against enrichment listings — removal-first policy: a credible
// report suspends the listing pending admin review (noted in the admin view).
export const enrichmentReports = mysqlTable("enrichment_reports", {
  id: int("id").autoincrement().primaryKey(),
  listingId: int("listingId").notNull(),
  listingName: varchar("listingName", { length: 255 }),
  reason: mysqlEnum("reason", ["fraudulent", "incorrect_info", "inappropriate", "closed", "safety_concern", "other"]).notNull(),
  details: text("details"),
  reporterName: varchar("reporterName", { length: 255 }),
  reporterEmail: varchar("reporterEmail", { length: 320 }),
  status: mysqlEnum("status", ["pending", "reviewed", "actioned", "dismissed"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EnrichmentReport = typeof enrichmentReports.$inferSelect;
export type InsertEnrichmentReport = typeof enrichmentReports.$inferInsert;

// Teacher Forum — Founding Teachers waitlist (phase 1 of the teacher forum).
// Teachers register interest on /teacher-toolkit and attest that they teach
// at a Christian school. Forum access opens only after an admin validates
// the entry (status: pending -> validated / rejected). No forum software yet.
export const teacherForumWaitlist = mysqlTable("teacher_forum_waitlist", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  schoolName: varchar("schoolName", { length: 255 }).notNull(),
  schoolCity: varchar("schoolCity", { length: 128 }),
  schoolState: varchar("schoolState", { length: 64 }),
  role: mysqlEnum("role", ["teacher", "admin", "homeschool"]).default("teacher").notNull(),
  teachesAtChristianSchool: boolean("teachesAtChristianSchool").default(false).notNull(),
  status: mysqlEnum("status", ["pending", "validated", "rejected"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeacherForumWaitlistEntry = typeof teacherForumWaitlist.$inferSelect;
export type InsertTeacherForumWaitlistEntry = typeof teacherForumWaitlist.$inferInsert;
