import { Schema, model, models } from "mongoose";

interface IMedicine extends Document {
    medicine_name: string;
    description?: string[];
    stock: number;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
    {
        medicine_name: {
            type: String,
            required: true,
            unique: true,
        },
        description: [String],
        stock: {
            type: Number,
            default: 0,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const Medicine = models.Medicine || model('Medicine', medicineSchema);

export default Medicine;