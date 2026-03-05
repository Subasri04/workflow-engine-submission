import Step from "../models/step.model";

export async function createStep(data: any) {
    return Step.create(data);
}

export async function getStepsByWorkflow(workflowId: string) {
    return Step.find({ workflow_id: workflowId }).sort({ order: 1 });
}

export async function updateStep(id: string, data: any) {
    return Step.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteStep(id: string) {
    return Step.findByIdAndDelete(id);
}
