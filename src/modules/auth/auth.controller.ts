import type { RequestHandler } from "express";
import { z } from "zod";
import { authService } from "./auth.service.js";

const loginSchema = z
  .object({
    username: z.string().trim().min(1).max(50),
    password: z.string().min(1).max(128),
  })
  .strict();

export const login: RequestHandler = async (req, res, next) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Los datos enviados no son válidos.",
        details: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });

    return;
  }

  try {
    const result = await authService.login(validation.data.username, validation.data.password);

    if (!result) {
      res.status(401).json({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Usuario o contraseña incorrectos.",
        },
      });

      return;
    }

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = (req, res) => {
  if (!req.auth) {
    res.status(401).json({
      error: {
        code: "UNAUTHENTICATED",
        message: "Se requiere autenticación.",
      },
    });

    return;
  }

  res.status(200).json({
    data: {
      employeeId: req.auth.employeeId,
      role: req.auth.role,
    },
  });
};
