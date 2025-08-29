import { Request, Response } from "express";
import { findUserBy, updateUser } from "./../db/queries/users.js";
import { BadRequestError } from "./../errors/BadRequestError.js";
import { NotFoundError } from "./../errors/NotFoundError.js";
import { getAPIKey } from "./../auth.js";
import { config } from "./../config.js";
import { UnauthorizedError } from "./../errors/UnauthorizedError.js";

export const handlerPolka = async (req: Request, res: Response) => {
  type parameter = {
    event: string;
    data: {
      userId: string;
    };
  };

  const apiKey = getAPIKey(req);

  if (apiKey !== config.api.polkaKey) {
    throw new UnauthorizedError("Unauthorized");
  }

  const params: parameter = req.body;

  if (params === undefined) {
    throw new BadRequestError("Body is required");
  }

  if (params.event === undefined) {
    throw new BadRequestError("Event is required");
  }

  if (params.data === undefined) {
    throw new BadRequestError("Data is required");
  }

  if (params.data.userId === undefined) {
    throw new BadRequestError("User ID is required");
  }

  if (params.event !== "user.upgraded") {
    res.status(204);
    res.json();
    return;
  }

  const user = await findUserBy("id", params.data.userId);

  if (user === undefined) {
    throw new NotFoundError("User Not Found");
  }

  await updateUser(params.data.userId, {
    isChirpyRed: true,
  });

  res.status(204);
  res.json();
};
