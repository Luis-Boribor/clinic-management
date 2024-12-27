import connect from "@/lib/connect";
import MedicalRecord from "@/app/models/MedicalRecord";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const medex = await MedicalRecord.aggregate([
            {
                $match: { deletedAt: null }
            },
            {
                $lookup: {
                    from: 'consultations',
                    localField: 'consultation',
                    foreignField: '_id',
                    as: 'consultation'
                }
            },
            {
                $unwind: {
                    path: '$consultation',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $unwind: {
                    path: '$patient',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: 'medicalexaminations',
                    localField: 'medical_examination',
                    foreignField: '_id',
                    as: 'medical_examination',
                }
            },
            {
                $unwind: {
                    path: '$medical_examination',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $lookup: {
                    from: 'dentalconsultations',
                    localField: 'dental_consultation',
                    foreignField: '_id',
                    as: 'dental_consultation',
                }
            },
            {
                $unwind: {
                    path: '$dental_consultation',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    _id: 1,
                    patient: {
                        _id: "$patient._id",
                        first_name: "$patient.first_name",
                        middle_name: "$patient.middle_name",
                        last_name: "$patient.last_name",
                        extension: "$patient.extension",
                        position: "$patient.position",
                        course: "$patient.course",
                        year: '$patient.year',
                        department: "$patient.department",
                        id_number: "$patient.id_number",
                        birthdate: "$patient.birthdate",
                        nationality: "$patient.nationality",
                        religion: "$patient.religion",
                        sex: "$patient.sex",
                        contact: "$patient.contact",
                        email: "$patient.email",
                        address: "$patient.address",
                        father_name: "$patient.father_name",
                        father_birthdate: "$patient.father_birthdate",
                        father_occupation: "$patient.father_occupation",
                        mother_name: "$patient.mother_name",
                        mother_birthdate: "$patient.mother_birthdate",
                        mother_occupation: "$patient.mother_occupation",
                        blood_type: "$patient.blood_type",
                        height: "$patient.height",
                        weight: "$patient.weight",
                        person_to_be_notified: "$patient.person_to_be_notified",
                        emergency_contact: "$patient.emergency_contact",
                        other_person_name: "$patient.other_person_name",
                        other_person_contact: "$patient.other_person_contact",
                        relation: "$patient.relation",
                        food_allergy: "$patient.food_allergy",
                        medicine_allergy: "$patient.medicine_allergy",
                        other_allergy: "$patient.other_allergy",
                    },
                    consultation: {
                        _id: 1,
                        address: '$consultation.address',
                        father_name: '$consultation.father_name',
                        father_birthdate: '$consultation.father_birthdate',
                        father_occupation: '$consultation.father_occupation',
                        mother_name: '$consultation.mother_name',
                        mother_birthdate: '$consultation.mother_birthdate',
                        mother_occupation: '$consultation.mother_occupation',
                        height: '$consultation.height',
                        weight: '$consultation.weight',
                        person_to_be_notified: '$consultation.person_to_be_notified',
                        emergency_contact: '$consultation.emergency_contact',
                        other_person_name: '$consultation.other_person_name',
                        other_person_contact: '$consultation.other_person_contact',
                        relation: '$consultation.relation',
                        food_allergy: '$consultation.food_allergy',
                        medicine_allergy: '$consultation.medicine_allergy',
                        other_allergy: '$consultation.other_allergy',
                        asthma_history: '$consultation.asthma_history',
                        illness_history: '$consultation.illness_history',
                        person_with_disability: '$consultation.person_with_disability',
                        current_illness: '$consultation.current_illness',
                        surgical_operation: '$consultation.surgical_operation',
                        operation_date: '$consultation.operation_date',
                        operation_type: '$consultation.operation_type',
                        operation_hospital: '$consultation.operation_hospital',
                        hospitalized: '$consultation.hospitalized',
                        hospital_name: '$consultation.hospital_name',
                        attending_physician: '$consultation.attending_physician',
                        diagnosis: '$consultation.diagnosis',
                        createdAt: '$consultation.createdAt',
                    },
                    medical_examination: {
                        _id: 1,
                        civil_status: '$medical_examination.civil_status',
                        purpose: '$medical_examination.purpose',
                        past_medical_history: '$medical_examination.past_medical_history',
                        family_history: '$medical_examination.family_history',
                        occupational_history: '$medical_examination.occupational_history',
                        body_mass_index: '$medical_examination.body_mass_index',
                        skin: '$medical_examination.skin',
                        heads: '$medical_examination.heads',
                        eyes: '$medical_examination.eyes',
                        ears: '$medical_examination.ears',
                        mouth: '$medical_examination.mouth',
                        neck: '$medical_examination.neck',
                        chest: '$medical_examination.chest',
                        abdomen: '$medical_examination.abdomen',
                        rectal: '$medical_examination.rectal',
                        musculo_skeletal: '$medical_examination.musculo_skeletal',
                        extremeties: '$medical_examination.extremeties',
                        other: '$medical_examination.other',
                        blood_pressure: '$medical_examination.blood_pressure',
                        temperature: '$medical_examination.temperature',
                        hr: '$medical_examination.hr',
                        rr: '$medical_examination.rr',
                        height: '$medical_examination.height',
                        weight: '$medical_examination.weight',
                        hearing: '$medical_examination.hearing',
                        vision: '$medical_examination.vision',
                        vision_l: '$medical_examination.vision_l',
                        vision_r: '$medical_examination.vision_r',
                        chest_xray: '$medical_examination.chest_xray',
                        xray_type: '$medical_examination.xray_type',
                        complete_blood_count: '$medical_examination.complete_blood_count',
                        routine_urinalysis: '$medical_examination.routine_urinalysis',
                        fecalysis: '$medical_examination.fecalysis',
                        hepatitis_b_screening: '$medical_examination.hepatitis_b_screening',
                        metaphetamine: '$medical_examination.metaphetamine',
                        tetrahydrocannabinol: '$medical_examination.tetrahydrocannabinol',
                        image: '$medical_examination.image',
                        classification: '$medical_examination.classification',
                        needs_treatment: '$medical_examination.needs_treatment',
                        remarks: '$medical_examination.remarks',
                        createdAt: '$medical_examination.createdAt',
                    },
                    dental_consultation: {
                        _id: '$dental_consultation._id',
                        teeth: '$dental_consultation.teeth',
                        teeth_work: '$dental_consultation.teeth_work',
                        case_history: '$dental_consultation.case_history',
                        chief_complaint: '$dental_consultation.chief_complaint',
                        createdAt: '$dental_consultation.createdAt',
                    },
                    consultation_type: 1,
                    findings: 1,
                    createdAt: 1,

                }
            },
            // {
            //     $lookup: {
            //         from: 'dental_consultation',
            //         localField: '_id',
            //         foreignField: 'dental_consultation',
            //         as: 'dental_consultation',
            //     }
            // },
            // {
            //     $lookup: {
            //         from: 'patient',
            //         localField: 'medical_examination.patient',
            //         foreignField: '_id',
            //         as: 'medical_examination.patient'
            //     }
            // },
            // {
            //     $lookup: {
            //         from: 'patient',
            //         localField: 'dental_consultation.patient',
            //         foreignField: '_id',
            //         as: 'dental_consultation.patient'
            //     }
            // },
        ]).sort({ createdAt: -1 });
        //.populate('consultation').populate('medical_examination').populate('dental_consultation')
        // const medex = await MedicalRecord.find({ deletedAt: null }).populate('patient').populate('consultation').populate('medical_examination').populate('dental_consultation');
        return new NextResponse(JSON.stringify({message: 'OK', medex: medex}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const recordId = searchParams.get('record_id');

        if (!recordId) {
            return new NextResponse(JSON.stringify({message: 'Missing record id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(recordId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid record id'}), {status: 400});
        }

        await connect();
        const result = await MedicalRecord.findOneAndUpdate(
            { _id: recordId },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to archive record'}), {status: 400});
        }
        return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}