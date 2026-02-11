import "dotenv/config";

import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store, max-age=0");

    const sql = neon(process.env.DATABASE_URL);

    const rows = await sql`SELECT word FROM words ORDER BY random() LIMIT 1`;

    if (!rows.length) {
      return res.status(404).json({ error: "No words found" });
    }

    return res.status(200).json({ word: rows[0].word.trim().toUpperCase() });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch word" });
  }
}
