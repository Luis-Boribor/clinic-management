import connect from "@/lib/connect";
import PatientLog from "@/app/models/PatientLog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Patient from "@/app/models/Patient";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        let logs = {};
        await connect();

        if (!email) {
            logs = await PatientLog.find({ deletedAt: null });
        } else {
            const patient = await Patient.findOne({ email: email });
            logs = await PatientLog.find({ patient: patient?._id, deletedAt: null }).populate('patient');
        }

        return new NextResponse(JSON.stringify({message: 'OK', logs: logs}), {status: 200});
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
        const logId = searchParams.get('log_id');

        if (!logId) {
            return new NextResponse(JSON.stringify({message: 'Missing patient id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(logId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid patient id'}), {status: 400});
        }

        const result = await PatientLog.findOneAndUpdate(
            { _id: new Types.ObjectId(logId) },
            { deletedAt: new Date() },
            { new: true }
        )

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete patient log'}), {status: 400});
        }

        const logs = await PatientLog.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', logs: logs}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}