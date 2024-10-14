import connect from "@/lib/connect";
import Patient from "@/app/models/Patient";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const id_number = searchParams.get('id_number');

        await connect();

        let patient;
        if (!id_number) {
            patient = await Patient.find({ deletedAt: null }); 
        } else {
            patient = await Patient.findOne({ id_number: id_number }); 
        }

        return new NextResponse(JSON.stringify({ message: 'OK', patient }), { status: 200 });
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, { status: 500 });
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const patient = new Patient(body);
        patient.save();
        if (!patient) {
            return new NextResponse(JSON.stringify({message: 'Failed to create patient'}), {status: 400});
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

export const PUT = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const patientId = searchParams.get('id_number');
        const body = await request.json();
        await connect();
        
        if (!await Patient.findOne({ id_number: patientId })) {
            return new NextResponse(JSON.stringify({message: 'Invalid patient id number'}), {status: 400});
        }

        const patient = await Patient.findOneAndUpdate(
            { id_number: patientId },
            body,
            { new: true }
        )
        if (!patient) {
            return new NextResponse(JSON.stringify({message: 'Failed to update patient'}), {status: 400});
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

export const PATCH = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const patientId = searchParams.get('patient_id');
        await connect();

        if (!patientId) {
            return new NextResponse(JSON.stringify({message: 'Missing patient id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(patientId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid patient id'}), {status: 400});
        }

        const patient = await Patient.findOneAndUpdate(
            { _id: patientId },
            { deletedAt: new Date() },
            { new: true }
        )

        if (!patient) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete patient'}), {status: 400});
        }

        const newPatients = await Patient.find({ deletedAt: null });

        return new NextResponse(JSON.stringify({messagae: 'OK', patient: newPatients}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}