import { Schema, model, models } from "mongoose";

interface IPatient extends Document {
    first_name: string;
    middle_name: string;
    last_name: string;
    extension?: string;
    position: 'student' | 'teacher' | 'non-teaching-staff';
    department: string;
    id_number: string;
    birthdate: Date;
    nationality: string;
    religion: string;
    sex: 'male' | 'female';
    contact: string;
    email: string;
    address: string;
    father_name?: string;
    father_birthdate?: Date;
    father_occupation?: string;
    mother_name?: string;
    mother_birthdate?: Date;
    mother_occupation?: string;
    blood_type?: string;
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
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const patientSchema = new Schema<IPatient>(
    {
        first_name: {
            type: String,
            required: true,
        },
        middle_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        extension: String,
        position: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        id_number: {
            type: String,
            required: true,
            unique: true,
        },
        birthdate: {
            type: Date,
            required: true,
        },
        nationality: {
            type: String,
            required: true,
        },
        religion: {
            type: String,
            required: true,
        },
        sex: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        email: {
            type: String,
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
        blood_type: String,
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
        deletedAt: Date,
    },
    {
        timestamps: true
    }
)

const Patient = models.Patient || model('Patient', patientSchema);

export default Patient;