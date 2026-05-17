import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, MapPin, BookOpen, Scale, Award, ChevronRight, ExternalLink, TrendingUp, Users, Map, Search, AlertCircle, Building2, Bird, CalendarCheck } from "lucide-react";
import { Link } from "wouter";
import InviteSchoolCard from "@/components/InviteSchoolCard";
import { getProgramsByState } from "@shared/schoolChoicePrograms";

const stateNames: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"
};

const stateInfo: Record<string, { homeschoolLaw: string; scholarships: string; regulation: string }> = {
  AL: { homeschoolLaw: "Alabama allows homeschooling through a church school cover or private tutor. Parents must file a form with the local superintendent.", scholarships: "Alabama Accountability Act provides tax credits for private school scholarships.", regulation: "Low-moderate regulation" },
  AK: { homeschoolLaw: "Alaska has no compulsory notification requirement for homeschoolers. Parents have full freedom in curriculum choice.", scholarships: "Alaska does not currently offer private school voucher or scholarship programs.", regulation: "No regulation state" },
  AZ: { homeschoolLaw: "Arizona requires filing an Affidavit of Intent. No testing or curriculum requirements.", scholarships: "Empowerment Scholarship Accounts (ESA) - universal eligibility for all K-12 students.", regulation: "Low regulation state" },
  AR: { homeschoolLaw: "Arkansas requires notice of intent filed with the local superintendent by August 15. No testing required.", scholarships: "Succeed Scholarship Program for students with disabilities.", regulation: "Low regulation state" },
  CA: { homeschoolLaw: "California requires filing a Private School Affidavit or enrolling in a PSP/charter. Instruction must be in English.", scholarships: "Limited state-level scholarship programs for private schools.", regulation: "Moderate regulation state" },
  CO: { homeschoolLaw: "Colorado requires notification 14 days before starting, 172 days of instruction, and standardized testing at grades 3, 5, 7, 9, 11.", scholarships: "Choice Scholarship Pilot Program in select districts.", regulation: "Moderate regulation state" },
  CT: { homeschoolLaw: "Connecticut does not require notification but recommends it. Instruction must include required subjects.", scholarships: "No statewide private school scholarship program currently.", regulation: "Low regulation state" },
  DE: { homeschoolLaw: "Delaware requires enrollment in a homeschool association or filing with the Department of Education. Attendance records required.", scholarships: "No statewide voucher program; some district-level options.", regulation: "Moderate regulation state" },
  FL: { homeschoolLaw: "Florida requires annual evaluation and notice of intent to the district superintendent. Portfolio review or standardized testing required.", scholarships: "Florida Tax Credit Scholarship, Family Empowerment Scholarship, Step Up For Students.", regulation: "Moderate regulation state" },
  GA: { homeschoolLaw: "Georgia requires Declaration of Intent, attendance records, and annual progress assessment or standardized testing every 3 years.", scholarships: "Georgia GOAL Scholarship Program for private school tuition.", regulation: "Moderate regulation state" },
  HI: { homeschoolLaw: "Hawaii requires notification to the principal of the school the child would otherwise attend. Annual progress reports required.", scholarships: "No statewide private school scholarship program.", regulation: "Moderate regulation state" },
  ID: { homeschoolLaw: "Idaho has no notification, testing, or curriculum requirements for homeschoolers. Complete parental freedom.", scholarships: "No statewide voucher or scholarship program currently.", regulation: "No regulation state" },
  IL: { homeschoolLaw: "Illinois considers homeschools as private schools. No registration or notification required. Must teach required subjects.", scholarships: "Invest in Kids Act provides tax credit scholarships (limited).", regulation: "Low regulation state" },
  IN: { homeschoolLaw: "Indiana requires enrollment report and attendance equivalent to public school (180 days). No testing required.", scholarships: "Indiana Choice Scholarships (vouchers) for eligible families.", regulation: "Low regulation state" },
  IA: { homeschoolLaw: "Iowa offers multiple options: CPI (Competent Private Instruction) with reporting, or independent private instruction with no oversight.", scholarships: "Students First Education Savings Accounts for private school.", regulation: "Low-moderate regulation" },
  KS: { homeschoolLaw: "Kansas requires registration as a non-accredited private school. No testing or curriculum requirements.", scholarships: "Tax Credit for Low Income Students Scholarship Program.", regulation: "Low regulation state" },
  KY: { homeschoolLaw: "Kentucky requires notification to the local board of education and attendance records. No testing required.", scholarships: "No statewide voucher program currently.", regulation: "Low regulation state" },
  LA: { homeschoolLaw: "Louisiana requires application approval from the Board of Education. Renewal required annually with documentation.", scholarships: "Louisiana Scholarship Program for low-income families.", regulation: "Moderate regulation state" },
  ME: { homeschoolLaw: "Maine requires written notice and annual assessment (standardized test, review, or portfolio). Instruction in required subjects.", scholarships: "Town Tuitioning program in towns without public schools.", regulation: "Moderate regulation state" },
  MD: { homeschoolLaw: "Maryland requires notification and instruction in required subjects. Portfolios reviewed by local superintendent or umbrella group.", scholarships: "BOOST Scholarship Program for low-income families.", regulation: "Moderate regulation state" },
  MA: { homeschoolLaw: "Massachusetts requires prior approval from the local school committee. Curriculum must be approved in advance.", scholarships: "No statewide private school scholarship program.", regulation: "High regulation state" },
  MI: { homeschoolLaw: "Michigan has no notification requirement. Parents must provide instruction in required subjects.", scholarships: "No statewide voucher or scholarship program currently.", regulation: "Low regulation state" },
  MN: { homeschoolLaw: "Minnesota requires annual reporting to the local superintendent. Standardized testing required annually.", scholarships: "Tax credits and deductions for education expenses available.", regulation: "Moderate regulation state" },
  MS: { homeschoolLaw: "Mississippi requires a certificate of enrollment filed with the school attendance officer. No testing required.", scholarships: "Mississippi Dyslexia Therapy Scholarship for eligible students.", regulation: "Low regulation state" },
  MO: { homeschoolLaw: "Missouri requires 1,000 hours of instruction (600 in core subjects). Maintain records of subjects and hours.", scholarships: "Missouri Empowerment Scholarship Accounts Program.", regulation: "Low regulation state" },
  MT: { homeschoolLaw: "Montana requires notification to the county superintendent. Must maintain attendance and immunization records.", scholarships: "Montana Tax Credit Scholarship program for private schools.", regulation: "Low regulation state" },
  NE: { homeschoolLaw: "Nebraska requires filing a statement of intent by August 1. Must provide instruction in required subjects.", scholarships: "Nebraska Opportunity Scholarships Act (tax credit program).", regulation: "Low-moderate regulation" },
  NV: { homeschoolLaw: "Nevada requires written notice of intent to homeschool. No testing or curriculum approval required.", scholarships: "Nevada Education Savings Accounts (currently on hold).", regulation: "Low regulation state" },
  NH: { homeschoolLaw: "New Hampshire requires notification and annual evaluation (standardized test, portfolio, or other). Must teach required subjects.", scholarships: "Education Freedom Accounts for eligible students.", regulation: "Moderate regulation state" },
  NJ: { homeschoolLaw: "New Jersey has no notification or registration requirement. Must provide equivalent instruction.", scholarships: "Opportunity Scholarship Act (pilot program in select districts).", regulation: "Low regulation state" },
  NM: { homeschoolLaw: "New Mexico requires notification within 30 days of establishing a homeschool. Maintain attendance records.", scholarships: "No statewide voucher program currently.", regulation: "Low regulation state" },
  NY: { homeschoolLaw: "New York requires notice of intent, Individualized Home Instruction Plan (IHIP), quarterly reports, and annual assessment.", scholarships: "No statewide private school scholarship program.", regulation: "High regulation state" },
  NC: { homeschoolLaw: "North Carolina requires notice of intent, attendance records, and annual standardized testing.", scholarships: "Opportunity Scholarship Program for private school students.", regulation: "Low-moderate regulation" },
  ND: { homeschoolLaw: "North Dakota requires notification and standardized testing in grades 3, 4, 6, 8, 11. Must file intent to homeschool.", scholarships: "No statewide voucher program currently.", regulation: "Moderate regulation state" },
  OH: { homeschoolLaw: "Ohio requires annual notification to the local superintendent. Must provide 900 hours of instruction in required subjects.", scholarships: "EdChoice Scholarship Program and Jon Peterson Special Needs Scholarship.", regulation: "Moderate regulation state" },
  OK: { homeschoolLaw: "Oklahoma has no notification, testing, or curriculum requirements. Constitutional protection for homeschooling.", scholarships: "Oklahoma Parental Choice Tax Credit Program.", regulation: "No regulation state" },
  OR: { homeschoolLaw: "Oregon requires notification to the local ESD. Standardized testing required at grades 3, 5, 8, 10.", scholarships: "No statewide private school scholarship program.", regulation: "Moderate regulation state" },
  PA: { homeschoolLaw: "Pennsylvania requires notarized affidavit, portfolio review by evaluator, and standardized testing at grades 3, 5, 8.", scholarships: "Educational Improvement Tax Credit (EITC) and Opportunity Scholarship Tax Credit.", regulation: "High regulation state" },
  RI: { homeschoolLaw: "Rhode Island requires approval from the local school committee. Must demonstrate satisfactory progress.", scholarships: "No statewide voucher program currently.", regulation: "High regulation state" },
  SC: { homeschoolLaw: "South Carolina offers three options: approval by local board, membership in SCAIHS, or accountability association.", scholarships: "Education Scholarship Trust Fund for exceptional needs students.", regulation: "Moderate regulation state" },
  SD: { homeschoolLaw: "South Dakota requires notification to the local school district. Must provide instruction in required subjects.", scholarships: "South Dakota Partners in Education tax credit program.", regulation: "Low regulation state" },
  TN: { homeschoolLaw: "Tennessee requires notice and attendance records. Standardized testing required in grades 5, 7, 9.", scholarships: "Individualized Education Account (IEA) Program for eligible students.", regulation: "Moderate regulation state" },
  TX: { homeschoolLaw: "Texas considers homeschools as private schools. No state notification, testing, or curriculum requirements.", scholarships: "Texas Private School Choice available for eligible families.", regulation: "Low regulation state" },
  UT: { homeschoolLaw: "Utah requires an affidavit filed with the local school board. No testing or curriculum approval required.", scholarships: "Utah Fits All Scholarship program (universal eligibility).", regulation: "Low regulation state" },
  VT: { homeschoolLaw: "Vermont requires annual enrollment notice to the Department of Education. Annual assessment required.", scholarships: "Town Tuitioning for students in towns without public schools.", regulation: "Moderate regulation state" },
  VA: { homeschoolLaw: "Virginia requires notice of intent and annual evidence of progress (standardized testing or evaluation).", scholarships: "Education Improvement Scholarships Tax Credits Program.", regulation: "Moderate regulation state" },
  WA: { homeschoolLaw: "Washington requires annual notice of intent and annual assessment (standardized test or evaluation). Must teach 11 required subjects.", scholarships: "No statewide private school scholarship program.", regulation: "Moderate regulation state" },
  WV: { homeschoolLaw: "West Virginia requires notice of intent. Annual assessment required (standardized test, portfolio, or evaluation).", scholarships: "Hope Scholarship Program (Education Savings Account).", regulation: "Moderate regulation state" },
  WI: { homeschoolLaw: "Wisconsin requires enrollment with the Department of Public Instruction by October 15. Must provide 875 hours of instruction.", scholarships: "Wisconsin Parental Choice Program (vouchers) for eligible families.", regulation: "Low regulation state" },
  WY: { homeschoolLaw: "Wyoming requires annual curriculum submission to the local school board. No testing required.", scholarships: "No statewide voucher program currently.", regulation: "Low regulation state" },
};

