import { Router } from "express";
import WorkflowController from "./routes/workflow.routes";
import stepRoutes from "./routes/step.routes";
import ruleRoutes from "./routes/rule.routes";
import executionRoutes from "./routes/execution.routes";

const router = Router();

router.use("/workflows", WorkflowController);
router.use("/steps", stepRoutes);
router.use("/rules", ruleRoutes);
router.use("/executions", executionRoutes);

export default router;
