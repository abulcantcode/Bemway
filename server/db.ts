import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost", // Docker Compose service name
  port: 5432, // PostgreSQL default port
  user: "user123", // PostgreSQL username
  password: "password123", // PostgreSQL password
  database: "db123", // PostgreSQL database name
});
