import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/db",
  out: "src/db/dist",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://sithusan:@localhost:5432/chirpy?sslmode=disable",
  },
});
