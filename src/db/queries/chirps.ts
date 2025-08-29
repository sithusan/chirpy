import { eq, sql } from "drizzle-orm";
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

export const getChirps = async (
  authorId: string,
  sort: "asc" | "desc"
): Promise<Chirp[]> => {
  return db.query.chirps.findMany({
    orderBy: sql`${chirps.createdAt} ${sql.raw(sort)}`,
    where: authorId.length > 0 ? eq(chirps.userId, authorId) : undefined,
  });
};

export const findChirpBy = async (id: string): Promise<Chirp | undefined> => {
  return db.query.chirps.findFirst({
    where: eq(chirps.id, id),
  });
};

export const deleteChirpBy = async (id: string): Promise<void> => {
  await db.delete(chirps).where(eq(chirps.id, id));
};
