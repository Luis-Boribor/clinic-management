import connect from "@/lib/connect";
import Patient from "@/app/models/Patient";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const patients = await Patient.find({ deletedAt: { $ne: null } });

        return new NextResponse(JSON.stringify({message: 'OK', patient: patients}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message
        }
        return new NextResponse('ERROR: ' + message, {status: 500});
    }
}

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patient_id');
        await connect();

        if (!patientId) {
            return new NextResponse(JSON.stringify({message: 'Patient id is missing'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(patientId)) {
            return new NextResponse(JSON.stringify({message: 'Patient id is invalid'}), {status: 400});
        }

        const patient = await Patient.findOneAndUpdate(
            { _id: patientId },
            { deletedAt: null },
            { new: true }
        );

        if (!patient) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore patient'}), {status: 400});
        }

        const deletedPatients = await Patient.find({ deletedAt: { $ne: null } });

        return new NextResponse(JSON.stringify({message: 'OK', patient: deletedPatients}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message
        }
        return new NextResponse('ERROR: ' + message, {status: 500});
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patient_id');
        await connect();

        if (!patientId) {
            return new NextResponse(JSON.stringify({message: 'Patient id is missing'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(patientId)) {
            return new NextResponse(JSON.stringify({message: 'Patient id is invalid'}), {status: 400});
        }

        const patient = await Patient.findByIdAndDelete(patientId);

        if (!patient) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete patient'}), {status: 400});
        }

        const deletedPatients = await Patient.find({ deletedAt: { $ne: null } });

        return new NextResponse(JSON.stringify({message: 'OK', patient: deletedPatients}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message
        }
        return new NextResponse('ERROR: ' + message, {status: 500});
    }
}