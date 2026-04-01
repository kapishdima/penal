import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/auth-schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "./drizzle",
});
