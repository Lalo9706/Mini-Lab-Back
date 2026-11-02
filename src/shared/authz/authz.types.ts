import type { Role } from "./roles.js";

export interface AuthenticatedPrincipal {
  employeeId: number;
  role: Role;
}
