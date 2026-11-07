import { describe, expect, it } from "vitest";

import { PatientService } from "../../../src/modules/patients/patient.service.js";

import type {
  Patient,
  PatientFilters,
  PatientListResult,
  PatientRepositoryPort,
  CreatePatientInput,
  UpdatePatientInput,
} from "../../../src/modules/patients/patient.types.js";

class FakePatientRepository implements PatientRepositoryPort {
  private patients: Patient[] = [];
  private nextId = 1;

  async findAll(filters: PatientFilters): Promise<PatientListResult> {
    const filtered = this.patients.filter((patient) =>
      patient.fullName.toLowerCase().includes(filters.search?.toLowerCase() ?? ""),
    );

    return {
      items: filtered.slice(filters.offset, filters.offset + filters.limit),
      total: filtered.length,
    };
  }

  async findById(id: number): Promise<Patient | null> {
    return this.patients.find((patient) => patient.id === id) ?? null;
  }

  async create(data: CreatePatientInput): Promise<Patient> {
    const patient: Patient = {
      id: this.nextId++,
      fullName: data.fullName,
      birthDate: data.birthDate,
      sex: data.sex,
      email: data.email ?? null,
      phone: data.phone ?? null,
    };

    this.patients.push(patient);

    return patient;
  }

  async update(id: number, data: UpdatePatientInput): Promise<Patient | null> {
    const patient = this.patients.find((item) => item.id === id);

    if (!patient) {
      return null;
    }

    Object.assign(patient, data);

    return patient;
  }
}

describe("PatientService", () => {
  it("registra un paciente", async () => {
    const repository = new FakePatientRepository();
    const service = new PatientService(repository);

    const patient = await service.create({
      fullName: "Paciente de Prueba",
      birthDate: "1997-06-02",
      sex: "Masculino",
    });

    expect(patient.id).toBe(1);
    expect(patient.fullName).toBe("Paciente de Prueba");
    expect(patient.email).toBeNull();
  });

  it("consulta un paciente existente", async () => {
    const repository = new FakePatientRepository();
    const service = new PatientService(repository);

    const created = await service.create({
      fullName: "Paciente de Prueba",
      birthDate: "1997-06-02",
      sex: "Masculino",
    });

    const patient = await service.findById(created.id);

    expect(patient.id).toBe(created.id);
  });

  it("actualiza los datos de un paciente", async () => {
    const repository = new FakePatientRepository();
    const service = new PatientService(repository);

    const created = await service.create({
      fullName: "Paciente de Prueba",
      birthDate: "1997-06-02",
      sex: "Masculino",
    });

    const updated = await service.update(created.id, {
      phone: "2281234567",
    });

    expect(updated.phone).toBe("2281234567");
  });

  it("devuelve 404 cuando el paciente no existe", async () => {
    const repository = new FakePatientRepository();
    const service = new PatientService(repository);

    await expect(service.findById(999)).rejects.toMatchObject({
      statusCode: 404,
      code: "PATIENT_NOT_FOUND",
    });
  });
});
