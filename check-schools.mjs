import { createConnection } from "mysql2/promise";

const conn = await createConnection({
  host: process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: "findchristianschools",
});

try {
  const [result] = await conn.execute("SELECT COUNT(*) as total FROM schools");
  console.log("Total schools:", result[0].total);
  
  const [byState] = await conn.execute(
    "SELECT stateCode, COUNT(*) as count FROM schools GROUP BY stateCode ORDER BY count DESC LIMIT 10"
  );
  console.log("\nTop 10 states by school count:");
  byState.forEach(row => console.log(`  ${row.stateCode}: ${row.count}`));
} catch (e) {
  console.log("Database query failed - trying alternative method");
  console.log("Error:", e.message);
} finally {
  await conn.end();
}
