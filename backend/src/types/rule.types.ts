import { Document } from "mongoose";

export interface IRule extends Document {
    step_id: string;
    condition: string;
    next_step_id?: string | null;
    priority: number;
    created_at: Date;
    updated_at: Date;
}
