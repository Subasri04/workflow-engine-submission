import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRule extends Document {
    step_id: Types.ObjectId;
    condition: string;
    next_step_id?: Types.ObjectId | null;
    priority: number;
    created_at: Date;
    updated_at: Date;
}

const RuleSchema = new Schema<IRule>(
    {
        step_id: {
            type: Schema.Types.ObjectId,
            ref: "Step",
            required: true
        },
        condition: {
            type: String,
            required: true
        },
        next_step_id: {
            type: Schema.Types.ObjectId,
            ref: "Step",
            default: null
        },
        priority: {
            type: Number,
            required: true
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model<IRule>("Rule", RuleSchema);
