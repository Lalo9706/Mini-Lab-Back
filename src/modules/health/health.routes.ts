import { Router } from "express";
import { verifyDatabaseConnection } from "../../infrastructure/database/postgres.pool.js";

const router = Router();

// Comprueba que la API esté levantada.
router.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "mini-lab-back",
  });
});

// Comprueba que la API pueda trabajar con PostgreSQL.
router.get("/ready", async (_req, res) => {
  try {
    await verifyDatabaseConnection();

    res.status(200).json({
      status: "ready",
      service: "mini-lab-back",
      dependencies: {
        database: "connected",
      },
    });
  } catch {
    res.status(503).json({
      status: "not_ready",
      service: "mini-lab-back",
      dependencies: {
        database: "unavailable",
      },
    });
  }
});

export default router;
