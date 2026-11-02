export const ROLES = {
  RESPONSABLE_SANITARIO: "RESPONSABLE_SANITARIO",
  RECEPCIONISTA: "RECEPCIONISTA",
  QUIMICO_ANALISTA: "QUIMICO_ANALISTA",
  QUIMICO_TECNICO: "QUIMICO_TECNICO",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

const DATABASE_ROLE_NAMES: Readonly<Record<string, Role>> = {
  "Responsable Sanitario": ROLES.RESPONSABLE_SANITARIO,
  Recepcionista: ROLES.RECEPCIONISTA,
  "Químico Analista": ROLES.QUIMICO_ANALISTA,
  "Químico Técnico": ROLES.QUIMICO_TECNICO,
};

/**
 * Convierte el nombre del rol de PostgreSQL en un código interno.
 * Un nombre desconocido no debe otorgar permisos.
 */
export function roleFromDatabaseName(name: string): Role | null {
  return DATABASE_ROLE_NAMES[name.trim()] ?? null;
}
