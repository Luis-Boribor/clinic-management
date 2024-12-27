import { Schema, model, models } from "mongoose";

interface IInventoryLog extends Document {
    medicine: Schema.Types.ObjectId;
    quantity: number;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
};

const inventoryLogSchema = new Schema<IInventoryLog>(
    {
        medicine: {
            type: Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const InventoryLog = models.InventoryLog || model('InventoryLog', inventoryLogSchema);

export default InventoryLog;