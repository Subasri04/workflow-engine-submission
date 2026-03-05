import { Router } from "express";
import * as controller from "../controllers/step.controller";

const router = Router();

router.post("/:workflowId", controller.createStep);
router.get("/step/:id", controller.getStepById);
router.get("/:workflowId", controller.getSteps);
router.put("/:id", controller.updateStep);
router.delete("/:id", controller.deleteStep);

export default router;