const stateDetails: Record<string, { capital: string; bird: string; yearAdmitted: number; nickname: string }> = {
  AL:{capital:"Montgomery",bird:"Northern Flicker",yearAdmitted:1819,nickname:"Heart of Dixie"},
  AK:{capital:"Juneau",bird:"Willow Ptarmigan",yearAdmitted:1959,nickname:"The Last Frontier"},
  AZ:{capital:"Phoenix",bird:"Cactus Wren",yearAdmitted:1912,nickname:"Grand Canyon State"},
  AR:{capital:"Little Rock",bird:"Mockingbird",yearAdmitted:1836,nickname:"Natural State"},
  CA:{capital:"Sacramento",bird:"California Quail",yearAdmitted:1850,nickname:"Golden State"},
  CO:{capital:"Denver",bird:"Lark Bunting",yearAdmitted:1876,nickname:"Centennial State"},
  CT:{capital:"Hartford",bird:"American Robin",yearAdmitted:1788,nickname:"Constitution State"},
  DE:{capital:"Dover",bird:"Blue Hen Chicken",yearAdmitted:1787,nickname:"First State"},
  FL:{capital:"Tallahassee",bird:"Mockingbird",yearAdmitted:1845,nickname:"Sunshine State"},
  GA:{capital:"Atlanta",bird:"Brown Thrasher",yearAdmitted:1788,nickname:"Peach State"},
  HI:{capital:"Honolulu",bird:"Nene",yearAdmitted:1959,nickname:"Aloha State"},
  ID:{capital:"Boise",bird:"Mountain Bluebird",yearAdmitted:1890,nickname:"Gem State"},
  IL:{capital:"Springfield",bird:"Northern Cardinal",yearAdmitted:1818,nickname:"Prairie State"},
  IN:{capital:"Indianapolis",bird:"Northern Cardinal",yearAdmitted:1816,nickname:"Hoosier State"},
  IA:{capital:"Des Moines",bird:"Eastern Goldfinch",yearAdmitted:1846,nickname:"Hawkeye State"},
  KS:{capital:"Topeka",bird:"Western Meadowlark",yearAdmitted:1861,nickname:"Sunflower State"},
  KY:{capital:"Frankfort",bird:"Northern Cardinal",yearAdmitted:1792,nickname:"Bluegrass State"},
  LA:{capital:"Baton Rouge",bird:"Brown Pelican",yearAdmitted:1812,nickname:"Pelican State"},
  ME:{capital:"Augusta",bird:"Black-capped Chickadee",yearAdmitted:1820,nickname:"Pine Tree State"},
  MD:{capital:"Annapolis",bird:"Baltimore Oriole",yearAdmitted:1788,nickname:"Old Line State"},
  MA:{capital:"Boston",bird:"Black-capped Chickadee",yearAdmitted:1788,nickname:"Bay State"},
  MI:{capital:"Lansing",bird:"American Robin",yearAdmitted:1837,nickname:"Great Lakes State"},
  MN:{capital:"Saint Paul",bird:"Common Loon",yearAdmitted:1858,nickname:"North Star State"},
  MS:{capital:"Jackson",bird:"Mockingbird",yearAdmitted:1817,nickname:"Magnolia State"},
  MO:{capital:"Jefferson City",bird:"Eastern Bluebird",yearAdmitted:1821,nickname:"Show Me State"},
  MT:{capital:"Helena",bird:"Western Meadowlark",yearAdmitted:1889,nickname:"Treasure State"},
  NE:{capital:"Lincoln",bird:"Western Meadowlark",yearAdmitted:1867,nickname:"Cornhusker State"},
  NV:{capital:"Carson City",bird:"Mountain Bluebird",yearAdmitted:1864,nickname:"Silver State"},
  NH:{capital:"Concord",bird:"Purple Finch",yearAdmitted:1788,nickname:"Granite State"},
  NJ:{capital:"Trenton",bird:"Eastern Goldfinch",yearAdmitted:1787,nickname:"Garden State"},
  NM:{capital:"Santa Fe",bird:"Greater Roadrunner",yearAdmitted:1912,nickname:"Land of Enchantment"},
  NY:{capital:"Albany",bird:"Eastern Bluebird",yearAdmitted:1788,nickname:"Empire State"},
  NC:{capital:"Raleigh",bird:"Northern Cardinal",yearAdmitted:1789,nickname:"Tar Heel State"},
  ND:{capital:"Bismarck",bird:"Western Meadowlark",yearAdmitted:1889,nickname:"Peace Garden State"},
  OH:{capital:"Columbus",bird:"Northern Cardinal",yearAdmitted:1803,nickname:"Buckeye State"},
  OK:{capital:"Oklahoma City",bird:"Scissor-tailed Flycatcher",yearAdmitted:1907,nickname:"Sooner State"},
  OR:{capital:"Salem",bird:"Western Meadowlark",yearAdmitted:1859,nickname:"Beaver State"},
  PA:{capital:"Harrisburg",bird:"Ruffed Grouse",yearAdmitted:1787,nickname:"Keystone State"},
  RI:{capital:"Providence",bird:"Rhode Island Red",yearAdmitted:1790,nickname:"Ocean State"},
  SC:{capital:"Columbia",bird:"Carolina Wren",yearAdmitted:1788,nickname:"Palmetto State"},
  SD:{capital:"Pierre",bird:"Ring-necked Pheasant",yearAdmitted:1889,nickname:"Mount Rushmore State"},
  TN:{capital:"Nashville",bird:"Mockingbird",yearAdmitted:1796,nickname:"Volunteer State"},
  TX:{capital:"Austin",bird:"Mockingbird",yearAdmitted:1845,nickname:"Lone Star State"},
  UT:{capital:"Salt Lake City",bird:"California Gull",yearAdmitted:1896,nickname:"Beehive State"},
  VT:{capital:"Montpelier",bird:"Hermit Thrush",yearAdmitted:1791,nickname:"Green Mountain State"},
  VA:{capital:"Richmond",bird:"Northern Cardinal",yearAdmitted:1788,nickname:"Old Dominion"},
  WA:{capital:"Olympia",bird:"Willow Goldfinch",yearAdmitted:1889,nickname:"Evergreen State"},
  WV:{capital:"Charleston",bird:"Northern Cardinal",yearAdmitted:1863,nickname:"Mountain State"},
  WI:{capital:"Madison",bird:"American Robin",yearAdmitted:1848,nickname:"Badger State"},
  WY:{capital:"Cheyenne",bird:"Western Meadowlark",yearAdmitted:1890,nickname:"Equality State"},
};

