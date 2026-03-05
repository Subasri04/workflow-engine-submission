import mongoose, { Schema, Document } from "mongoose";

export interface IWorkflow extends Document {
    name: string;
    description?: string;
    version: number;
    input_schema: Record<string, any>;
    is_active: boolean;
}

const WorkflowSchema = new Schema<IWorkflow>({
    name: { type: String, required: true },
    description: { type: String },
    version: { type: Number, default: 1 },
    input_schema: { type: Object, required: true },
    is_active: { type: Boolean, default: true }
});

export default mongoose.model<IWorkflow>(
    "Workflow",
    WorkflowSchema
);
