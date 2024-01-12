import { migrate } from "postgres-migrations";
import { Client } from "pg";

let connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:docker@localhost:5432/postgres";

async function migrateScript() {
  const client = new Client({
    connectionString,
  });
  await client.connect();
  try {
    await migrate({ client }, "init_scripts\\");
  } finally {
    await client.end();
  }
}

migrateScript();
