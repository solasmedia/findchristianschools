/**
 * School Choice by State — verified program data for the "School choice in
 * [State]" block on state hub pages (/state/:code) and the summary strip on
 * /federal-tax-credit.
 *
 * EDITORIAL OWNERSHIP: this file is hand-maintained editorial content (Dave).
 * It is NOT auto-generated. The older auto-generated CSV data in
 * shared/schoolChoicePrograms.ts still powers the small banner on state
 * pages; this file is the verified, structured source for the full block.
 *
 * FACT RULE (site law — truth over speed):
 * - Every award amount and eligibility line below was checked in-session
 *   against an official primary source (state department of education,
 *   state program administrator, IRS/Treasury) or cross-checked with
 *   EdChoice research (The ABCs of School Choice / School Choice in
 *   America dashboard), with the official source winning any conflict.
 * - Where an amount or eligibility detail could NOT be verified, the field
 *   is OMITTED — never estimated. The program still renders with its name,
 *   type, status, and official source link.
 * - Federal Scholarship Tax Credit participation is seeded from the site's
 *   verified research on /federal-tax-credit (IRS IR-2026-76, June 2026, and
 *   the October 2026 Treasury update): 30 states participating, 6 states
 *   not participating (AZ, HI, MN, NM, OR, WI), 14 states pending.
 * - `lastVerified` is the date the entry was last checked. Update it
 *   whenever you touch an entry, and re-check amounts every school year.
 *
 * Last full review: 2026-10-13.
 */

export type SchoolChoiceProgramStatus =
  | "active"
  | "proposed"
  | "pending"
  | "not-participating";

export interface SchoolChoiceProgramInfo {
  /** Official program name. */
  name: string;
  /** e.g. "Education Savings Account", "Voucher", "Tax-Credit Scholarship". */
  type: string;
  status: SchoolChoiceProgramStatus;
  /** One-line eligibility summary. ONLY present when verified. */
  eligibility?: string;
  /** Award amount or range. ONLY present when verified. */
  award?: string;
  /** Short factual note (launch timing, litigation, phase-in). Optional. */
  note?: string;
  /** Official source: state DOE or program administrator page. */
  sourceUrl: string;
  /** Date this entry was last checked against its sources (YYYY-MM-DD). */
  lastVerified: string;
}

export interface SchoolChoiceStateEntry {
  state: string;
  stateCode: string;
  /** State-run programs only; the federal entry is composed at read time. */
  programs: SchoolChoiceProgramInfo[];
  /** Factual context rendered above the cards (rare; e.g. repeals). */
  note?: string;
}

const V = "2026-10-13";

/* ------------------------------------------------------------------ */
/* Federal Scholarship Tax Credit — verified on /federal-tax-credit    */
/* ------------------------------------------------------------------ */

type FederalStatus = "participating" | "not-participating" | "pending";

/** Participating states and the official state DOE page for SGO lists. */
const FEDERAL_PARTICIPATING: Record<string, string> = {
  Alabama: "https://www.alabamaachieves.org",
  Alaska: "https://education.alaska.gov",
  Arkansas: "https://dese.ade.arkansas.gov",
  Colorado: "https://www.cde.state.co.us",
  Florida: "https://www.fldoe.org",
  Georgia: "https://www.gadoe.org",
  Idaho: "https://www.sde.idaho.gov",
  Indiana: "https://www.in.gov/doe",
  Iowa: "https://educate.iowa.gov",
  Kansas: "https://www.ksde.org",
  Kentucky: "https://education.ky.gov",
  Louisiana: "https://www.louisianabelieves.com",
  Mississippi: "https://www.mdek12.org",
  Missouri: "https://dese.mo.gov",
  Montana: "https://opi.mt.gov",
  Nebraska: "https://www.education.ne.gov",
  Nevada: "https://doe.nv.gov",
  "New Hampshire": "https://www.education.nh.gov",
  "North Carolina": "https://www.dpi.nc.gov",
  "North Dakota": "https://www.nd.gov/dpi",
  Ohio: "https://education.ohio.gov",
  Oklahoma: "https://sde.ok.gov",
  "South Carolina": "https://ed.sc.gov",
  "South Dakota": "https://doe.sd.gov",
  Tennessee: "https://www.tn.gov/education",
  Texas: "https://tea.texas.gov",
  Utah: "https://www.schools.utah.gov",
  Virginia: "https://www.doe.virginia.gov",
  "West Virginia": "https://wvde.us",
  Wyoming: "https://edu.wyoming.gov",
};

