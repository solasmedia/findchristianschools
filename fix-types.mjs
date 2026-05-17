import fs from 'fs';

let content = fs.readFileSync('./server/db.ts', 'utf-8');

// Fix the type casting
content = content.replace(
  'const [results] = await db.execute(',
  'const [results] = await db.execute('
);

content = content.replace(
  ') as any;',
  ') as any;'
);

// Add type assertions
content = content.replace(
  'return { schools: results, total, stateCounts };',
  'return { schools: results as any[], total, stateCounts };'
);

fs.writeFileSync('./server/db.ts', content);
console.log('Fixed types');
