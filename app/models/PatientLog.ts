import { Schema, model, models } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Patient from "./Patient";

interface IPatientLog extends Document {
    patient: Schema.Types.ObjectId;
    consultation_type: string;
    complaint: string[];
    findings: string[];
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const patientLogSchema = new Schema<IPatientLog>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Patient'
        },
        consultation_type: {
            type: String,
            required: true,
        },
        complaint: {
            type: [String],
            required: true,
        },
        findings: [String],
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
)

const PatientLog = models.PatientLog || model('PatientLog', patientLogSchema);

export default PatientLog;