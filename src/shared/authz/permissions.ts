export const PERMISSIONS = {
  // Pacientes y médicos
  PATIENTS_CREATE: "patients.create",
  PATIENTS_READ: "patients.read",
  PATIENTS_UPDATE: "patients.update",
  DOCTORS_MANAGE: "doctors.manage",

  // Citas y recepción
  APPOINTMENTS_READ: "appointments.read",
  APPOINTMENTS_CREATE: "appointments.create",
  APPOINTMENTS_RESCHEDULE: "appointments.reschedule",
  APPOINTMENTS_CANCEL: "appointments.cancel",
  APPOINTMENTS_PRINT: "appointments.print",

  RECEIPTS_CREATE: "receipts.create",
  RECEIPTS_CANCEL: "receipts.cancel",
  RECEIPTS_PRINT: "receipts.print",
  PAYMENTS_REGISTER: "payments.register",

  // Catálogos clínicos
  CATALOG_AREAS_MANAGE: "catalog.areas.manage",

  CATALOG_METHODS_READ: "catalog.methods.read",
  CATALOG_METHODS_MANAGE: "catalog.methods.manage",

  CATALOG_REFERENCE_VALUES_READ: "catalog.reference-values.read",
  CATALOG_REFERENCE_VALUES_MANAGE: "catalog.reference-values.manage",

  CATALOG_TESTS_READ: "catalog.tests.read",
  CATALOG_TESTS_MANAGE: "catalog.tests.manage",

  CATALOG_EXAMS_READ: "catalog.exams.read",
  CATALOG_EXAMS_MANAGE: "catalog.exams.manage",

  CATALOG_OUTSOURCING_LABS_READ: "catalog.outsourcing-labs.read",
  CATALOG_OUTSOURCING_LABS_MANAGE: "catalog.outsourcing-labs.manage",

  // Trabajo clínico
  LABORATORY_PENDING_READ: "laboratory.pending.read",
  LABORATORY_RESULTS_CAPTURE: "laboratory.results.capture",
  LABORATORY_RESULTS_VALIDATE: "laboratory.results.validate",
  LABORATORY_REPORTS_PRINT: "laboratory.reports.print",

  // Inventario
  INVENTORY_READ: "inventory.read",
  INVENTORY_STOCK_RECEIVE: "inventory.stock.receive",
  INVENTORY_RECIPE_MANAGE: "inventory.recipe.manage",
  INVENTORY_CONSUMPTION_RECORD: "inventory.consumption.record",
  INVENTORY_WASTAGE_CORRECT: "inventory.wastage.correct",

  // Informes y administración
  REPORTS_ACCOUNTING_READ: "reports.accounting.read",
  REPORTS_INVENTORY_READ: "reports.inventory.read",
  EMPLOYEES_MANAGE: "employees.manage",
  LABORATORY_SETTINGS_MANAGE: "laboratory.settings.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
