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

export const findUserBy = async (
  key: keyof User,
  value: string
): Promise<User | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users[key], value),
  });
};

export const updateUser = async (
  id: string,
  user: Partial<NewUser>
): Promise<User> => {
  const [result] = await db
    .update(users)
    .set(user)
    .where(eq(users.id, id))
    .returning();

  return result;
};

export const truncateUsers = async (): Promise<void> => {
  await db.execute("TRUNCATE TABLE users CASCADE;");
};
