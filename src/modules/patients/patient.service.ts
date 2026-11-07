import { AppError } from "../../shared/errors/app-error.js";

import { patientRepository } from "./patient.repository.js";

import type {
  CreatePatientInput,
  PatientFilters,
  PatientListResult,
  PatientRepositoryPort,
  UpdatePatientInput,
} from "./patient.types.js";

export class PatientService {
  constructor(private readonly repository: PatientRepositoryPort) {}

  async findAll(filters: PatientFilters): Promise<PatientListResult> {
    return this.repository.findAll(filters);
  }

  async findById(id: number) {
    const patient = await this.repository.findById(id);

    if (!patient) {
      throw new AppError(404, "PATIENT_NOT_FOUND", "No se encontró el paciente solicitado.");
    }

    return patient;
  }

  async create(data: CreatePatientInput) {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdatePatientInput) {
    const patient = await this.repository.update(id, data);

    if (!patient) {
      throw new AppError(404, "PATIENT_NOT_FOUND", "No se encontró el paciente solicitado.");
    }

    return patient;
  }
}

export const patientService = new PatientService(patientRepository);
