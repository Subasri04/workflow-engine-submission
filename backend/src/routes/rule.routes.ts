import { Router } from "express";
import * as controller from "../controllers/rule.controller";

const router = Router();

router.post("/:stepId", controller.createRule);
router.get("/:stepId", controller.getRules);
router.put("/:id", controller.updateRule);
router.delete("/:id", controller.deleteRule);

router.post("/test-rule", controller.testRuleEngine);
export default router;
