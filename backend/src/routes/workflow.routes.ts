import { Router } from "express";
import * as controller from "../controllers/workflow.controller";

const router = Router();

router.post("/", controller.createWorkflow);
router.get("/", controller.getWorkflows);
router.get("/:id", controller.getWorkflowById);
router.put("/:id", controller.updateWorkflow);
router.delete("/:id", controller.deleteWorkflow);

export default router;
