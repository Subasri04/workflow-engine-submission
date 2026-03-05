import { Router } from "express";
import * as controller from "../controllers/execution.controller";

const router = Router();

router.post("/start", controller.startExecution);
router.get("/", controller.getAllExecutions);
router.get("/:id", controller.getExecutionById);
router.post("/:id/cancel", controller.cancelExecution);
router.post("/:id/retry", controller.retryExecution);

export default router;
