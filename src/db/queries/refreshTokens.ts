import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, RefreshToken, refreshTokens } from "../schema.js";

export const createRefreshToken = async (
  refreshToken: NewRefreshToken
): Promise<RefreshToken> => {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .returning();

  return result;
};

export const findRefreshTokenBy = async (
  key: keyof Pick<RefreshToken, "token" | "userId">,
  value: string
): Promise<RefreshToken | undefined> => {
  return await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens[key], value),
  });
};

export const revokenToken = async (token: string) => {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(refreshTokens.token, token));
};
