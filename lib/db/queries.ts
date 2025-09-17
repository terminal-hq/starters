import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const client = postgres(process.env.POSTGRES_URL!);
// Pass every table export from schema.ts automatically
export const db = drizzle(client, { schema });