const FEDERAL_NOT_PARTICIPATING: Record<string, string> = {
  Arizona: "https://www.azed.gov",
  Hawaii: "https://www.hawaiipublicschools.org",
  Minnesota: "https://www.revenue.state.mn.us",
  "New Mexico": "https://webnew.ped.state.nm.us",
  Oregon: "https://www.oregon.gov/ode",
  Wisconsin: "https://dpi.wi.gov",
};

const FEDERAL_PENDING: Record<string, string> = {
  California: "https://www.cde.ca.gov",
  Connecticut: "https://portal.ct.gov/sde",
  Delaware: "https://education.delaware.gov",
  Illinois: "https://tax.illinois.gov",
  Maine: "https://www.maine.gov/doe",
  Maryland: "https://marylandpublicschools.org",
  Massachusetts: "https://www.doe.mass.edu",
  Michigan: "https://www.michigan.gov/mde",
  "New Jersey": "https://www.nj.gov/education",
  "New York": "https://www.nysed.gov",
  Pennsylvania: "https://dced.pa.gov",
  "Rhode Island": "https://ride.ri.gov",
  Vermont: "https://education.vermont.gov",
  Washington: "https://ospi.k12.wa.us",
};

function federalStatusFor(state: string): { status: FederalStatus; doeUrl: string } | null {
  if (state in FEDERAL_PARTICIPATING) return { status: "participating", doeUrl: FEDERAL_PARTICIPATING[state] };
  if (state in FEDERAL_NOT_PARTICIPATING) return { status: "not-participating", doeUrl: FEDERAL_NOT_PARTICIPATING[state] };
  if (state in FEDERAL_PENDING) return { status: "pending", doeUrl: FEDERAL_PENDING[state] };
  return null; // District of Columbia is not tracked on the site's FSTC hub page.
}

function federalProgramFor(state: string): SchoolChoiceProgramInfo | null {
  const fed = federalStatusFor(state);
  if (!fed) return null;
  const base: SchoolChoiceProgramInfo = {
    name: "Federal Scholarship Tax Credit",
    type: "Tax-Credit Scholarship",
    status: "pending",
    sourceUrl: fed.doeUrl,
    lastVerified: V,
  };
  if (fed.status === "participating") {
    return {
      ...base,
      status: "active",
      eligibility:
        "Students from households earning up to 300% of area median gross income who are eligible to enroll in K–12",
      note: "Federal program. Scholarships begin January 1, 2027, through scholarship granting organizations certified by the state.",
    };
  }
  if (fed.status === "not-participating") {
    return {
      ...base,
      status: "not-participating",
      note: "This state has said it will not participate, so its students cannot receive these scholarships. Donors here can still claim the credit by giving to scholarship organizations in participating states.",
    };
  }
  return {
    ...base,
    status: "pending",
    note: "This state has not announced whether it will participate. Students can receive scholarships only if the state opts in.",
  };
}

/* ------------------------------------------------------------------ */
/* State-run programs                                                  */
/* ------------------------------------------------------------------ */

const p = (prog: SchoolChoiceProgramInfo): SchoolChoiceProgramInfo => prog;

