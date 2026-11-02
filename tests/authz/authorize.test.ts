import express, { type Express, type RequestHandler } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { authorize } from "../../src/shared/authz/authorize.middleware.js";
import { PERMISSIONS } from "../../src/shared/authz/permissions.js";
import { ROLES, roleFromDatabaseName, type Role } from "../../src/shared/authz/roles.js";

function createTestApp(role?: Role): Express {
  const app = express();

  // Solo para pruebas. No representa autenticación real.
  const testIdentity: RequestHandler = (req, _res, next) => {
    if (role) {
      req.auth = {
        employeeId: 999,
        role,
      };
    }

    next();
  };

  app.use(testIdentity);

  app.get("/patients", authorize(PERMISSIONS.PATIENTS_READ), (_req, res) =>
    res.status(200).json({ success: true }),
  );

  app.post("/receipts", authorize(PERMISSIONS.RECEIPTS_CREATE), (_req, res) =>
    res.status(201).json({ success: true }),
  );

  app.post("/results", authorize(PERMISSIONS.LABORATORY_RESULTS_CAPTURE), (_req, res) =>
    res.status(200).json({ success: true }),
  );

  app.post("/results/validate", authorize(PERMISSIONS.LABORATORY_RESULTS_VALIDATE), (_req, res) =>
    res.status(200).json({ success: true }),
  );

  app.get("/results/pdf", authorize(PERMISSIONS.LABORATORY_REPORTS_PRINT), (_req, res) =>
    res.status(200).json({ success: true }),
  );

  app.post("/inventory/wastage", authorize(PERMISSIONS.INVENTORY_WASTAGE_CORRECT), (_req, res) =>
    res.status(200).json({ success: true }),
  );

  app.post("/employees", authorize(PERMISSIONS.EMPLOYEES_MANAGE), (_req, res) =>
    res.status(200).json({ success: true }),
  );

  return app;
}

describe("authorize middleware", () => {
  it("devuelve 401 cuando no existe una identidad autenticada", async () => {
    const response = await request(createTestApp()).get("/patients");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHENTICATED");
  });

  it("permite al recepcionista consultar pacientes", async () => {
    const response = await request(createTestApp(ROLES.RECEPCIONISTA)).get("/patients");

    expect(response.status).toBe(200);
  });

  it("permite al recepcionista crear recibos", async () => {
    const response = await request(createTestApp(ROLES.RECEPCIONISTA)).post("/receipts");

    expect(response.status).toBe(201);
  });

  it("deniega al recepcionista la captura de resultados", async () => {
    const response = await request(createTestApp(ROLES.RECEPCIONISTA)).post("/results");

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  it("permite al químico técnico capturar resultados", async () => {
    const response = await request(createTestApp(ROLES.QUIMICO_TECNICO)).post("/results");

    expect(response.status).toBe(200);
  });

  it("impide al químico técnico validar resultados", async () => {
    const response = await request(createTestApp(ROLES.QUIMICO_TECNICO)).post("/results/validate");

    expect(response.status).toBe(403);
  });

  it("permite al químico analista validar resultados", async () => {
    const response = await request(createTestApp(ROLES.QUIMICO_ANALISTA)).post("/results/validate");

    expect(response.status).toBe(200);
  });

  it("permite al químico analista acceder a la operación de reportes PDF", async () => {
    const response = await request(createTestApp(ROLES.QUIMICO_ANALISTA)).get("/results/pdf");

    expect(response.status).toBe(200);
  });

  it("permite al responsable sanitario corregir mermas", async () => {
    const response = await request(createTestApp(ROLES.RESPONSABLE_SANITARIO)).post(
      "/inventory/wastage",
    );

    expect(response.status).toBe(200);
  });

  it("deniega al químico técnico la corrección posterior de mermas", async () => {
    const response = await request(createTestApp(ROLES.QUIMICO_TECNICO)).post("/inventory/wastage");

    expect(response.status).toBe(403);
  });

  it("permite al responsable sanitario gestionar empleados", async () => {
    const response = await request(createTestApp(ROLES.RESPONSABLE_SANITARIO)).post("/employees");

    expect(response.status).toBe(200);
  });

  it("deniega al recepcionista la gestión de empleados", async () => {
    const response = await request(createTestApp(ROLES.RECEPCIONISTA)).post("/employees");

    expect(response.status).toBe(403);
  });
});

describe("roleFromDatabaseName", () => {
  it("convierte un nombre de rol conocido", () => {
    expect(roleFromDatabaseName("Químico Analista")).toBe(ROLES.QUIMICO_ANALISTA);
  });

  it("rechaza un nombre de rol desconocido", () => {
    expect(roleFromDatabaseName("Super Administrador")).toBeNull();
  });
});
