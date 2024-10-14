import connect from "@/lib/connect";
import Consultation from "@/app/models/Consultation";
import PatientLog from "@/app/models/PatientLog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const consultations = await Consultation.find({ deletedAt: null }).populate('patient');
        const logs = await PatientLog.find({ deletedAt: null }).populate('patient');
        return new NextResponse(JSON.stringify({message: 'OK', consultation: consultations, logs: logs}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();

        if (!Types.ObjectId.isValid(body.patient)) {
            return new NextResponse(JSON.stringify({message: 'Invalid patient id'}), {status: 400});
        }

        const consultation = new Consultation(body);
        consultation.save();

        if (!consultation) {
            return new NextResponse(JSON.stringify({message: 'Failed to create consultation form'}), {status: 400});
        }
        await PatientLog.create({
            patient: new Types.ObjectId(body.patient),
            consultation_type: 'consultation',
            complaint: consultation.current_illness,
            findings: consultation.current_illness
        });
        return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
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
        const consultationId = searchParams.get('consultation_id');

        if (!consultationId) {
            return new NextResponse(JSON.stringify({message: 'Consultation id missing'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(consultationId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid consultation id'}), {status: 400});
        }

        const result = await Consultation.findOneAndUpdate(
            { _id: new Types.ObjectId(consultationId) },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete consultation form'}), {status: 400});
        }
    
        const consultations = await Consultation.find({ deletedAt: null }).populate('patient');
        return new NextResponse(JSON.stringify({message: 'OK', consultation: consultations}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}