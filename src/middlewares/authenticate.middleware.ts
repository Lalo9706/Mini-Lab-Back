import type { RequestHandler } from "express";

import { verifyAccessToken } from "../shared/auth/token.service.js";
import { roleFromDatabaseName } from "../shared/authz/roles.js";

import { employeeRepository } from "../modules/employees/employee.repository.js";

export const authenticate: RequestHandler = async (req, res, next) => {
  const authorization = req.headers.authorization;

  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    res.status(401).json({
      error: {
        code: "UNAUTHENTICATED",
        message: "Se requiere un token de acceso válido.",
      },
    });

    return;
  }

  try {
    const employeeId = await verifyAccessToken(match[1]);

    if (!employeeId) {
      res.status(401).json({
        error: {
          code: "INVALID_TOKEN",
          message: "El token es inválido o ha expirado.",
        },
      });

      return;
    }

    const employee = await employeeRepository.findActiveContextById(employeeId);

    if (!employee) {
      res.status(401).json({
        error: {
          code: "INVALID_SESSION",
          message: "La sesión ya no es válida.",
        },
      });

      return;
    }

    const role = roleFromDatabaseName(employee.roleName);

    if (!role) {
      res.status(403).json({
        error: {
          code: "INVALID_ROLE",
          message: "El empleado no tiene un rol reconocido.",
        },
      });

      return;
    }

    req.auth = {
      employeeId: employee.employeeId,
      role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
