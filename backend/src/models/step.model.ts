import mongoose, { Schema, Document } from "mongoose";

export type StepType = "task" | "approval" | "notification";

export interface IStep extends Document {
  workflow_id: string;
  name: string;
  step_type: StepType;
  order: number;
  metadata: Record<string, string>;
  created_at: Date;
  updated_at: Date;
}

const StepSchema: Schema = new Schema(
  {
    workflow_id: {
      type: Schema.Types.ObjectId,
      ref: "Workflow",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    step_type: {
      type: String,
      enum: ["task", "approval", "notification"],
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export default mongoose.model<IStep>("Step", StepSchema);