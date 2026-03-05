import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRuleLog {
    rule: string;
    result: boolean;
}

export interface IStepLog {
    step_id?: Types.ObjectId;
    step_name?: string;
    executed_at?: Date;
    rule_logs?: IRuleLog[];
    system?: boolean;
    message?: string;
    timestamp?: Date;
}

export interface IExecution extends Document {
    workflow_id: Types.ObjectId;
    workflow_version: number;
    status: "pending" | "running" | "completed" | "failed" | "cancelled";
    data: Record<string, any>;
    logs: IStepLog[];
    current_step_id: Types.ObjectId | null;
    retries: number;
    started_at: Date;
    ended_at?: Date;
}

const RuleLogSchema = new Schema<IRuleLog>(
    {
        rule: { type: String, required: true },
        result: { type: Boolean, required: true }
    },
    { _id: false }
);

const StepLogSchema = new Schema<IStepLog>(
    {
        step_id: { type: Schema.Types.ObjectId, required: true },
        step_name: { type: String, required: true },
        executed_at: { type: Date, required: true },
        rule_logs: { type: [RuleLogSchema], default: [] }
    },
    { _id: false }
);

const ExecutionSchema = new Schema<IExecution>({
    workflow_id: { type: Schema.Types.ObjectId, required: true, ref: "Workflow" },
    workflow_version: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "running", "completed", "failed", "cancelled"],
        default: "pending"
    },
    data: { type: Schema.Types.Mixed, required: true },
    logs: { type: [StepLogSchema], default: [] },
    current_step_id: { type: Schema.Types.ObjectId, default: null, ref: "Step" },
    retries: { type: Number, default: 0 },
    started_at: { type: Date, default: Date.now },
    ended_at: { type: Date }
});

export default mongoose.model<IExecution>("Execution", ExecutionSchema);
