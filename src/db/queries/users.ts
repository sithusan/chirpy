import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, User, users } from "../schema.js";

export const createUser = async (user: NewUser): Promise<User> => {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
};

export const findUserBy = async (id: string): Promise<User | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const truncateUsers = async (): Promise<void> => {
  await db.execute("TRUNCATE TABLE users CASCADE;");
};
