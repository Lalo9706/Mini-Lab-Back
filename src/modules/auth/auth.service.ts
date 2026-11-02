import { randomBytes } from "node:crypto";

import { employeeRepository } from "../employees/employee.repository.js";
import { hashPassword, verifyPassword } from "../../shared/security/password.service.js";

import { roleFromDatabaseName } from "../../shared/authz/roles.js";

import { ACCESS_TOKEN_TTL_SECONDS, createAccessToken } from "../../shared/auth/token.service.js";

let dummyHashPromise: Promise<string> | null = null;

async function performDummyVerification(password: string): Promise<void> {
  dummyHashPromise ??= hashPassword(randomBytes(32).toString("hex"));

  const dummyHash = await dummyHashPromise;

  await verifyPassword(dummyHash, password);
}

export class AuthService {
  async login(username: string, password: string) {
    const employee = await employeeRepository.findForAuthentication(username);

    if (!employee) {
      // Evita que un usuario desconocido tenga una respuesta
      // considerablemente más rápida que uno existente.
      await performDummyVerification(password);

      return null;
    }

    const passwordMatches = await verifyPassword(employee.passwordHash, password);

    if (!employee.isActive || !passwordMatches) {
      return null;
    }

    const role = roleFromDatabaseName(employee.roleName);

    if (!role) {
      throw new Error("El empleado tiene un rol no reconocido.");
    }

    const accessToken = await createAccessToken(employee.employeeId);

    return {
      accessToken,
      tokenType: "Bearer" as const,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,

      employee: {
        id: employee.employeeId,
        name: employee.fullName,
        username: employee.username,
        role,
      },
    };
  }
}

export const authService = new AuthService();
