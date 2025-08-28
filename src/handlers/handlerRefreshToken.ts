import { Request, Response } from "express";
import { getBearerToken, validateToken } from "./../auth.js";
import {
  findRefreshTokenBy,
  revokenToken,
} from "./../db/queries/refreshTokens.js";
import { UnauthorizedError } from "./../errors/UnauthorizedError.js";
import { makeJWT } from "./../jwt.js";
import { config } from "./../config.js";

export const handlerRefreshToken = async (req: Request, res: Response) => {
  const userId = await validateToken(req);

  const JWTExp = 60 * 60; // 1h
  const token = makeJWT(userId, JWTExp, config.api.secret);

  //   const refreshToken = makeRefreshToken();
  //   const refreshTokenExpDate = new Date();
  //   refreshTokenExpDate.setTime(refreshTokenExpDate.getTime() + 60 * 60 * 1000); // 1h.

  //   await createRefreshToken({
  //     token: refreshToken,
  //     userId: userId,
  //     expiresAt: refreshTokenExpDate,
  //     revokedAt: null,
  //   });

  res.status(200);
  res.json({
    token: token,
  });
};

export const handlerRevokeToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = getBearerToken(req);
  const foundRefreshToken = await findRefreshTokenBy("token", token);

  if (foundRefreshToken === undefined) {
    throw new UnauthorizedError("Invalid Token");
  }

  await revokenToken(token);

  res.status(204);
  res.json();
};