const stateFunFacts: Record<string, { population: string; christianSchoolEstimate: number; motto: string; funFact: string }> = {
  AL: { population: "5.1M", christianSchoolEstimate: 280, motto: "We Dare Defend Our Rights", funFact: "Alabama has one of the highest per-capita rates of faith-based schools in the Southeast." },
  AK: { population: "733K", christianSchoolEstimate: 45, motto: "North to the Future", funFact: "Many Alaskan Christian schools serve remote communities accessible only by plane." },
  AZ: { population: "7.4M", christianSchoolEstimate: 190, motto: "God Enriches", funFact: "Arizona's ESA program provides universal school choice for all K-12 students." },
  AR: { population: "3.0M", christianSchoolEstimate: 120, motto: "The People Rule", funFact: "Arkansas has seen a 30% growth in Christian school enrollment since 2020." },
  CA: { population: "39.0M", christianSchoolEstimate: 1200, motto: "Eureka", funFact: "California has the most Christian schools of any state, with over 1,200 campuses." },
  CO: { population: "5.8M", christianSchoolEstimate: 175, motto: "Nothing Without Providence", funFact: "Colorado Springs is home to multiple national Christian education organizations." },
  CT: { population: "3.6M", christianSchoolEstimate: 95, motto: "He Who Transplanted Still Sustains", funFact: "Connecticut's Christian schools have an average 95% college acceptance rate." },
  DE: { population: "1.0M", christianSchoolEstimate: 35, motto: "Liberty and Independence", funFact: "Delaware's small size means most families are within 20 minutes of a Christian school." },
  FL: { population: "22.6M", christianSchoolEstimate: 850, motto: "In God We Trust", funFact: "Florida's Step Up For Students program serves over 100,000 scholarship recipients." },
  GA: { population: "11.0M", christianSchoolEstimate: 420, motto: "Wisdom, Justice, Moderation", funFact: "Georgia's GOAL scholarship has provided over $200M in private school scholarships." },
  HI: { population: "1.4M", christianSchoolEstimate: 55, motto: "The Life of the Land Is Perpetuated in Righteousness", funFact: "Hawaii's Christian schools often blend Hawaiian culture with biblical teaching." },
  ID: { population: "1.9M", christianSchoolEstimate: 65, motto: "Let It Be Perpetual", funFact: "Idaho has zero regulation for homeschoolers, making it one of the freest states for education." },
  IL: { population: "12.6M", christianSchoolEstimate: 450, motto: "State Sovereignty, National Union", funFact: "Illinois Christian schools serve diverse communities from Chicago to rural farmland." },
  IN: { population: "6.8M", christianSchoolEstimate: 310, motto: "Crossroads of America", funFact: "Indiana's Choice Scholarship is one of the largest voucher programs in the nation." },
  IA: { population: "3.2M", christianSchoolEstimate: 130, motto: "Our Liberties We Prize", funFact: "Iowa's new Education Savings Accounts provide $7,600+ per student for private school." },
  KS: { population: "2.9M", christianSchoolEstimate: 105, motto: "To the Stars Through Difficulties", funFact: "Kansas Christian schools consistently outperform state averages on standardized tests." },
  KY: { population: "4.5M", christianSchoolEstimate: 180, motto: "United We Stand, Divided We Fall", funFact: "Kentucky is home to the Creation Museum and Ark Encounter, major Christian education landmarks." },
  LA: { population: "4.6M", christianSchoolEstimate: 220, motto: "Union, Justice, Confidence", funFact: "Louisiana's scholarship program has served over 7,000 low-income students annually." },
  ME: { population: "1.4M", christianSchoolEstimate: 40, motto: "I Lead", funFact: "Maine's town tuitioning program allows public funds for private school in towns without schools." },
  MD: { population: "6.2M", christianSchoolEstimate: 200, motto: "Manly Deeds, Womanly Words", funFact: "Maryland's BOOST program provides scholarships to over 3,000 students annually." },
  MA: { population: "7.0M", christianSchoolEstimate: 180, motto: "By the Sword We Seek Peace", funFact: "Massachusetts has some of the oldest Christian schools in America, dating to the 1600s." },
  MI: { population: "10.0M", christianSchoolEstimate: 380, motto: "If You Seek a Pleasant Peninsula, Look About You", funFact: "Michigan's Christian school network is one of the largest in the Midwest." },
  MN: { population: "5.7M", christianSchoolEstimate: 200, motto: "The Star of the North", funFact: "Minnesota offers tax credits and deductions for private education expenses." },
  MS: { population: "2.9M", christianSchoolEstimate: 150, motto: "By Valor and Arms", funFact: "Mississippi has seen significant growth in Christian school enrollment post-2020." },
  MO: { population: "6.2M", christianSchoolEstimate: 260, motto: "Let the Welfare of the People Be the Supreme Law", funFact: "Missouri's Empowerment Scholarship Accounts launched in 2024 for Kansas City and St. Louis." },
  MT: { population: "1.1M", christianSchoolEstimate: 45, motto: "Gold and Silver", funFact: "Montana's tax credit scholarship was upheld by the US Supreme Court in 2020." },
  NE: { population: "2.0M", christianSchoolEstimate: 85, motto: "Equality Before the Law", funFact: "Nebraska's new Opportunity Scholarships Act provides tax credits for private school donations." },
  NV: { population: "3.2M", christianSchoolEstimate: 70, motto: "All for Our Country", funFact: "Nevada was the first state to pass universal Education Savings Accounts." },
  NH: { population: "1.4M", christianSchoolEstimate: 50, motto: "Live Free or Die", funFact: "New Hampshire's Education Freedom Accounts cover 90%+ of average per-pupil spending." },
  NJ: { population: "9.3M", christianSchoolEstimate: 280, motto: "Liberty and Prosperity", funFact: "New Jersey has no notification requirement for homeschoolers—one of the freest in the Northeast." },
  NM: { population: "2.1M", christianSchoolEstimate: 55, motto: "It Grows as It Goes", funFact: "New Mexico's Christian schools serve many bilingual families with English-Spanish instruction." },
  NY: { population: "19.6M", christianSchoolEstimate: 600, motto: "Excelsior (Ever Upward)", funFact: "New York has the most regulated homeschool environment but also robust private school options." },
  NC: { population: "10.7M", christianSchoolEstimate: 450, motto: "To Be Rather Than to Seem", funFact: "North Carolina's Opportunity Scholarship serves 20,000+ students in private schools." },
  ND: { population: "780K", christianSchoolEstimate: 30, motto: "Liberty and Union", funFact: "North Dakota's small class sizes in Christian schools average 12:1 student-teacher ratios." },
  OH: { population: "11.8M", christianSchoolEstimate: 480, motto: "With God, All Things Are Possible", funFact: "Ohio's EdChoice program is one of the oldest and largest voucher programs in the US." },
  OK: { population: "4.0M", christianSchoolEstimate: 160, motto: "Labor Conquers All Things", funFact: "Oklahoma has constitutional protection for homeschooling with zero state oversight." },
  OR: { population: "4.2M", christianSchoolEstimate: 130, motto: "She Flies with Her Own Wings", funFact: "Oregon's Christian schools are concentrated in the Willamette Valley corridor." },
  PA: { population: "13.0M", christianSchoolEstimate: 520, motto: "Virtue, Liberty, and Independence", funFact: "Pennsylvania's EITC program has provided $1B+ in private school scholarships since 2001." },
  RI: { population: "1.1M", christianSchoolEstimate: 30, motto: "Hope", funFact: "Rhode Island was founded on principles of religious freedom by Roger Williams." },
  SC: { population: "5.3M", christianSchoolEstimate: 200, motto: "While I Breathe, I Hope", funFact: "South Carolina offers three distinct legal pathways for homeschooling families." },
  SD: { population: "900K", christianSchoolEstimate: 35, motto: "Under God the People Rule", funFact: "South Dakota's Partners in Education program provides tax credits for private school donations." },
  TN: { population: "7.1M", christianSchoolEstimate: 300, motto: "Agriculture and Commerce", funFact: "Tennessee's IEA program provides $7,000+ per student for private school choice." },
  TX: { population: "30.5M", christianSchoolEstimate: 1100, motto: "Friendship", funFact: "Texas has the second-most Christian schools in the nation with over 1,100 campuses." },
  UT: { population: "3.4M", christianSchoolEstimate: 60, motto: "Industry", funFact: "Utah's Fits All Scholarship provides universal eligibility for private school funding." },
  VT: { population: "647K", christianSchoolEstimate: 25, motto: "Freedom and Unity", funFact: "Vermont's town tuitioning allows public funds for private school in 90+ towns." },
  VA: { population: "8.6M", christianSchoolEstimate: 350, motto: "Thus Always to Tyrants", funFact: "Virginia's Education Improvement Scholarships have served 10,000+ students since 2013." },
  WA: { population: "7.8M", christianSchoolEstimate: 250, motto: "By and By", funFact: "Washington state requires 11 subjects be taught but allows full curriculum freedom." },
  WV: { population: "1.8M", christianSchoolEstimate: 55, motto: "Mountaineers Are Always Free", funFact: "West Virginia's Hope Scholarship provides near-universal school choice via ESAs." },
  WI: { population: "5.9M", christianSchoolEstimate: 280, motto: "Forward", funFact: "Wisconsin's Parental Choice Program is one of the oldest voucher programs in America (1990)." },
  WY: { population: "577K", christianSchoolEstimate: 20, motto: "Equal Rights", funFact: "Wyoming has the smallest number of Christian schools but strong community-based programs." },
};

