import { Document } from "mongoose";

export interface IWorkflow extends Document {
    name: string;
    version: number;
    is_active: boolean;
    input_schema: object;
    start_step_id?: string;
    created_at: Date;
    updated_at: Date;
}
