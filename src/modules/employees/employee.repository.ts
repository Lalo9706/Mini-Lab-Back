import type { QueryResultRow } from "pg";
import { postgresPool } from "../../infrastructure/database/postgres.pool.js";

export interface EmployeeAuthRecord {
  employeeId: number;
  fullName: string;
  username: string;
  passwordHash: string;
  isActive: boolean;
  roleName: string;
}

export interface EmployeeAuthContext {
  employeeId: number;
  roleName: string;
}

interface EmployeeAuthRow extends QueryResultRow, EmployeeAuthRecord {}

interface EmployeeContextRow extends QueryResultRow, EmployeeAuthContext {}

export class EmployeeRepository {
  async findForAuthentication(username: string): Promise<EmployeeAuthRecord | null> {
    const result = await postgresPool.query<EmployeeAuthRow>(
      `
      SELECT
        e.id_empleado AS "employeeId",
        e.nombre_completo AS "fullName",
        e.usuario AS "username",
        e.contrasenia AS "passwordHash",
        e.activo AS "isActive",
        te.nombre_rol AS "roleName"
      FROM empleado e
      INNER JOIN tipo_empleado te
        ON te.id_tipo_empleado = e.id_tipo_empleado_fk
      WHERE e.usuario = $1
      LIMIT 1
      `,
      [username],
    );

    return result.rows[0] ?? null;
  }

  async findActiveContextById(employeeId: number): Promise<EmployeeAuthContext | null> {
    const result = await postgresPool.query<EmployeeContextRow>(
      `
      SELECT
        e.id_empleado AS "employeeId",
        te.nombre_rol AS "roleName"
      FROM empleado e
      INNER JOIN tipo_empleado te
        ON te.id_tipo_empleado = e.id_tipo_empleado_fk
      WHERE e.id_empleado = $1
        AND e.activo = TRUE
      LIMIT 1
      `,
      [employeeId],
    );

    return result.rows[0] ?? null;
  }
}

export const employeeRepository = new EmployeeRepository();
