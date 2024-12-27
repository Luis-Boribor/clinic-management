import connect from "@/lib/connect";
import MedicalExamination from "@/app/models/MedicalExamination";
import MedicalRecord from "@/app/models/MedicalRecord";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();

        if (!body?.patient) {
            return new NextResponse(JSON.stringify({message: 'Patient id is required'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(body?.patient)) {
            return new NextResponse(JSON.stringify({message: 'Invalid patient id'}), {status: 400});
        }

        const medex = new MedicalExamination(body);
        medex.save();

        if (!medex) {
            return new NextResponse(JSON.stringify({message: 'Failed to create medical examination'}), {status: 400});
        }
        await MedicalRecord.create({
            patient: body?.patient,
            medical_examination: medex._id,
            consultation_type: 'medical-examination',
        });

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
        const medexId = searchParams.get('medex_id');

        if (!medexId) {
            return new NextResponse(JSON.stringify({message: 'Medical Examination id missing'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(medexId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid medical examination id'}), {status: 400});
        }

        const result = await MedicalExamination.findOneAndUpdate(
            { _id: new Types.ObjectId(medexId) },
            { deletedAt: new Date() },
            { new: true }
        )

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete medical examination form'}), {status: 400});
        }

        const medex = await MedicalExamination.find({ deletedAt: null }).populate('patient');
        return new NextResponse(JSON.stringify({message: 'OK', medex: medex}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}