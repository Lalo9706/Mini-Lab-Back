import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env.js";

const secret = new TextEncoder().encode(env.jwtAccessSecret);

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

export async function createAccessToken(employeeId: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(String(employeeId))
    .setIssuer(env.jwtIssuer)
    .setAudience(env.jwtAudience)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifyAccessToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    });

    const employeeId = Number(payload.sub);

    if (!Number.isSafeInteger(employeeId) || employeeId <= 0) {
      return null;
    }

    return employeeId;
  } catch {
    return null;
  }
}
