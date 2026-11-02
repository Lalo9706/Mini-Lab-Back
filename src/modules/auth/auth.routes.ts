import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import { login, me } from "./auth.controller.js";
import { authenticate } from "../../middlewares/authenticate.middleware.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: {
      code: "TOO_MANY_LOGIN_ATTEMPTS",
      message: "Demasiados intentos. Intenta nuevamente más tarde.",
    },
  },
});

router.post("/login", loginLimiter, login);

router.get("/me", authenticate, me);

export default router;
