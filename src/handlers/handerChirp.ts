import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.js";
import { findUserBy } from "../db/queries/users.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import {
  createChirp,
  deleteChirpBy,
  findChirpBy,
  getChirps,
} from "../db/queries/chirps.js";
import { getBearerToken } from "./../auth.js";
import { validateJWT } from "./../jwt.js";
import { config } from "./../config.js";
import { ForbiddenError } from "./../errors/ForbiddenError.js";
import { Chirp } from "src/db/schema.js";

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

const findChirpById = async (id: string): Promise<Chirp> => {
  const chirp = await findChirpBy(id);

  if (chirp === undefined) {
    throw new NotFoundError("Chirp not found");
  }
  return chirp;
};

export const handlerGetChirps = async (
  req: Request,
  res: Response
): Promise<void> => {
  const chirps = await getChirps();

  res.status(200);
  res.json(chirps);
};

export const handlerGetChirpBy = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;

  const chirp = await findChirpById(id);

  res.status(200);
  res.json(chirp);
};

export const handlerCreateChirp = async (
  req: Request,
  res: Response
): Promise<void> => {
  type parameter = {
    body: string;
  };

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);

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

  const user = await findUserBy("id", userId);

  if (user === undefined) {
    throw new NotFoundError("user not found");
  }

  const chirp = await createChirp({
    body: replaceProfanes(params.body),
    userId: userId,
  });

  res.status(201);
  res.json(chirp);
};

export const handlerDeleteChirp = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);

  const id = req.params.id;
  const chirp = await findChirpById(id);

  if (userId !== chirp.userId) {
    throw new ForbiddenError("Forbidden to delete the chrip");
  }

  await deleteChirpBy(chirp.id);

  res.status(204);
  res.json();
};
