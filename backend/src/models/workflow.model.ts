import mongoose, { Schema, Document } from "mongoose";

export interface IInputField {
    type: "string" | "number" | "boolean";
    required: boolean;
    allowed_values?: string[];
}

export interface IWorkflow extends Document {
    name: string;
    description?: string;
    version: number;
    status: "active" | "inactive";
    input_schema: Record<string, IInputField>;
    created_at: Date;
    updated_at: Date;
}

const InputFieldSchema = new Schema<IInputField>(
    {
        type: {
            type: String,
            enum: ["string", "number", "boolean"],
            required: true
        },
        required: {
            type: Boolean,
            default: false
        },
        allowed_values: {
            type: [String],
            default: undefined
        }
    },
    { _id: false }
);

const WorkflowSchema = new Schema<IWorkflow>(
    {
        name: { type: String, required: true },
        description: { type: String },
        version: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
        input_schema: {
            type: Map,
            of: InputFieldSchema,
            default: {}
        }
    },
    { timestamps: true }
);

export default mongoose.model<IWorkflow>("Workflow", WorkflowSchema);
