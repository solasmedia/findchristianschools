import { searchSchools } from "./server/db";

try {
  const result = await searchSchools({ limit: 10, offset: 0 });
  console.log('Search result:', result.total, 'schools found');
  if (result.schools.length > 0) {
    console.log('Sample:', result.schools[0].name);
  }
} catch (e: any) {
  console.error('Search error:', e.message, e.stack);
}
