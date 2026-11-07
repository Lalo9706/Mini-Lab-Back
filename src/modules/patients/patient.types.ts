export type PatientSex = "Masculino" | "Femenino";

export interface Patient {
  id: number;
  fullName: string;
  birthDate: string;
  sex: PatientSex;
  email: string | null;
  phone: string | null;
}

export interface CreatePatientInput {
  fullName: string;
  birthDate: string;
  sex: PatientSex;
  email?: string | null;
  phone?: string | null;
}

export interface UpdatePatientInput {
  fullName?: string;
  birthDate?: string;
  sex?: PatientSex;
  email?: string | null;
  phone?: string | null;
}

export interface PatientFilters {
  search?: string;
  limit: number;
  offset: number;
}

export interface PatientListResult {
  items: Patient[];
  total: number;
}

export interface PatientRepositoryPort {
  findAll(filters: PatientFilters): Promise<PatientListResult>;

  findById(id: number): Promise<Patient | null>;

  create(data: CreatePatientInput): Promise<Patient>;

  update(id: number, data: UpdatePatientInput): Promise<Patient | null>;
}
