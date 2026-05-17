import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import { drizzle } from 'drizzle-orm/mysql2';

const email = 'office@findchristianschools.org';
const password = 'Daith1982!';

async function setupAdmin() {
  try {
    console.log('🔐 Setting up admin account...');
    console.log('Email:', email);
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    console.log('✓ Connected to database');
    console.log('Database URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':***@'));

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id FROM admin_users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('⚠️  Admin user already exists with ID:', existing[0].id);
      await connection.end();
      return;
    }

    // Hash password
    const hash = await bcryptjs.hash(password, 10);
    console.log('✓ Password hashed');

    // Create admin user
    const [result] = await connection.execute(
      'INSERT INTO admin_users (email, passwordHash, name, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [email, hash, 'Admin', true]
    );

    console.log('✓ Admin user created with ID:', result.insertId);
    console.log('');
    console.log('✅ Admin Login Credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('');
    console.log('You can now log in at: https://findchristianschools.org/admin-login');

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Make sure the database is running.');
    }
    console.error('Full error:', error);
    process.exit(1);
  }
}

setupAdmin();