export default function StateHub() {
  const { code } = useParams<{ code: string }>();
  const [, navigate] = useLocation();
  const stateCode = code?.toUpperCase() || "";
  const stateName = stateNames[stateCode] || stateCode;
  const info = stateInfo[stateCode];
  const funFacts = stateFunFacts[stateCode];

  const [cityFilter, setCityFilter] = useState("");
  const [showDataNotice, setShowDataNotice] = useState(false);
  // Preload queries with enabled flag to ensure they execute immediately
  const { data: schoolData, isLoading } = trpc.schools.getByState.useQuery({ stateCode }, { enabled: !!stateCode });
  const { data: resourceData } = trpc.resources.list.useQuery({ state: stateName, limit: 10 }, { enabled: !!stateName });
  const { data: eventData } = trpc.events.list.useQuery({ state: stateName, limit: 5 }, { enabled: !!stateName });
  const filteredSchools = schoolData?.filter((s: any) => !cityFilter || s.city?.toLowerCase().includes(cityFilter.toLowerCase()));
  
  // Show skeleton count while loading to prevent blank values
  const schoolCount = isLoading ? null : (filteredSchools?.length || 0);

  // Dynamic SEO
  useEffect(() => {
    document.title = `Christian Schools in ${stateName} | FindChristianSchools.org`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', `Find Christian schools, homeschool resources, and faith-based education programs in ${stateName}. Learn about ${stateName} homeschool laws, scholarships, and regulations.`);
    return () => { document.title = 'FindChristianSchools.org | Faith \u00b7 Education \u00b7 Future'; };
  }, [stateName]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#002855] to-[#0055A4] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/manus-storage/IMG_0836_e297d476.jpeg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/states" className="hover:text-white">States</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{stateName}</span>
            </div>
            {/* State Dropdown Selector */}
            <select
              value={stateCode}
              onChange={(e) => navigate(`/state/${e.target.value.toLowerCase()}`)}
              className="text-sm px-3 py-1.5 rounded-lg bg-white/10 text-white border border-white/30 backdrop-blur-sm focus:ring-2 focus:ring-[#6EBE44] outline-none"
            >
              <option value="" disabled className="text-gray-800">Jump to state...</option>
              {Object.entries(stateNames).map(([c, name]) => (
                <option key={c} value={c} className="text-gray-800">{name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <img
              src={`https://flagcdn.com/w80/us-${stateCode.toLowerCase()}.png`}
              alt={`${stateName} state flag`}
              className="h-10 w-auto rounded shadow-md border border-white/20"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Christian Schools in {stateName}
            </h1>
          </div>
          <p className="text-blue-200">
            Find faith-based schools, homeschool resources, and education information for {stateName}.
          </p>
        </div>
      </section>

      {/* School Choice Programs Banner */}
      {(() => {
        const programs = getProgramsByState(stateName);
        const highPriority = programs.filter(p => p.priority === 'High' && p.type !== 'None');
        return highPriority.length > 0 ? (
          <div className="bg-[#6EBE44] border-b border-[#5aa838]">
            <div className="container py-3">
              <h3 className="text-white font-bold text-sm mb-2">School Choice Programs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {highPriority.slice(0, 4).map((prog, idx) => (
                  <a key={idx} href={prog.link} target="_blank" rel="noopener noreferrer" className="bg-[#1e40af] hover:bg-[#1e3a8a] rounded-lg p-3 transition-all group">
                    <p className="text-white font-semibold text-xs group-hover:underline line-clamp-2">{prog.programName}</p>
                    <p className="text-blue-100 text-xs mt-1 line-clamp-1">{prog.type}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {/* State Quick Facts */}
      {funFacts && (
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Population */}
              <div className="flex flex-col items-center text-center bg-[#F5F5F7] rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 mb-2">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="popGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#0055A4',stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#003d7a',stopOpacity:1}} />
                      </linearGradient>
                    </defs>
                    <circle cx="8" cy="7" r="3" fill="url(#popGrad)" opacity="0.9" />
                    <path d="M8 11c-2.2 0-4 1.3-4 3v2h8v-2c0-1.7-1.8-3-4-3z" fill="url(#popGrad)" opacity="0.8" />
                    <circle cx="16" cy="8" r="2.5" fill="url(#popGrad)" opacity="0.7" />
                    <path d="M16 11.5c-1.8 0-3.2 1-3.2 2.3v1.7h6.4v-1.7c0-1.3-1.4-2.3-3.2-2.3z" fill="url(#popGrad)" opacity="0.6" />
                  </svg>
                </div>
                <p className="text-[10px] text-[#6e6e73] font-semibold uppercase tracking-widest mb-1">Population</p>
                <p className="text-2xl font-bold text-[#002855]">{funFacts.population}</p>
              </div>
              {/* Christian Schools */}
              <div className="flex flex-col items-center text-center bg-[#F5F5F7] rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 mb-2">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="schoolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#6EBE44',stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#5aa838',stopOpacity:1}} />
                      </linearGradient>
                    </defs>
                    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="url(#schoolGrad)" opacity="0.9" />
                    <path d="M10 15l-3-3 1.4-1.4L10 12.2l5.6-5.6L17 8l-7 7z" fill="white" opacity="0.8" />
                  </svg>
                </div>
                <p className="text-[10px] text-[#6e6e73] font-semibold uppercase tracking-widest mb-1">Chr. Schools</p>
                <p className="text-2xl font-bold text-[#6EBE44]">{schoolCount === null ? '—' : schoolCount.toLocaleString()}</p>
              </div>
              {/* Capital */}
              {stateDetails[stateCode] && (
                <div className="flex flex-col items-center text-center bg-[#F5F5F7] rounded-2xl p-4 border border-gray-100">
                  <div className="w-10 h-10 mb-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <defs>
                        <linearGradient id="buildGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor:'#002855',stopOpacity:1}} />
                          <stop offset="100%" style={{stopColor:'#0055A4',stopOpacity:1}} />
                        </linearGradient>
                      </defs>
                      <path d="M5 3h14v18H5V3z" fill="url(#buildGrad)" opacity="0.9" />
                      <rect x="7" y="5" width="3" height="3" fill="white" opacity="0.6" />
                      <rect x="14" y="5" width="3" height="3" fill="white" opacity="0.6" />
                      <rect x="7" y="10" width="3" height="3" fill="white" opacity="0.5" />
                      <rect x="14" y="10" width="3" height="3" fill="white" opacity="0.5" />
                      <path d="M12 2l3 2h-6l3-2z" fill="url(#buildGrad)" opacity="0.8" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-[#6e6e73] font-semibold uppercase tracking-widest mb-1">Capital</p>
                  <p className="text-sm font-bold text-[#002855] leading-tight">{stateDetails[stateCode].capital}</p>
                </div>
              )}
              {/* State Bird */}
              {stateDetails[stateCode] && (
                <div className="flex flex-col items-center text-center bg-[#F5F5F7] rounded-2xl p-4 border border-gray-100">
                  <div className="w-10 h-10 mb-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <defs>
                        <linearGradient id="birdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor:'#FFC72C',stopOpacity:1}} />
                          <stop offset="100%" style={{stopColor:'#FFB800',stopOpacity:1}} />
                        </linearGradient>
                      </defs>
                      <ellipse cx="12" cy="14" rx="6" ry="5" fill="url(#birdGrad)" opacity="0.9" />
                      <circle cx="14" cy="11" r="3.5" fill="url(#birdGrad)" opacity="0.85" />
                      <path d="M16 10l4-2" stroke="url(#birdGrad)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M8 16l-3 3" stroke="url(#birdGrad)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M16 16l3 3" stroke="url(#birdGrad)" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="15" cy="10" r="1" fill="white" opacity="0.8" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-[#6e6e73] font-semibold uppercase tracking-widest mb-1">State Bird</p>
                  <p className="text-sm font-bold text-[#002855] leading-tight">{stateDetails[stateCode].bird}</p>
                </div>
              )}
              {/* Statehood Year */}
              {stateDetails[stateCode] && (
                <div className="flex flex-col items-center text-center bg-[#F5F5F7] rounded-2xl p-4 border border-gray-100">
                  <div className="w-10 h-10 mb-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <defs>
                        <linearGradient id="statehoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{stopColor:'#0055A4',stopOpacity:1}} />
                          <stop offset="100%" style={{stopColor:'#003d7a',stopOpacity:1}} />
                        </linearGradient>
                      </defs>
                      {/* Flag icon representing statehood */}
                      <path d="M5 3v18" stroke="url(#statehoodGrad)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M5 4h12l-3 3.5L17 11H5" fill="url(#statehoodGrad)" opacity="0.85" />
                      <circle cx="5" cy="21" r="1" fill="url(#statehoodGrad)" opacity="0.5" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-[#6e6e73] font-semibold uppercase tracking-widest mb-1">Statehood</p>
                  <p className="text-2xl font-bold text-[#002855]">{stateDetails[stateCode].yearAdmitted}</p>
                </div>
              )}
              {/* State Motto */}
              <div className="flex flex-col items-center text-center bg-[#F5F5F7] rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 mb-2">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="mottoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#6EBE44',stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#5aa838',stopOpacity:1}} />
                      </linearGradient>
                    </defs>
                    <path d="M3 5h18v14H3V5z" fill="url(#mottoGrad)" opacity="0.15" stroke="url(#mottoGrad)" strokeWidth="1.5" />
                    <path d="M6 8h12M6 12h10M6 16h8" stroke="url(#mottoGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                    <path d="M5 3l3-1 3 1 3-1 3 1 3-1" stroke="url(#mottoGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  </svg>
                </div>
                <p className="text-[10px] text-[#6e6e73] font-semibold uppercase tracking-widest mb-1">State Motto</p>
                <p className="text-xs font-semibold text-[#002855] text-center leading-snug italic">"{funFacts.motto}"</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="flex-1 bg-gray-50 py-8">
        <div className="container">
          {/* School Listings FIRST (per requirements) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#002855]">
                Schools in {stateName} ({filteredSchools?.length || 0})
              </h2>
              <Link href={`/search?state=${stateCode}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>

            {/* City search filter */}
            <div className="mb-4 flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by city..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#0055A4]/30"
                />
              </div>
              {cityFilter && <button onClick={() => setCityFilter("")} className="text-xs text-gray-500 hover:text-[#0055A4]">Clear</button>}
              {cityFilter && <span className="text-xs text-gray-400">Showing schools in "{cityFilter}"</span>}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredSchools && filteredSchools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSchools.map(school => (
                  <Link key={school.id} href={`/school/${school.slug}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-[#0055A4]/20 transition-all h-full group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-9 h-9 rounded-lg bg-[#0055A4]/10 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-[#0055A4]" />
                        </div>
                        <div className="flex items-center gap-1">
                          {school.listingStatus === 'verified' && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#6EBE44] text-white">✓</span>}
                          {school.listingStatus === 'pending' && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">P</span>}
                          {!!school.isPremium && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFC72C]/20 text-[#002855]">Premium</span>}
                        </div>
                      </div>
                      <div className="mb-1">
                        <h3 className="font-semibold text-[#002855] text-sm group-hover:text-[#0055A4] transition-colors">{school.name}</h3>
                        {school.denomination && <p className="text-[10px] text-[#0055A4] font-medium">{school.denomination}</p>}
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {school.city}, {school.state}
                      </p>
                      <div className="flex gap-1.5 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          Grades {school.gradeStart}–{school.gradeEnd}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#6EBE44]/10 text-[#5aa838] capitalize">
                          {school.programType?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs font-bold text-white bg-[#0055A4] group-hover:bg-[#002855] px-4 py-1.5 rounded-full transition inline-block">Learn More</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No schools listed in {stateName} yet.</p>
                <p className="text-xs text-gray-500 mt-1">Know a school? Help us grow our directory!</p>
                <Link href="/membership">
                  <Button size="sm" className="mt-3 bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0 text-xs">
                    List a School
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* State Info Cards */}
          {info && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#002855] mb-4">Christian Education in {stateName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <Scale className="w-6 h-6 text-[#0055A4] mb-2" />
                  <h3 className="text-sm font-semibold text-[#002855] mb-1">Homeschool Laws</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{info.homeschoolLaw}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <Award className="w-6 h-6 text-[#6EBE44] mb-2" />
                  <h3 className="text-sm font-semibold text-[#002855] mb-1">Scholarships & Vouchers</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{info.scholarships}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <BookOpen className="w-6 h-6 text-[#FFC72C] mb-2" />
                  <h3 className="text-sm font-semibold text-[#002855] mb-1">Regulation Level</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{info.regulation}</p>
                </div>
              </div>
            </div>
          )}

          {/* If no info available, show generic message */}
          {!info && (
            <div className="mb-8 bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-[#002855] mb-2">Christian Education in {stateName}</h2>
              <p className="text-sm text-gray-600">
                Detailed information about homeschool laws, scholarships, and regulations for {stateName} is being compiled. 
                Check back soon for comprehensive state-specific resources.
              </p>
            </div>
          )}

          {/* Resources for this state */}
          {resourceData?.resources && resourceData.resources.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#002855] mb-4">Resources in {stateName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resourceData.resources.map(resource => (
                  <div key={resource.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#6EBE44]/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-[#6EBE44]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[#002855]">{resource.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{resource.description}</p>
                      {resource.website && (
                        <a href={resource.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#0055A4] hover:underline mt-1">
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events in State */}
          {eventData?.events && eventData.events.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#002855] mb-4">Upcoming Events in {stateName}</h2>
              <div className="space-y-3">
                {eventData.events.map(event => (
                  <div key={event.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#6EBE44]/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-[#6EBE44]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#002855]">{event.title}</h4>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                    {event.website && (
                      <a href={event.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="text-xs">Details</Button>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#002855] to-[#0055A4] rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Know a Christian School in {stateName}?</h3>
            <p className="text-blue-200 text-sm mb-4">Help families find faith-based education. List your school today.</p>
            <Link href="/membership">
              <Button className="bg-[#6EBE44] hover:bg-[#5aa838] text-white border-0">
                List Your School
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <InviteSchoolCard state={stateName} stateCode={stateCode} />
        </div>
      </section>

      
      {/* Data Notice Modal */}
      <Dialog open={showDataNotice} onOpenChange={setShowDataNotice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Notice</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700 leading-relaxed">
            Some information on this page is sourced from publicly available records and may be subject to change. Always validate homeschool laws, scholarship eligibility, and school details directly with your state's Department of Education for the most current information.
          </p>
        </DialogContent>
      </Dialog>

      {/* Info Button */}
      <div className="container py-4 flex justify-center">
        <button onClick={() => setShowDataNotice(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <AlertCircle className="w-4 h-4 text-gray-600" />
          <span className="text-xs text-gray-700 font-medium">Data Notice</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