export const schoolChoiceStates: SchoolChoiceStateEntry[] = [
  {
    state: "Alabama",
    stateCode: "AL",
    programs: [
      p({
        name: "CHOOSE Act",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "Alabama K–12 students; household income up to 300% of the federal poverty level through 2026–27 (the income cap ends in 2027–28)",
        award:
          "Up to $7,000 per student at a participating school; $2,000 per homeschool student (up to $4,000 per family)",
        sourceUrl: "https://www.revenue.alabama.gov/individual-corporate/the-choose-act/",
        lastVerified: V,
      }),
      p({
        name: "Alabama Education Scholarship Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://www.revenue.alabama.gov/",
        lastVerified: V,
      }),
      p({
        name: "Accountability Act Parent-Taxpayer Refundable Tax Credit",
        type: "Refundable Tax Credit",
        status: "active",
        sourceUrl: "https://www.revenue.alabama.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Alaska",
    stateCode: "AK",
    programs: [
      p({
        name: "Correspondence School Allotment Program",
        type: "Public Allotment / Homeschool Support",
        status: "active",
        sourceUrl: "https://education.alaska.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Arizona",
    stateCode: "AZ",
    programs: [
      p({
        name: "Empowerment Scholarship Account (ESA)",
        type: "Education Savings Account",
        status: "active",
        eligibility: "All Arizona K–12 students",
        award:
          "90% of state per-pupil funding — about $7,105–$10,540 for most students in 2025–26 (Arizona Department of Education)",
        sourceUrl: "https://www.azed.gov/esa",
        lastVerified: V,
      }),
      p({
        name: "Individual School Tuition Organization Tax Credit",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://azdor.gov/tax-credits/school-tax-credits",
        lastVerified: V,
      }),
      p({
        name: "Low-Income Corporate STO Tax Credit",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://azdor.gov/tax-credits/school-tax-credits",
        lastVerified: V,
      }),
      p({
        name: "Switcher Individual STO Tax Credit",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://azdor.gov/tax-credits/school-tax-credits",
        lastVerified: V,
      }),
      p({
        name: "Lexie's Law — Disabled/Displaced Corporate STO Tax Credit",
        type: "Tax-Credit Scholarship",
        status: "active",
        eligibility: "Students with disabilities or students in foster care",
        award: "Averaged $5,671 per student (2025–26, EdChoice)",
        sourceUrl: "https://azdor.gov/tax-credits/school-tax-credits",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Arkansas",
    stateCode: "AR",
    programs: [
      p({
        name: "Children's Educational Freedom Account Program",
        type: "Education Savings Account",
        status: "active",
        eligibility: "All Arkansas K–12 students",
        award: "$6,864 per student (2025–26)",
        sourceUrl: "https://dese.ade.arkansas.gov/Offices/communications/school-choice-and-parent-empowerment",
        lastVerified: V,
      }),
      p({
        name: "Philanthropic Investment in Arkansas Kids Scholarship Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        eligibility: "Families earning up to 200% of the federal poverty level",
        award: "Averaged $5,545 per student (2024–25, EdChoice)",
        sourceUrl: "https://dese.ade.arkansas.gov/",
        lastVerified: V,
      }),
    ],
  },
  { state: "California", stateCode: "CA", programs: [] },
  { state: "Colorado", stateCode: "CO", programs: [] },
  { state: "Connecticut", stateCode: "CT", programs: [] },
  { state: "Delaware", stateCode: "DE", programs: [] },
  {
    state: "District of Columbia",
    stateCode: "DC",
    programs: [
      p({
        name: "D.C. Opportunity Scholarship Program",
        type: "Voucher",
        status: "active",
        sourceUrl: "https://servingourchildrendc.org/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Florida",
    stateCode: "FL",
    programs: [
      p({
        name: "Family Empowerment Scholarship for Educational Options (FES-EO)",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "All Florida K–12 students; priority for lower-income families and children in foster care",
        award: "Averages about $8,000 per student (2025–26, EdChoice)",
        sourceUrl: "https://www.fldoe.org/schools/school-choice/k-12-scholarship-programs/",
        lastVerified: V,
      }),
      p({
        name: "Family Empowerment Scholarship for Students with Unique Abilities (FES-UA)",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "Students ages 3–22 with an IEP or a qualifying diagnosis (such as autism, Down syndrome, or speech or language impairment)",
        award: "Averages about $10,000 per student (2025–26, EdChoice)",
        sourceUrl: "https://www.fldoe.org/schools/school-choice/k-12-scholarship-programs/",
        lastVerified: V,
      }),
      p({
        name: "Florida Tax Credit Scholarship",
        type: "Tax-Credit Scholarship",
        status: "active",
        eligibility: "All Florida K–12 students (families apply through the same application as FES)",
        sourceUrl: "https://www.fldoe.org/schools/school-choice/k-12-scholarship-programs/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Georgia",
    stateCode: "GA",
    programs: [
      p({
        name: "Georgia Promise Scholarship",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "Students zoned for a public school in the lowest-performing 25% statewide; family income up to 400% of the federal poverty level",
        award: "$6,500 per student per year",
        sourceUrl: "https://mygeorgiapromise.org/",
        lastVerified: V,
      }),
      p({
        name: "Georgia Special Needs Scholarship Program",
        type: "Voucher",
        status: "active",
        eligibility: "Students with qualifying special needs and prior public school attendance",
        sourceUrl: "https://www.gadoe.org/External-Affairs-and-Policy/Policy/Pages/Special-Needs-Scholarship-Program.aspx",
        lastVerified: V,
      }),
      p({
        name: "Qualified Education Expense Tax Credit",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://dor.georgia.gov/qualified-education-expense-tax-credit",
        lastVerified: V,
      }),
    ],
  },
  { state: "Hawaii", stateCode: "HI", programs: [] },
  {
    state: "Idaho",
    stateCode: "ID",
    programs: [
      p({
        name: "Idaho Parental Choice Tax Credit",
        type: "Refundable Tax Credit",
        status: "active",
        award: "Up to $5,000 per student",
        sourceUrl: "https://tax.idaho.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Illinois",
    stateCode: "IL",
    programs: [
      p({
        name: "Tax Credits for Educational Expenses",
        type: "Individual Tax Credit",
        status: "active",
        sourceUrl: "https://tax.illinois.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Indiana",
    stateCode: "IN",
    programs: [
      p({
        name: "Indiana Choice Scholarship Program",
        type: "Voucher",
        status: "active",
        eligibility: "All Indiana students ages 5–21 (income limits removed starting 2026–27)",
        award: "Up to 90% of state per-pupil funding; averaged $6,536 per student (2024–25, EdChoice)",
        sourceUrl: "https://www.in.gov/doe/students/indiana-choice-scholarship-program/",
        lastVerified: V,
      }),
      p({
        name: "Indiana Education Scholarship Account Program (INESA)",
        type: "Education Savings Account",
        status: "active",
        eligibility: "Students with qualifying disabilities",
        sourceUrl: "https://www.in.gov/tos/inesa/",
        lastVerified: V,
      }),
      p({
        name: "Indiana School Scholarship Tax Credit",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://www.in.gov/dor/tax-forms/individual-income-tax-forms/school-scholarship-tax-credit/",
        lastVerified: V,
      }),
      p({
        name: "Private School/Homeschool Deduction",
        type: "Tax Deduction",
        status: "active",
        sourceUrl: "https://www.in.gov/dor/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Iowa",
    stateCode: "IA",
    programs: [
      p({
        name: "Students First Education Savings Account",
        type: "Education Savings Account",
        status: "active",
        eligibility: "All Iowa K–12 students enrolled in an accredited nonpublic school",
        award: "$7,988 per student (2025–26)",
        sourceUrl: "https://educate.iowa.gov/pk-12/educational-choice/students-first-education-savings-accounts",
        lastVerified: V,
      }),
      p({
        name: "Iowa School Tuition Organization Tax Credit",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://tax.iowa.gov/",
        lastVerified: V,
      }),
      p({
        name: "Tuition and Textbook Tax Credit",
        type: "Individual Tax Credit",
        status: "active",
        sourceUrl: "https://tax.iowa.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Kansas",
    stateCode: "KS",
    programs: [
      p({
        name: "Tax Credit for Low Income Students Scholarship Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        eligibility: "Low-income students attending participating private schools",
        sourceUrl: "https://www.ksde.org/Agency/Fiscal-and-Administrative-Services/School-Finance/Tax-Credit-for-Low-Income-Students-Scholarship-Program",
        lastVerified: V,
      }),
    ],
  },
  { state: "Kentucky", stateCode: "KY", programs: [] },
  {
    state: "Louisiana",
    stateCode: "LA",
    programs: [
      p({
        name: "LA GATOR Scholarship Program",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "Louisiana K–12 students, phasing in — former voucher students, kindergartners, prior public school students, and lower-income families first",
        award: "$5,243–$7,626 per student; up to $15,253 for students with disabilities (2025–26)",
        sourceUrl: "https://louisianagator.la.gov/",
        lastVerified: V,
      }),
      p({
        name: "School Choice Program for Certain Students with Exceptionalities",
        type: "Voucher",
        status: "active",
        sourceUrl: "https://www.louisianabelieves.com/schools/school-choice",
        lastVerified: V,
      }),
      p({
        name: "Tuition Donation Credit Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://www.louisianabelieves.com/schools/school-choice",
        lastVerified: V,
      }),
      p({
        name: "Elementary and Secondary School Tuition Deduction",
        type: "Tax Deduction",
        status: "active",
        sourceUrl: "https://revenue.louisiana.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Maine",
    stateCode: "ME",
    programs: [
      p({
        name: "Town Tuitioning Program",
        type: "Voucher / Town Tuitioning",
        status: "active",
        eligibility: "Students in towns that do not operate a public school",
        sourceUrl: "https://www.maine.gov/doe/learning/schools/schoolchoice",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Maryland",
    stateCode: "MD",
    programs: [
      p({
        name: "BOOST Program",
        type: "Voucher",
        status: "active",
        eligibility: "Low-income students attending participating nonpublic schools",
        sourceUrl: "https://marylandpublicschools.org/Pages/boost/index.aspx",
        lastVerified: V,
      }),
    ],
  },
  { state: "Massachusetts", stateCode: "MA", programs: [] },
  { state: "Michigan", stateCode: "MI", programs: [] },
  {
    state: "Minnesota",
    stateCode: "MN",
    programs: [
      p({
        name: "K-12 Education Credit",
        type: "Individual Tax Credit",
        status: "active",
        sourceUrl: "https://www.revenue.state.mn.us/k-12-education-subtraction-and-credit",
        lastVerified: V,
      }),
      p({
        name: "K-12 Education Subtraction",
        type: "Tax Deduction",
        status: "active",
        sourceUrl: "https://www.revenue.state.mn.us/k-12-education-subtraction-and-credit",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Mississippi",
    stateCode: "MS",
    programs: [
      p({
        name: "Equal Opportunity for Students with Special Needs Program",
        type: "Education Savings Account",
        status: "active",
        eligibility: "Students with special needs",
        sourceUrl: "https://www.mdek12.org/OSA/ESA",
        lastVerified: V,
      }),
      p({
        name: "Dyslexia Therapy Scholarship",
        type: "Voucher",
        status: "active",
        sourceUrl: "https://www.mdek12.org/",
        lastVerified: V,
      }),
      p({
        name: "Nate Rogers Scholarship",
        type: "Voucher",
        status: "active",
        eligibility: "Students with speech-language impairments",
        sourceUrl: "https://www.mdek12.org/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Missouri",
    stateCode: "MO",
    programs: [
      p({
        name: "MOScholars",
        type: "Tax-Credit Education Savings Account",
        status: "active",
        sourceUrl: "https://treasurer.mo.gov/MOScholars/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Montana",
    stateCode: "MT",
    programs: [
      p({
        name: "Special Needs Equal Opportunity Education Savings Account",
        type: "Education Savings Account",
        status: "active",
        eligibility: "Students with qualifying special needs",
        sourceUrl: "https://opi.mt.gov/",
        lastVerified: V,
      }),
      p({
        name: "Montana Tax Credit Scholarship Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://mtrevenue.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Nebraska",
    stateCode: "NE",
    programs: [],
    note: "Nebraska's private school scholarship laws were repealed by voters in November 2024. A revival bill was introduced in 2026 but has not been enacted.",
  },
  {
    state: "Nevada",
    stateCode: "NV",
    programs: [
      p({
        name: "Educational Choice Scholarship Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://doe.nv.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "New Hampshire",
    stateCode: "NH",
    programs: [
      p({
        name: "Education Freedom Account (EFA)",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "All New Hampshire K–12 students (income cap removed in 2025; priority for lower-income families, and a 10,000-student enrollment cap applies)",
        award: "Averages about $4,795 per student (2025–26, EdChoice)",
        sourceUrl: "https://www.education.nh.gov/pathways-education/education-freedom-accounts",
        lastVerified: V,
      }),
      p({
        name: "Education Tax Credit Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://www.education.nh.gov/",
        lastVerified: V,
      }),
      p({
        name: "Town Tuitioning Program",
        type: "Voucher / Town Tuitioning",
        status: "active",
        eligibility: "Students in towns without an assigned public school",
        sourceUrl: "https://www.education.nh.gov/",
        lastVerified: V,
      }),
    ],
  },
  { state: "New Jersey", stateCode: "NJ", programs: [] },
  { state: "New Mexico", stateCode: "NM", programs: [] },
  { state: "New York", stateCode: "NY", programs: [] },
  {
    state: "North Carolina",
    stateCode: "NC",
    programs: [
      p({
        name: "Opportunity Scholarship",
        type: "Voucher",
        status: "active",
        eligibility: "All North Carolina K–12 students; award size decreases as household income rises",
        award: "$3,574–$7,942 per student depending on income tier (2026–27)",
        sourceUrl: "https://www.ncseaa.edu/k12/opportunity/",
        lastVerified: V,
      }),
      p({
        name: "Education Student Accounts Plus (ESA+)",
        type: "Education Savings Account",
        status: "active",
        eligibility: "Students with disabilities",
        sourceUrl: "https://www.ncseaa.edu/k12/esa/",
        lastVerified: V,
      }),
    ],
  },
  { state: "North Dakota", stateCode: "ND", programs: [] },
  {
    state: "Ohio",
    stateCode: "OH",
    programs: [
      p({
        name: "EdChoice Scholarship Program",
        type: "Voucher",
        status: "active",
        eligibility:
          "All Ohio K–12 students; full scholarship for families up to 450% of the federal poverty level, with reduced amounts above that",
        award: "Up to $6,166 per student in K–8 and $8,408 in grades 9–12",
        sourceUrl: "https://education.ohio.gov/Topics/Other-Resources/Scholarships/EdChoice-Scholarship-Program",
        lastVerified: V,
      }),
      p({
        name: "Cleveland Scholarship Program",
        type: "Voucher",
        status: "active",
        eligibility: "Students living in the Cleveland Municipal School District",
        sourceUrl: "https://education.ohio.gov/Topics/Other-Resources/Scholarships/Cleveland-Scholarship-Tutoring-Program",
        lastVerified: V,
      }),
      p({
        name: "Autism Scholarship Program",
        type: "Voucher",
        status: "active",
        eligibility: "Students with autism and an IEP",
        sourceUrl: "https://education.ohio.gov/Topics/Other-Resources/Scholarships/Autism-Scholarship-Program",
        lastVerified: V,
      }),
      p({
        name: "Jon Peterson Special Needs Scholarship",
        type: "Voucher",
        status: "active",
        eligibility: "Students with an IEP",
        sourceUrl: "https://education.ohio.gov/Topics/Other-Resources/Scholarships/Special-Needs-Scholarship",
        lastVerified: V,
      }),
      p({
        name: "Ohio K-12 Home Education Tax Credit",
        type: "Individual Tax Credit",
        status: "active",
        sourceUrl: "https://tax.ohio.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Oklahoma",
    stateCode: "OK",
    programs: [
      p({
        name: "Parental Choice Tax Credit",
        type: "Refundable Tax Credit",
        status: "active",
        eligibility:
          "All Oklahoma families; the credit amount is based on household income. Homeschool families may claim $1,000 per child",
        award: "$5,000–$7,500 per child for private school tuition",
        sourceUrl: "https://www.parentalchoice.ok.gov/",
        lastVerified: V,
      }),
      p({
        name: "Lindsey Nicole Henry Scholarship",
        type: "Voucher",
        status: "active",
        eligibility: "Students with disabilities, students in foster care, and military-connected students",
        sourceUrl: "https://sde.ok.gov/lindsey-nicole-henry-lnh-scholarship-program",
        lastVerified: V,
      }),
      p({
        name: "Equal Opportunity Education Scholarship",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://www.sde.ok.gov/",
        lastVerified: V,
      }),
    ],
  },
  { state: "Oregon", stateCode: "OR", programs: [] },
  {
    state: "Pennsylvania",
    stateCode: "PA",
    programs: [
      p({
        name: "Educational Improvement Tax Credit (EITC)",
        type: "Tax-Credit Scholarship",
        status: "active",
        eligibility: "Household income up to $122,322 plus $21,531 for each dependent (PA DCED)",
        sourceUrl: "https://dced.pa.gov/programs/educational-improvement-tax-credit-program-eitc/",
        lastVerified: V,
      }),
      p({
        name: "Opportunity Scholarship Tax Credit (OSTC)",
        type: "Tax-Credit Scholarship",
        status: "active",
        eligibility:
          "Students living within the attendance boundary of a low-achieving school, under the same income limits as EITC",
        award: "Up to $8,500 per student; up to $15,000 for students with special needs (PA DCED)",
        sourceUrl: "https://dced.pa.gov/programs/opportunity-scholarship-tax-credit-program-ostc/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Rhode Island",
    stateCode: "RI",
    programs: [
      p({
        name: "Tax Credits for Contributions to Scholarship Organizations",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://ride.ri.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "South Carolina",
    stateCode: "SC",
    programs: [
      p({
        name: "Education Scholarship Trust Fund",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "Families earning up to 300% of the federal poverty level, rising to 500% in 2026–27",
        award: "$7,500 per student",
        sourceUrl: "https://www.scstudentconnection.org/",
        lastVerified: V,
      }),
      p({
        name: "Exceptional SC",
        type: "Tax-Credit Scholarship",
        status: "active",
        eligibility: "Students with exceptional needs",
        sourceUrl: "https://exceptionalsc.org/",
        lastVerified: V,
      }),
      p({
        name: "Refundable Educational Credit",
        type: "Refundable Tax Credit",
        status: "active",
        sourceUrl: "https://dor.sc.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "South Dakota",
    stateCode: "SD",
    programs: [
      p({
        name: "Partners in Education Tax Credit Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://doe.sd.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Tennessee",
    stateCode: "TN",
    programs: [
      p({
        name: "Education Freedom Scholarship",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "Tennessee K–12 students; half of the 20,000 scholarships are reserved for lower-income families and students with disabilities",
        award: "$7,295 per student (2025–26)",
        sourceUrl: "https://www.tn.gov/education/families/school-options/education-freedom-scholarships.html",
        lastVerified: V,
      }),
      p({
        name: "Individualized Education Account Program",
        type: "Education Savings Account",
        status: "active",
        eligibility: "Students with qualifying disabilities",
        sourceUrl: "https://www.tn.gov/education/families/school-options/individualized-education-account-program.html",
        lastVerified: V,
      }),
      p({
        name: "Education Savings Account Pilot Program",
        type: "Education Savings Account",
        status: "active",
        eligibility: "Students in eligible districts (Memphis, Nashville, and qualifying districts)",
        sourceUrl: "https://www.tn.gov/education/families/school-options/education-savings-account-program.html",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Texas",
    stateCode: "TX",
    programs: [
      p({
        name: "Texas Education Freedom Accounts (TEFA)",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "Texas children eligible to attend a public school; priority for students with disabilities and low- and middle-income families",
        award:
          "$10,474 per student; up to $30,000 for students with disabilities; $2,000 for homeschool students (2026–27)",
        note: "Created by SB 2 in 2025 and administered by the Texas Comptroller; first accounts fund the 2026–27 school year.",
        sourceUrl: "https://educationfreedom.texas.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Utah",
    stateCode: "UT",
    programs: [
      p({
        name: "Utah Fits All Scholarship",
        type: "Education Savings Account",
        status: "active",
        eligibility:
          "All Utah K–12 students; total funding is capped, with priority for lower-income families",
        award: "$8,000 per student; $4,000–$6,000 for homeschool students by age",
        sourceUrl: "https://ufascholarship.com/",
        lastVerified: V,
      }),
      p({
        name: "Carson Smith Scholarship",
        type: "Voucher",
        status: "active",
        eligibility: "Students with disabilities",
        sourceUrl: "https://schools.utah.gov/specialeducation/programs/carsonsmithscholarship",
        lastVerified: V,
      }),
      p({
        name: "Special Needs Opportunity Scholarship",
        type: "Tax-Credit Scholarship",
        status: "active",
        eligibility: "Students with qualifying special needs",
        sourceUrl: "https://schools.utah.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Vermont",
    stateCode: "VT",
    programs: [
      p({
        name: "Town Tuitioning Program",
        type: "Voucher / Town Tuitioning",
        status: "active",
        eligibility: "Students in towns that do not operate a public school",
        sourceUrl: "https://education.vermont.gov/vermont-schools/school-operations/public-schools/public-tuitioning",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Virginia",
    stateCode: "VA",
    programs: [
      p({
        name: "Education Improvement Scholarships Tax Credits Program",
        type: "Tax-Credit Scholarship",
        status: "active",
        sourceUrl: "https://www.doe.virginia.gov/parents-students/for-parents/school-choice/education-improvement-scholarships-tax-credits-program",
        lastVerified: V,
      }),
    ],
  },
  { state: "Washington", stateCode: "WA", programs: [] },
  {
    state: "West Virginia",
    stateCode: "WV",
    programs: [
      p({
        name: "Hope Scholarship",
        type: "Education Savings Account",
        status: "active",
        eligibility: "All West Virginia K–12 students (universal eligibility from 2026–27)",
        award: "$5,267 per student",
        sourceUrl: "https://hopescholarshipwv.com/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Wisconsin",
    stateCode: "WI",
    programs: [
      p({
        name: "Wisconsin Parental Choice Program",
        type: "Voucher",
        status: "active",
        eligibility:
          "Families earning up to 220% of the federal poverty level, outside Milwaukee and Racine",
        award: "$10,877 per student in K–8 and $13,371 in grades 9–12 (2025–26)",
        sourceUrl: "https://dpi.wi.gov/parental-education-options/choice-programs",
        lastVerified: V,
      }),
      p({
        name: "Milwaukee Parental Choice Program",
        type: "Voucher",
        status: "active",
        eligibility: "Milwaukee families earning up to 300% of the federal poverty level",
        sourceUrl: "https://dpi.wi.gov/parental-education-options/choice-programs",
        lastVerified: V,
      }),
      p({
        name: "Racine Parental Choice Program",
        type: "Voucher",
        status: "active",
        eligibility: "Racine Unified families earning up to 300% of the federal poverty level",
        sourceUrl: "https://dpi.wi.gov/parental-education-options/choice-programs",
        lastVerified: V,
      }),
      p({
        name: "Special Needs Scholarship Program",
        type: "Voucher",
        status: "active",
        eligibility: "Students with disabilities",
        sourceUrl: "https://dpi.wi.gov/parental-education-options/special-needs-scholarship-program",
        lastVerified: V,
      }),
      p({
        name: "K-12 Private School Tuition Deduction",
        type: "Tax Deduction",
        status: "active",
        sourceUrl: "https://www.revenue.wi.gov/",
        lastVerified: V,
      }),
    ],
  },
  {
    state: "Wyoming",
    stateCode: "WY",
    programs: [
      p({
        name: "Steamboat Legacy Scholarship",
        type: "Education Savings Account",
        status: "active",
        eligibility: "All Wyoming K–12 students; no income limit",
        award: "$7,000 per student",
        note: "The Wyoming Supreme Court lifted a court block on the program in May 2026, so funding is flowing while a legal challenge continues.",
        sourceUrl: "https://edu.wyoming.gov/",
        lastVerified: V,
      }),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Accessors                                                           */
/* ------------------------------------------------------------------ */

export interface StateSchoolChoice {
  state: string;
  stateCode: string;
  /** Federal entry (if tracked) followed by state-run programs. */
  programs: SchoolChoiceProgramInfo[];
  /** State-run programs only. */
  statePrograms: SchoolChoiceProgramInfo[];
  note?: string;
}

export function getSchoolChoiceForState(state: string): StateSchoolChoice | null {
  const entry = schoolChoiceStates.find((s) => s.state === state);
  if (!entry) return null;
  const federal = federalProgramFor(state);
  return {
    state: entry.state,
    stateCode: entry.stateCode,
    programs: federal ? [federal, ...entry.programs] : entry.programs,
    statePrograms: entry.programs,
    note: entry.note,
  };
}

/** States that run at least one statewide program of their own. */
export function stateHasOwnProgram(state: string): boolean {
  const entry = schoolChoiceStates.find((s) => s.state === state);
  return !!entry && entry.programs.length > 0;
}

/** All 51 jurisdictions covered by this file (50 states + DC). */
export const schoolChoiceStateList = schoolChoiceStates.map((s) => ({
  state: s.state,
  stateCode: s.stateCode,
}));

/** Attribution shown under the block. Amounts change yearly — re-verify. */
export const SCHOOL_CHOICE_ATTRIBUTION =
  "Program details verified against official state and federal sources, cross-checked with EdChoice research (The ABCs of School Choice). Amounts and rules change — confirm current details on the official source before applying.";
