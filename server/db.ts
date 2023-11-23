import { Pool } from "pg";

let connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:docker@localhost:5432/postgres";

export const pool = new Pool({
  connectionString,
});
