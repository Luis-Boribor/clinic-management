import { Schema, models, model } from "mongoose";

interface IDentalConsultation extends Document {
    patient: Schema.Types.ObjectId;
    teeth?: number[];
    teeth_work?: string[];
    case_history?: string;
    chief_complaint?: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const dentalConsultationSchema = new Schema<IDentalConsultation>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        teeth: [Number],
        teeth_work: [String],
        case_history: String,
        chief_complaint: String,
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const DentalConsultation = models.DentalConsultation || model('DentalConsultation', dentalConsultationSchema);

export default DentalConsultation;