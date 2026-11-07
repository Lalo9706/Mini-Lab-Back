import { z } from "zod";

function isValidDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function getMexicoToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD")
  .refine(isValidDate, "La fecha no es válida.")
  .refine((value) => value <= getMexicoToday(), "La fecha de nacimiento no puede ser futura.");

const patientFields = {
  fullName: z.string().trim().min(1).max(200),

  birthDate: birthDateSchema,

  sex: z.enum(["Masculino", "Femenino"]),

  email: z.string().trim().email().max(150).nullable().optional(),

  phone: z.string().trim().max(20).nullable().optional(),
};

export const createPatientSchema = z.object(patientFields).strict();

export const updatePatientSchema = z
  .object(patientFields)
  .partial()
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Debe proporcionar al menos un campo para actualizar.",
  );

export const patientIdSchema = z.coerce.number().int().positive();

export const patientQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});
