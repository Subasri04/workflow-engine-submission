import Workflow from "../models/workflow.model";

interface CreateWorkflowInput {
    name: string
    input_schema: Record<string, {
        type: string
        required: boolean
        allowed_values?: string[]
    }>
}

export async function createWorkflow(data: {
  name: string;
  description?: string;
  input_schema: Record<string, unknown>;
}) {
  const workflow = await Workflow.create({
    name: data.name,
    description: data.description,
    input_schema: data.input_schema,
    version: 1,
    is_active: true
  });

  return workflow;
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
