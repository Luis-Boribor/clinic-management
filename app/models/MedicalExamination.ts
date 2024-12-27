import { Schema, model, models } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Patient from "./Patient"; 

interface IMedicalExamination extends Document {
    patient: Schema.Types.ObjectId;
    civil_status: string;
    purpose: string;
    past_medical_history: string;
    family_history: string;
    occupational_history: string;
    body_mass_index: string;
    skin: string;
    heads: string;
    eyes: string;
    ears: string;
    mouth: string;
    neck: string;
    chest: string;
    abdomen: string;
    rectal: string;
    musculo_skeletal: string;
    extremeties: string;
    other: string;
    blood_pressure: string;
    temperature: string;
    hr: string;
    rr: string;
    height: string;
    weight: string;
    hearing: string;
    vision: string;
    vision_l: string;
    vision_r: string;
    chest_xray: string;
    xray_type: string;
    complete_blood_count: string;
    routine_urinalysis: string;
    fecalysis: string;
    hepatitis_b_screening: string;
    metaphetamine: string;
    tetrahydrocannabinol: string;
    image: string;
    classification: string;
    needs_treatment: string[];
    remarks: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const medicalExaminationSchema = new Schema<IMedicalExamination>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        civil_status: String,
        purpose: {
            type: String,
            required: true,
        },
        past_medical_history: String,
        family_history: String,
        occupational_history: String,
        body_mass_index: String,
        skin: String,
        heads: String,
        eyes: String,
        ears: String,
        mouth: String,
        neck: String,
        chest: String,
        abdomen: String,
        rectal: String,
        musculo_skeletal: String,
        extremeties: String,
        other: String,
        blood_pressure: String,
        temperature: String,
        hr: String,
        rr: String,
        height: String,
        weight: String,
        hearing: String,
        vision: String,
        chest_xray: String,
        xray_type: String,
        complete_blood_count: String,
        routine_urinalysis: String,
        fecalysis: String,
        hepatitis_b_screening: String,
        metaphetamine: String,
        tetrahydrocannabinol: String,
        image: String,
        classification: String,
        needs_treatment: {
            type: [String],
            required: true,
            default: ['']
        },
        remarks: String,
        deletedAt: Date,
    },
    {
        timestamps: true
    }
)

const MedicalExamination = models.MedicalExamination || model('MedicalExamination', medicalExaminationSchema);

export default MedicalExamination;