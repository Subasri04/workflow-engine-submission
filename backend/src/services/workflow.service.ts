import Workflow from "../models/workflow.model";
import WorkflowModel, { IWorkflow } from "../models/workflow.model"

interface CreateWorkflowInput {
    name: string
    input_schema: Record<string, {
        type: string
        required: boolean
        allowed_values?: string[]
    }>
}

export const createWorkflow = async (
    payload: CreateWorkflowInput
): Promise<IWorkflow> => {

    const latestWorkflow = await WorkflowModel
        .findOne({ name: payload.name })
        .sort({ version: -1 })

    const version = latestWorkflow ? latestWorkflow.version + 1 : 1

    const workflow = await WorkflowModel.create({
        name: payload.name,
        version,
        input_schema: payload.input_schema,
        is_active: true
    })

    return workflow
}

export async function getWorkflows() {
    return Workflow.find().sort({ created_at: -1 });
}

export async function getWorkflowById(id: string) {
    return Workflow.findById(id);
}

export async function updateWorkflow(id: string, data: any) {
    const existing = await Workflow.findById(id);
    if (!existing) throw new Error("Workflow not found");

    return createWorkflow({
        ...existing.toObject(),
        ...data,
        _id: undefined
    });
}

export async function deleteWorkflow(id: string) {
    return Workflow.findByIdAndDelete(id);
}
