import express from "express";
import healthRoutes from "./modules/health/health.routes.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "1mb" }));

app.use("/health", healthRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
