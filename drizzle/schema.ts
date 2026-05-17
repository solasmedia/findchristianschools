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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type School = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;

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
  schoolId: int("schoolId").notNull(),
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
