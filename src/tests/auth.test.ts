import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./../jwt";
import { checkPasswordHash, hashPassword } from "src/auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result1 = await checkPasswordHash(password1, hash1);
    const result2 = await checkPasswordHash(password2, hash2);
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });
});

describe("JWT Making", () => {
  const userID = "cc6f1971-5edf-40c1-97b1-89a9d8844754";
  const secret = "some_secret";
  let jwt1: string;
  let jwt2: string;

  beforeAll(async () => {
    jwt1 = makeJWT(userID, 3, secret);
    jwt2 = makeJWT(userID, 1, secret);
  });

  it("should return user id", () => {
    const result1 = validateJWT(jwt1, secret);
    expect(result1).toBe(userID);
  });

  it("should unauthorize with invalid token", () => {
    expect(() => validateJWT("invalid_token", secret)).toThrow(/Invalid JWT/);
  });

  it("should unauthorize with invalid secret", () => {
    expect(() => validateJWT(jwt1, "invalid_secret")).toThrow(/Invalid JWT/);
  });

  it("should unauthorized after exprire", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1100));
    expect(() => validateJWT(jwt2, secret)).toThrow(/Invalid JWT/);
  });
});
