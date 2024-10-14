import { Schema, model, models } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Consultation from "./Consultation";

interface IMedicalRecord extends Document {
    consultation: Schema.Types.ObjectId;
    consultation_type: string;
    findings: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
    {
        consultation: {
            type: Schema.Types.ObjectId,
            ref: 'Consultation',
            required: true,
        },
        consultation_type: {
            type: String,
            required: true,
        },
        findings: {
            type: String,
            required: true,
        },
        deletedAt: Date,
    },
    {
        timestamps: true
    }
)

const MedicalRecord = models.MedicalRecord || model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;