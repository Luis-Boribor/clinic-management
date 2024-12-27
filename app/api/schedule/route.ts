import connect from "@/lib/connect";
import Appointment from "@/app/models/Appointment";
import { NextResponse } from "next/server";
import Patient from "@/app/models/Patient";
import { Types } from "mongoose";

export const POST = async (request: Request) => {
    try {
        const { email, schedule, consultation_type } = await request.json();
        await connect();

        const patient = await Patient.findOne({ email: email });

        if (!patient) {
            return new NextResponse(JSON.stringify({message: 'Invalid email'}), {status: 400});
        }

        const appointment = new Appointment({ patient: patient._id, schedule: schedule, consultation_type: consultation_type });
        appointment.save();

        if (!appointment) {
            return new NextResponse(JSON.stringify({message: 'Failed to create schedule'}), {status: 400});
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

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        await connect();
        let schedule;
        if (!email) {
            schedule = await Appointment.find({ deletedAt: null }).populate('patient').exec();
            // return new NextResponse(JSON.stringify({message: 'OK',}), {status: 200});
        } else {
            const patient = await Patient.findOne({ email: email }).exec();
            if (!patient) {
                return new NextResponse(JSON.stringify({ message: 'Patient not found' }), { status: 404 });
            }
            schedule = await Appointment.find({ patient: patient._id });
        }

        return new NextResponse(JSON.stringify({message: 'OK', schedule: schedule}), {status: 200});
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
        const { searchParams } = new URL(request.url);
        const { status } = await request.json();
        const scheduleId = searchParams.get('schedule_id');

        if (!scheduleId) {
            return new NextResponse(JSON.stringify({message: 'Missing schedule id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(scheduleId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid schedule id'}), {status: 400});
        }

        await connect();
        const result = await Appointment.findOneAndUpdate(
            { _id: scheduleId },
            { status: status },
            { new: true }
        );
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to update schedule'}), {status: 500});
        }
        const apps = await Appointment.find({ deletedAt: null }).populate('patient');
        return new NextResponse(JSON.stringify({message: 'OK', schedule: apps}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}