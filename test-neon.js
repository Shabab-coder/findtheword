import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`SELECT word FROM words ORDER BY random() LIMIT 1`;
console.log(rows);
