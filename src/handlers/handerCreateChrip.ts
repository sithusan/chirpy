import { Request, Response } from "express";
import { BadRequestError } from "./../errors/BadRequestError.js";
import { findUserBy } from "./../db/queries/users.js";
import { NotFoundError } from "./../errors/NotFoundError.js";
import { createChrip } from "./../db/queries/chrips.js";

const replaceProfanes = (text: string): string => {
  const profanes = ["kerfuffle", "sharbert", "fornax"];

  const splitted = text.split(" ");
  const lowered = splitted.map((word) => word.toLocaleLowerCase());

  for (let i = 0; i < lowered.length; i++) {
    if (profanes.includes(lowered[i])) {
      splitted[i] = "****";
    }
  }

  return splitted.join(" ");
};

export const handlerCreateChrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  type parameter = {
    body: string;
    userId: string;
  };

  const params: parameter = req.body;

  if (params === undefined) {
    throw new BadRequestError("body is required");
  }

  if (params.body === undefined) {
    throw new BadRequestError("body is required");
  }

  if (params.body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  if (params.userId === undefined) {
    throw new BadRequestError("user id is required");
  }

  const user = await findUserBy(params.userId);

  if (user === undefined) {
    throw new NotFoundError("user not found");
  }

  const chrip = await createChrip({
    body: replaceProfanes(params.body),
    userId: params.userId,
  });

  res.status(201);
  res.json(chrip);
};
