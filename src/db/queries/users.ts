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
