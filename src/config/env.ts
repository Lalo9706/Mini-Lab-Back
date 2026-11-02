import "dotenv/config";

const port = Number(process.env.PORT ?? 3000);
const databaseUrl = process.env.DATABASE_URL?.trim();
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!jwtAccessSecret || Buffer.byteLength(jwtAccessSecret, "utf8") < 32) {
  throw new Error("JWT_ACCESS_SECRET debe contener al menos 32 bytes.");
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("La variable PORT debe ser un puerto válido.");
}

if (!databaseUrl) {
  throw new Error("La variable DATABASE_URL es obligatoria.");
}

let databaseProtocol: string;

try {
  databaseProtocol = new URL(databaseUrl).protocol;
} catch {
  throw new Error("La variable DATABASE_URL no tiene un formato válido.");
}

if (!["postgres:", "postgresql:"].includes(databaseProtocol)) {
  throw new Error("DATABASE_URL debe utilizar el protocolo PostgreSQL.");
}

const databaseSsl = process.env.DB_SSL === "true";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port,
  databaseUrl,
  databaseSsl,
  jwtAccessSecret,
  jwtIssuer: "mini-lab-back",
  jwtAudience: "mini-lab-clients",
};
