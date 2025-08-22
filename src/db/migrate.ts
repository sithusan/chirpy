import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as drizzleMigrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "../config.js";

const conn = postgres(config.db.dbURL, { max: 1 });

export const migrate = () => {
  drizzleMigrate(drizzle(conn), config.db.migrationConfig);
};
