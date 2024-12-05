import connect from "@/lib/connect";
import Consultation from "@/app/models/Consultation";
import PatientLog from "@/app/models/PatientLog";
import MedicalRecord from "@/app/models/MedicalRecord";
import Records from "@/app/models/Records";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const consultationId = searchParams.get('consultation_id');
        await connect();
        if (consultationId) {
            if (!Types.ObjectId.isValid(consultationId)) {
                return new NextResponse(JSON.stringify({message: 'Invalid consultation id'}), {status: 400});
            }
            const consultation = await Consultation.findOne({ _id: consultationId }).populate('patient');
            return new NextResponse(JSON.stringify({message: 'OK', consultation: consultation}), {status: 200});
        }
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
        const record = await MedicalRecord.create({
            patient: body?.patient,
            consultation: consultation._id,
            consultation_type: 'consultation',
            findings: consultation?.current_illness,
        });
        for (let index = 0; index < consultation.current_illness.length; index++) {
            const element = consultation.current_illness[index];
            const year = new Date(consultation.createdAt).getFullYear();
            const month = new Date(consultation.createdAt).getMonth();
            const oldRecord = await Records.findOne({ findings: element, month: month, year: year });
            if (!oldRecord) {
                await Records.create(
                    {
                        findings: element,
                        year: year,
                        month: month,
                        count: 1
                    }
                );
            }
            else {
                await Records.findOneAndUpdate(
                    { _id: oldRecord._id },
                    { count: (oldRecord.count + 1) },
                    { new: true }
                );
            }
        }
        return new NextResponse(JSON.stringify({message: 'OK', record: record}), {status: 200});
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