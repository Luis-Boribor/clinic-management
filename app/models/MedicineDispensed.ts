import { Schema, model, models } from "mongoose";

interface IMedicineDispensed extends Document {
    record: Schema.Types.ObjectId;
    items?: Schema.Types.ObjectId[];
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const medicineDispensedSchema = new Schema<IMedicineDispensed>(
    {
        record: {
            type: Schema.Types.ObjectId,
            ref: 'MedicalRecord',
            required: true,
        },
        items: {
            type: [Schema.Types.ObjectId],
            ref: 'MedicineDispensedItem',
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const MedicineDispensed = models.MedicineDispensed || model('MedicineDispensed', medicineDispensedSchema);

export default MedicineDispensed;