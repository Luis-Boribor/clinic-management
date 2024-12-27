import { Schema, model, models } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Consultation from "./Consultation";

interface IMedicalRecord extends Document {
    patient: Schema.Types.ObjectId;
    consultation: Schema.Types.ObjectId;
    medical_examination: Schema.Types.ObjectId;
    dental_consultation: Schema.Types.ObjectId;
    consultation_type: string;
    findings?: string[];
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        consultation: {
            type: Schema.Types.ObjectId,
            ref: 'Consultation',
            required: false,
        },
        medical_examination: {
            type: Schema.Types.ObjectId,
            ref: 'MedicalExamination',
            required: false,
        },
        dental_consultation: {
            type: Schema.Types.ObjectId,
            ref: 'DentalConsultation',
            required: false,
        },
        consultation_type: {
            type: String,
            required: true,
        },
        findings: [String],
        deletedAt: Date,
    },
    {
        timestamps: true
    }
)

const MedicalRecord = models.MedicalRecord || model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;