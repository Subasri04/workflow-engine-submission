import Workflow from "../models/workflow.model";
import Step from "../models/step.model";
import Execution from "../models/execution.model";
import { evaluateRules } from "../utils/ruleEngine";

const MAX_ITERATIONS = 20;

export async function startExecution(
  workflowId: string,
  data: Record<string, unknown>
) {
  const workflow = await Workflow.findById(workflowId);

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const firstStep = await Step.findOne({
    workflow_id: workflowId
  }).sort({ order: 1 });

  if (!firstStep) {
    throw new Error("No steps found for workflow");
  }

  const execution = await Execution.create({
    workflow_id: workflow._id,
    workflow_version: workflow.version,
    status: "running",
    started_at: new Date(),
    data,
    logs: [],
    current_step_id: firstStep._id
  });

  let currentStep = firstStep;
  let iteration = 0;

  while (currentStep && iteration < MAX_ITERATIONS) {

    const ruleResult = await evaluateRules(
      currentStep._id.toString(),
      data
    );

    execution.logs.push({
      step_id: currentStep._id,
      step_name: currentStep.name,
      executed_at: new Date(),
      rule_logs: ruleResult.logs
    });

    if (!ruleResult.nextStepId) {
      break;
    }

    currentStep = await Step.findById(ruleResult.nextStepId);
    execution.current_step_id = currentStep?._id ?? null;

    iteration++;
  }

  if (iteration >= MAX_ITERATIONS) {
    execution.status = "failed";
  } else {
    execution.status = "completed";
  }

  execution.ended_at = new Date();
  execution.current_step_id = null;

  await execution.save();

  return execution;
}
