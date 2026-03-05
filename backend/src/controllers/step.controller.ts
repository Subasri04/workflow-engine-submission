import { Request, Response } from "express";
import Step from "../models/step.model";
import * as stepService from "../services/step.service";

export const createStep = async (req: Request, res: Response) => {
  try {
    const { workflow_id, name, step_type, order, metadata } = req.body;

    const step = await Step.create({
      workflow_id,
      name,
      step_type,
      order,
      metadata,
    });

    res.json(step);
  } catch (error) {
    res.status(500).json({ message: "Failed to create step" });
  }
};

export const getSteps = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;

    const steps = await Step.find({ workflow_id: workflowId }).sort({
      order: 1,
    });

    res.json(steps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch steps" });
  }
};

export const updateStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { name, step_type, order, metadata } = req.body;

    const step = await Step.findByIdAndUpdate(
      id,
      { name, step_type, order, metadata },
      { new: true }
    );

    res.json(step);
  } catch (error) {
    res.status(500).json({ message: "Failed to update step" });
  }
};

export async function deleteStep(req: Request, res: Response) {
  const id = req.params.id as string;
  await stepService.deleteStep(id);
  res.json({ message: "Deleted" });
}

export const getStepById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const step = await Step.findById(id);

    res.json(step);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch step" });
  }
};
