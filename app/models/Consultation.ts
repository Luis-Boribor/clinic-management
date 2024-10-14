import { Schema, models, model } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Patient from "./Patient"; 

interface IConsultation extends Document {
    patient: Schema.Types.ObjectId;
    address: string;
    father_name?: string;
    father_birthdate?: Date;
    father_occupation?: string;
    mother_name?: string;
    mother_birthdate?: Date;
    mother_occupation?: string;
    height?: string;
    weight?: string;
    person_to_be_notified?: 'father' | 'mother';
    emergency_contact?: string;
    other_person_name?: string;
    other_person_contact?: string;
    relation?: string;
    food_allergy: string[];
    medicine_allergy: string[];
    other_allergy: string[];
    asthma_history?: boolean;
    illness_history: string[];
    person_with_disability: string[];
    current_illness?: string;
    surgical_operation: boolean;
    operation_date?: Date;
    operation_type?: string;
    operation_hospital?: string;
    hospitalized: boolean;
    hospital_name?: string;
    attending_physician?: string;
    diagnosis?: string;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const consultationSchema = new Schema<IConsultation>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        father_name: String,
        father_birthdate: Date,
        father_occupation: String,
        mother_name: String,
        mother_birthdate: Date,
        mother_occupation: String,
        height: String,
        weight: String,
        person_to_be_notified: String,
        emergency_contact: String,
        other_person_name: String,
        other_person_contact: String,
        relation: String,
        food_allergy: {
            type: [String],
            required: true,
            default: [''],
        },
        medicine_allergy: {
            type: [String],
            required: true,
            default: [''],
        },
        other_allergy: {
            type: [String],
            required: true,
            default: [''],
        },
        asthma_history: {
            type: Boolean,
            default: false,
        },
        illness_history: {
            type: [String],
            required: true,
            default: ['']
        },
        person_with_disability: {
            type: [String],
            required: true,
            default: [''],
        },
        current_illness: String,
        surgical_operation: {
            type: Boolean,
            default: false
        },
        operation_date: Date,
        operation_type: String,
        operation_hospital: String,
        hospitalized: {
            type: Boolean,
            default: false,
        },
        hospital_name: String,
        attending_physician: String,
        diagnosis: String,
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
)

const Consultation = models.Consultation || model('Consultation', consultationSchema);

export default Consultation;