import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.js";
import { createUser } from "../db/queries/users.js";

export const handlerCreateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  type parameter = {
    email: string;
  };

  const params: parameter = req.body;

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

  const user = await createUser({
    email: params.email,
  });

  res.status(201);
  res.json(user);
};
