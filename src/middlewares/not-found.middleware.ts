import type { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (_req, res) => {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "No se encontró la ruta solicitada.",
    },
  });
};
