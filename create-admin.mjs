import bcryptjs from 'bcryptjs';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;

async function createAdminAccount() {
  const email = 'office@findchristianschools.org';
  const password = 'Daith1982!';
  const name = 'Office Admin';

  try {
    // Hash the password
    const passwordHash = await bcryptjs.hash(password, SALT_ROUNDS);

    // Connect to database
    console.log('Connecting to database...');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
    });

    // Check if admin already exists
    const [existing] = await connection.execute(
      'SELECT id FROM admin_users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log(`✓ Admin account already exists for ${email}`);
      await connection.end();
      return;
    }

    // Insert new admin
    console.log('Inserting admin account...');
    const [result] = await connection.execute(
      'INSERT INTO admin_users (email, passwordHash, name, isActive) VALUES (?, ?, ?, ?)',
      [email, passwordHash, name, true]
    );

    console.log(`✓ Admin account created successfully`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Admin ID: ${result.insertId}`);

    await connection.end();
  } catch (error) {
    console.error('✗ Failed to create admin account:', error);
    process.exit(1);
  }
}

createAdminAccount();
