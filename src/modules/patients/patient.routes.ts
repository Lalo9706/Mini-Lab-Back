import { Router } from "express";

import { authenticate } from "../../middlewares/authenticate.middleware.js";

import { authorize } from "../../shared/authz/authorize.middleware.js";
import { PERMISSIONS } from "../../shared/authz/permissions.js";

import * as patientController from "./patient.controller.js";

const router = Router();

// Todas las rutas de pacientes requieren autenticación.
router.use(authenticate);

router.get("/", authorize(PERMISSIONS.PATIENTS_READ), patientController.findAll);

router.get("/:id", authorize(PERMISSIONS.PATIENTS_READ), patientController.findById);

router.post("/", authorize(PERMISSIONS.PATIENTS_CREATE), patientController.create);

router.patch("/:id", authorize(PERMISSIONS.PATIENTS_UPDATE), patientController.update);

export default router;
