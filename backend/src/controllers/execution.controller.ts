import { Request, Response } from "express";
import Execution from "../models/execution.model";
import * as executionService from "../services/execution.service";
import ExecutionModel from "../models/execution.model"

export const getAllExecutions = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {
 
    const executions = await ExecutionModel
      .find()
      .populate("workflow_id", "name")
      .sort({ started_at: -1 })

    res.json(executions)

  } catch {

    res.status(500).json({
      message: "Failed to fetch executions"
    })

  }
}

export const getExecutionById = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const execution = await ExecutionModel
      .findById(req.params.id)
      .populate("workflow_id", "name")

    res.json(execution)

  } catch {

    res.status(500).json({
      message: "Failed to fetch execution"
    })

  }
}

export const startExecution = async (req: Request, res: Response) => {
  try {

    const { workflow_id, data } = req.body;
    const result = await executionService.startExecution(
      workflow_id,
      data
    );

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({
      message: "Failed to start execution",
      error: (error as Error).message
    });
  }
};


export async function cancelExecution(req: Request, res: Response) {
  const execution = await Execution.findById(req.params.id);
  if (!execution) return res.status(404).json({ message: "Not found" });

  if (execution.status === "completed")
    return res.status(400).json({ message: "Cannot cancel completed execution" });

  execution.status = "cancelled";
  execution.ended_at = new Date();
  await execution.save();

  return res.json(execution);
}

export async function retryExecution(req: Request, res: Response) {
  const execution = await Execution.findById(req.params.id);
  if (!execution) return res.status(404).json({ message: "Not found" });

  if (execution.status !== "failed")
    return res.status(400).json({ message: "Only failed executions can be retried" });

  execution.status = "pending";
  execution.retries += 1;
  await execution.save();

  return res.json(execution);
}