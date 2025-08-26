import { db } from "../index.js";
import { NewChrip, Chrip, chirps } from "../schema.js";

export const createChrip = async (chrip: NewChrip): Promise<Chrip> => {
  const [result] = await db
    .insert(chirps)
    .values(chrip)
    .onConflictDoNothing()
    .returning();

  return result;
};
