import type { RequestHandler } from "express";

import { patientService } from "./patient.service.js";

import {
  createPatientSchema,
  patientIdSchema,
  patientQuerySchema,
  updatePatientSchema,
} from "./patient.schema.js";

export const findAll: RequestHandler = async (req, res, next) => {
  try {
    const validation = patientQuerySchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Los parámetros de búsqueda no son válidos.",
        },
      });

      return;
    }

    const { search, page, limit } = validation.data;

    const result = await patientService.findAll({
      search,
      limit,
      offset: (page - 1) * limit,
    });

    res.status(200).json({
      data: result.items,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const findById: RequestHandler = async (req, res, next) => {
  try {
    const validation = patientIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      res.status(400).json({
        error: {
          code: "INVALID_PATIENT_ID",
          message: "El identificador del paciente no es válido.",
        },
      });

      return;
    }

    const patient = await patientService.findById(validation.data);

    res.status(200).json({
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    const validation = createPatientSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Los datos del paciente no son válidos.",
          details: validation.error.issues,
        },
      });

      return;
    }

    const patient = await patientService.create(validation.data);

    res.status(201).json({
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const idValidation = patientIdSchema.safeParse(req.params.id);

    const bodyValidation = updatePatientSchema.safeParse(req.body);

    if (!idValidation.success || !bodyValidation.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Los datos de actualización no son válidos.",
        },
      });

      return;
    }

    const patient = await patientService.update(idValidation.data, bodyValidation.data);

    res.status(200).json({
      data: patient,
    });
  } catch (error) {
    next(error);
  }
};
