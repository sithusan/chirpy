import { MigrationConfig } from "drizzle-orm/migrator";
import { loadEnvFile } from "node:process";

loadEnvFile();

const envOrThrow = (key: string): string => {
  const env = process.env[key];

  if (env === undefined) {
    throw new Error(`ENV value not found: key-${key}`);
  }

  return env;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  fileServerHits: number;
  port: number;
  secret: string;
};

export const config: Config = {
  api: {
    fileServerHits: 0,
    port: Number(envOrThrow("PORT")),
    secret: envOrThrow("API_SECRET"),
  },
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: {
      migrationsFolder: "src/db/dist",
    },
  },
};
