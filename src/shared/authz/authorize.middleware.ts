import type { RequestHandler } from "express";
import type { Permission } from "./permissions.js";
import { hasPermission } from "./role-permissions.js";

export function authorize(permission: Permission): RequestHandler {
  return (req, res, next) => {
    if (!req.auth) {
      res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",
          message: "Se requiere autenticación.",
        },
      });

      return;
    }

    if (!hasPermission(req.auth.role, permission)) {
      res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "No tienes permiso para realizar esta operación.",
        },
      });

      return;
    }

    next();
  };
}
