import { postgresPool } from "../../infrastructure/database/postgres.pool.js";

import type {
  CreatePatientInput,
  Patient,
  PatientFilters,
  PatientListResult,
  PatientRepositoryPort,
  UpdatePatientInput,
} from "./patient.types.js";

interface PatientRow {
  id: number;
  fullName: string;
  birthDate: string;
  sex: Patient["sex"];
  email: string | null;
  phone: string | null;
}

export class PatientRepository implements PatientRepositoryPort {
  async findAll(filters: PatientFilters): Promise<PatientListResult> {
    const search = filters.search || null;

    const [patientsResult, countResult] = await Promise.all([
      postgresPool.query<PatientRow>(
        `
        SELECT
          id_paciente AS "id",
          nombre_completo AS "fullName",
          fecha_nacimiento AS "birthDate",
          sexo AS "sex",
          correo_electronico AS "email",
          telefono AS "phone"
        FROM paciente
        WHERE (
          $1::text IS NULL
          OR nombre_completo ILIKE '%' || $1 || '%'
        )
        ORDER BY id_paciente DESC
        LIMIT $2
        OFFSET $3
        `,
        [search, filters.limit, filters.offset],
      ),

      postgresPool.query<{ total: string }>(
        `
        SELECT COUNT(*)::text AS total
        FROM paciente
        WHERE (
          $1::text IS NULL
          OR nombre_completo ILIKE '%' || $1 || '%'
        )
        `,
        [search],
      ),
    ]);

    return {
      items: patientsResult.rows,
      total: Number(countResult.rows[0].total),
    };
  }

  async findById(id: number): Promise<Patient | null> {
    const result = await postgresPool.query<PatientRow>(
      `
      SELECT
        id_paciente AS "id",
        nombre_completo AS "fullName",
        fecha_nacimiento AS "birthDate",
        sexo AS "sex",
        correo_electronico AS "email",
        telefono AS "phone"
      FROM paciente
      WHERE id_paciente = $1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async create(data: CreatePatientInput): Promise<Patient> {
    const result = await postgresPool.query<PatientRow>(
      `
      INSERT INTO paciente (
        nombre_completo,
        fecha_nacimiento,
        sexo,
        correo_electronico,
        telefono
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id_paciente AS "id",
        nombre_completo AS "fullName",
        fecha_nacimiento AS "birthDate",
        sexo AS "sex",
        correo_electronico AS "email",
        telefono AS "phone"
      `,
      [data.fullName, data.birthDate, data.sex, data.email ?? null, data.phone ?? null],
    );

    return result.rows[0];
  }

  async update(id: number, data: UpdatePatientInput): Promise<Patient | null> {
    const columns: string[] = [];
    const values: unknown[] = [];

    const addField = (column: string, value: unknown): void => {
      values.push(value);
      columns.push(`${column} = $${values.length}`);
    };

    if (data.fullName !== undefined) {
      addField("nombre_completo", data.fullName);
    }

    if (data.birthDate !== undefined) {
      addField("fecha_nacimiento", data.birthDate);
    }

    if (data.sex !== undefined) {
      addField("sexo", data.sex);
    }

    if (data.email !== undefined) {
      addField("correo_electronico", data.email);
    }

    if (data.phone !== undefined) {
      addField("telefono", data.phone);
    }

    if (columns.length === 0) {
      return null;
    }

    values.push(id);

    const result = await postgresPool.query<PatientRow>(
      `
      UPDATE paciente
      SET ${columns.join(", ")}
      WHERE id_paciente = $${values.length}
      RETURNING
        id_paciente AS "id",
        nombre_completo AS "fullName",
        fecha_nacimiento AS "birthDate",
        sexo AS "sex",
        correo_electronico AS "email",
        telefono AS "phone"
      `,
      values,
    );

    return result.rows[0] ?? null;
  }
}

export const patientRepository = new PatientRepository();
