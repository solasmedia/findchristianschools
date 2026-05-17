import bcryptjs from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const SALT_ROUNDS = 10;

async function seedAdmin() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  try {
    const email = "office@findchristianschools.com";
    const password = "Eire1982!";
    const passwordHash = await bcryptjs.hash(password, SALT_ROUNDS);

    // Using raw SQL since we don't have schema imported in .mjs
    await connection.execute(
      "INSERT INTO admin_users (email, passwordHash, name, isActive) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE passwordHash = ?",
      [email, passwordHash, "Admin", true, passwordHash]
    );

    console.log(`✓ Admin user created: ${email}`);
    console.log(`✓ Password: ${password}`);
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedAdmin();
