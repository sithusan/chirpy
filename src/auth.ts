import { compare, hash } from "bcrypt";
import { Request } from "express";
import { UnauthorizedError } from "./errors/UnauthorizedError.js";

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

  const [_, token] = rawToken.split(" ");

  return token;
};
