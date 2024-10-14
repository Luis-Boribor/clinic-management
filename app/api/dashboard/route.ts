import connect from "@/lib/connect";
import PatientLog from "@/app/models/PatientLog";
import Post from "@/app/models/Post";
import Appointment from "@/app/models/Appointment";
import { NextResponse } from "next/server";
import Patient from "@/app/models/Patient";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        let logs = {};
        let apps = {};
        await connect();

        if (!email) {
            logs = await PatientLog.find({ deletedAt: null }).populate('patient');
            apps = await Appointment.find({ deletedAt: null }).populate('patient');
        } else {
            const patient = await Patient.findOne({ email: email });
            logs = await PatientLog.find({ patient: patient?._id, deletedAt: null }).populate('patient');
            apps = await Appointment.findOne({ patient: patient?._id, deletedAt: null, schedule: { $gte: new Date() } }).sort({ schedule: -1 });
        }
        const posts = await Post.find({ deletedAt: null });
        const patient = await Patient.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', posts: posts, logs: logs, appointment: apps, patient: patient}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}