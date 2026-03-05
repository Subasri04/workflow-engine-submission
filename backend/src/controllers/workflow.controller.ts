import { Request, Response } from "express";
import Workflow from "../models/workflow.model";

export const createWorkflow = async (req: Request, res: Response) => {
    try {
        const workflow = await Workflow.create(req.body);
        res.status(201).json(workflow);
    } catch {
        res.status(500).json({ message: "Failed to create workflow" });
    }
};

export const getWorkflows = async (req: Request, res: Response) => {
    try {
        const {
            page = "1",
            limit = "5",
            search = "",
            status
        } = req.query;

        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);

        const query: any = {};

        // 🔎 Search by name
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        // 🔵 Status filter
        if (status === "active") {
            query.is_active = true;
        }

        if (status === "inactive") {
            query.is_active = false;
        }

        const total = await Workflow.countDocuments(query);

        const workflows = await Workflow.find(query)
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        res.json({
            data: workflows,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / pageSize)
        });

    } catch {
        res.status(500).json({
            message: "Failed to fetch workflows"
        });
    }
};

export const getWorkflowById = async (req: Request, res: Response) => {
    try {
        const workflow = await Workflow.findById(req.params.id);
        res.json(workflow);
    } catch {
        res.status(500).json({ message: "Failed to fetch workflow" });
    }
};

export const updateWorkflow = async (req: Request, res: Response) => {
    try {
        const workflow = await Workflow.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(workflow);
    } catch {
        res.status(500).json({ message: "Failed to update workflow" });
    }
};

export const deleteWorkflow = async (req: Request, res: Response) => {
    try {
        await Workflow.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch {
        res.status(500).json({ message: "Failed to delete workflow" });
    }
};