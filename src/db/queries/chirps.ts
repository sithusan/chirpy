import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, Chirp, chirps } from "../schema.js";

export const createChirp = async (Chirp: NewChirp): Promise<Chirp> => {
  const [result] = await db
    .insert(chirps)
    .values(Chirp)
    .onConflictDoNothing()
    .returning();

  return result;
};

export const getChirps = async (): Promise<Chirp[]> => {
  return db.query.chirps.findMany({
    orderBy: chirps.createdAt,
  });
};

export const findChirpBy = async (id: string): Promise<Chirp | undefined> => {
  return db.query.chirps.findFirst({
    where: eq(chirps.id, id),
  });
};
