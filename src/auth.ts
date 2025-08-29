import { compare, hash } from "bcrypt";
import { Request } from "express";
import { UnauthorizedError } from "./errors/UnauthorizedError.js";
import { randomBytes } from "crypto";
import { findRefreshTokenBy } from "./db/queries/refreshTokens.js";

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, 10);
};

export const checkPasswordHash = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return compare(password, hash);
};

export const getBearerToken = (req: Request) => {
  const rawToken = req.get("Authorization");

  if (rawToken === undefined) {
    throw new UnauthorizedError("Invalid JWT");
  }

  const splittedToken = rawToken.split(" ");

  if (splittedToken.length < 2 || splittedToken[0] !== "Bearer") {
    throw new UnauthorizedError("Invalid JWT");
  }

  return splittedToken[1];
};

export const getAPIKey = (req: Request) => {
  const rawKey = req.get("Authorization");

  if (rawKey === undefined) {
    throw new UnauthorizedError("Invalid JWT");
  }

  const splittedToken = rawKey.split(" ");

  if (splittedToken.length < 2 || splittedToken[0] !== "ApiKey") {
    throw new UnauthorizedError("Invalid ApiKey");
  }

  return splittedToken[1];
};

export const makeRefreshToken = (): string => {
  return randomBytes(32).toString("hex");
};

export const validateToken = async (req: Request): Promise<string> => {
  const token = getBearerToken(req);
  const foundRefreshToken = await findRefreshTokenBy("token", token);

  if (foundRefreshToken === undefined) {
    throw new UnauthorizedError("Invalid Token");
  }

  if (
    foundRefreshToken.revokedAt !== null ||
    foundRefreshToken.expiresAt < new Date()
  ) {
    throw new UnauthorizedError("Invalid Token");
  }

  return foundRefreshToken.userId;
};
