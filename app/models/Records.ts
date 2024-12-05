import { Schema, model, models } from "mongoose";

interface IRecords extends Document {
    findings: string;
    year: number;
    month: number;
    count: number;
};

const recordSchema = new Schema<IRecords>(
    {
        findings: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        count: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        timestamps: true,
    }
);

const Records = models.Records || model('Records', recordSchema);

export default Records;