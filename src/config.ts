import { loadEnvFile } from "node:process";

loadEnvFile();

const envOrThrow = (key: string): string => {
  const env = process.env[key];

  if (env === undefined) {
    throw new Error(`ENV value not found: key-${key}`);
  }

  return env;
};

type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

export const config: APIConfig = {
  dbURL: envOrThrow("DB_URL"),
  fileserverHits: 0,
};
