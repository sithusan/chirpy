import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./errors/UnauthorizedError.js";

const TOKEN_ISSUER = "chirpy";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export const makeJWT = (
  userID: string,
  expiresIn: number, // in secs
  secret: string
): string => {
  const iat = Math.floor(Date.now() / 1000);

  const payload: payload = {
    iss: TOKEN_ISSUER,
    sub: userID,
    iat: iat,
    exp: iat + expiresIn,
  };

  return jwt.sign(payload, secret);
};

export const validateJWT = (tokenString: string, secret: string): string => {
  try {
    const decoded: payload = jwt.verify(tokenString, secret) as payload;

    if (decoded.sub === undefined) {
      throw new UnauthorizedError("Invalid JWT");
    }

    return decoded.sub;
  } catch (err: unknown) {
    console.log(
      `JWT parsing error: ${err instanceof Error ? err.message : err}`
    );
    throw new UnauthorizedError("Invalid JWT");
  }
};
