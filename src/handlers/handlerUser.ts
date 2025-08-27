import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.js";
import { createUser, findUserBy } from "../db/queries/users.js";
import { checkPasswordHash, hashPassword } from "./../auth.js";
import { User } from "./../db/schema.js";
import { NotFoundError } from "./../errors/NotFoundError.js";
import { UnauthorizedError } from "./../errors/UnauthorizedError.js";

type UserResponse = Omit<User, "hashedPassword">;

type parameter = {
  email: string;
  password: string;
};

const validateParams = (params: parameter): void => {
  if (params === undefined) {
    throw new BadRequestError("body is required");
  }

  if (params.email === undefined) {
    throw new BadRequestError("email is required");
  }

  if (!params.email.includes("@")) {
    throw new BadRequestError("email invalid");
  }

  if (params.email.length > 250) {
    throw new Error("email too long");
  }

  if (params.password === undefined) {
    throw new BadRequestError("password is required");
  }

  if (params.password.length > 256) {
    throw new BadRequestError("password too long");
  }
};
export const handlerCreateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const params: parameter = req.body;

  validateParams(params);

  const { hashedPassword, ...safeUser } = await createUser({
    email: params.email,
    hashedPassword: await hashPassword(params.password),
  });

  const user: UserResponse = safeUser;

  res.status(201);
  res.json(user);
};

export const handlerLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const params: parameter = req.body;

  validateParams(params);

  const foundUser = await findUserBy("email", params.email);

  if (foundUser === undefined) {
    throw new NotFoundError("User Not Found");
  }

  const passwordMatch = await checkPasswordHash(
    params.password,
    foundUser.hashedPassword
  );

  if (passwordMatch === false) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const { hashedPassword, ...safeUser } = foundUser;

  const user: UserResponse = safeUser;

  res.status(200);
  res.json(user);
};
