import Workflow from "../models/workflow.model";
import Step, { IStep } from "../models/step.model";
import Execution from "../models/execution.model";
import { evaluateRules } from "../utils/ruleEngine";
import mongoose from "mongoose";

const MAX_ITERATIONS = 50;

export async function startExecution(
  workflowId: string,
  data: Record<string, any>
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
    data,
    logs: [],
    current_step_id: firstStep._id,
    started_at: new Date(),
    retries: 0
  });

  let currentStep: IStep | null = firstStep;
  let iterationCount = 0;

  while (currentStep && iterationCount < MAX_ITERATIONS) {
    iterationCount++;

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
      execution.current_step_id = null;
      break;
    }

    const nextStep = await Step.findById(
      new mongoose.Types.ObjectId(ruleResult.nextStepId)
    );

    if (!nextStep) {
      execution.current_step_id = null;
      break;
    }

    execution.current_step_id = nextStep._id;
    currentStep = nextStep;
  }

  if (iterationCount >= MAX_ITERATIONS) {
    execution.status = "failed";
  } else {
    execution.status = "completed";
  }

  execution.ended_at = new Date();
  await execution.save();

  return execution;
}
