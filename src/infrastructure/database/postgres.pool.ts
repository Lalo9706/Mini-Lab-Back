import { Pool } from "pg";
import { env } from "../../config/env.js";

export const postgresPool = new Pool({
  connectionString: env.databaseUrl,

  max: 10,

  idleTimeoutMillis: 30_000,

  connectionTimeoutMillis: 5_000,

  ssl: env.databaseSsl ? { rejectUnauthorized: true } : false,
});

// Captura errores inesperados en conexiones inactivas.
postgresPool.on("error", (error: Error) => {
  console.error("Error inesperado en el pool de PostgreSQL:", error.message);
});

/**
 * Comprueba que PostgreSQL responda a una consulta.
 */
export async function verifyDatabaseConnection(): Promise<void> {
  await postgresPool.query("SELECT 1");
}
