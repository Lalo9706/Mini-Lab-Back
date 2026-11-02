import type { AuthenticatedPrincipal } from "../shared/authz/authz.types.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedPrincipal;
    }
  }
}

export {};
