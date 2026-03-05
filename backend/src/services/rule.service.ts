import Rule from "../models/rule.model";

export async function createRule(data: any) {
    return Rule.create(data);
}

export async function getRulesByStep(stepId: string) {
    return Rule.find({ step_id: stepId }).sort({ priority: 1 });
}

export async function updateRule(id: string, data: any) {
    return Rule.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteRule(id: string) {
    return Rule.findByIdAndDelete(id);
}
