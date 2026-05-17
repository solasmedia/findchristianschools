import { getDb } from "../db";
import { schools } from "../../drizzle/schema";

const states = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' },
];

async function createMockSchools() {
  const db = await getDb();
  if (!db) {
    console.error('Failed to connect to database');
    process.exit(1);
  }
  
  console.log('Wiping existing schools...');
  await db.delete(schools);
  
  console.log('Creating mock schools for all 50 states...');
  
  for (const state of states) {
    try {
      await db.insert(schools).values({
      name: `${state.name} Christian Academy - Example`,
      slug: `${state.code.toLowerCase()}-christian-academy-example`,
      city: 'Melbourne',
      state: state.name,
      stateCode: state.code,
      zip: '32909',
      address: '123 Faith Lane, Melbourne, FL 32909',
      phone: '(321) 555-0100',
      website: 'https://example-school.com',
      email: 'info@example-school.com',
      description: 'This is an example of what a Christian school listing looks like on Find Christian Schools. Your school could be listed here with full details, photos, and contact information.',
      missionStatement: 'To provide Christ-centered education that develops the whole child - spiritually, academically, and socially.',
      logoUrl: '/manus-storage/school-logo-example.png',
      coverImageUrl: '/manus-storage/classroom-example.jpg',
      galleryImages: JSON.stringify([
        '/manus-storage/classroom-example.jpg',
        '/manus-storage/students-example.jpg',
        '/manus-storage/chapel-example.jpg'
      ]),
      gradeStart: 'K',
      gradeEnd: '12',
      programType: 'traditional',
      tuitionType: 'tuition_based',
      tuitionMin: 5000,
      tuitionMax: 15000,
      enrollment: 450,
      studentTeacherRatio: '12:1',
      yearFounded: 2000,
      denomination: 'Non-denominational',
      accreditation: 'ACSI, AdvancED',
      statementOfFaith: 'We believe in the authority of Scripture, the Trinity, salvation through Christ, and the Great Commission.',
      hasTransportation: true,
      hasLunchProgram: true,
      hasAfterSchool: true,
      hasSpecialNeeds: false,
      hasSports: true,
      hasArts: true,
      hasSTEM: true,
      uniformRequired: false,
      acceptsVouchers: true,
      sportsOffered: 'Basketball, Soccer, Volleyball, Baseball, Softball, Tennis',
      extracurriculars: 'Debate Team, Robotics Club, Drama Club, Worship Band, Mission Trips',
      contactName: 'Sarah Johnson',
      contactTitle: 'Admissions Director',
      contactPhone: '(321) 555-0100',
      contactEmail: 'admissions@example-school.com',
      isPremium: true,
      isApproved: true,
      featured: true,
      latitude: '28.1025',
      longitude: '-80.6050',
      promoCode: 'FOUNDER50',
      promoDiscountPercent: 50,
      } as any);
      console.log(`✓ Created mock school for ${state.name}`);
    } catch (err) {
      console.error(`✗ Error creating mock school for ${state.name}:`, err);
    }
  }
  
  console.log('✓ All mock schools created successfully!');
  process.exit(0);
}

createMockSchools().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
