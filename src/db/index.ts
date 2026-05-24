import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NEXT_PHASE !== "phase-production-build") {
  console.warn("DATABASE_URL is not set. Database-backed API routes will fail until it is configured.");
}

const client = postgres(databaseUrl ?? "postgres://postgres:postgres@127.0.0.1:5432/postgres", {
  prepare: false,
  max: 10,
});

export const db = drizzle(client, { schema });
