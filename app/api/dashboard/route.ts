import connect from "@/lib/connect";
import PatientLog from "@/app/models/PatientLog";
import Post from "@/app/models/Post";
import Appointment from "@/app/models/Appointment";
import Records from "@/app/models/Records";
import { NextResponse } from "next/server";
import Patient from "@/app/models/Patient";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        let logs = {};
        let apps = {};
        let meds = {};
        let records = {};
        await connect();

        if (!email) {
            logs = await PatientLog.find({ deletedAt: null }).populate('patient');
            apps = await Appointment.find({ deletedAt: null }).populate('patient');
            meds = await PatientLog.aggregate([
                { $unwind: "$findings" }, // Unwind the symptoms array
                { $addFields: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } } },
                {
                    $group: {
                    _id: { findings: "$findings", year: "$year", month: "$month" },
                    count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        findings: "$_id.findings",
                        year: "$_id.year",
                        month: "$_id.month",
                        count: 1,
                        _id: 0,
                    },
                },
            ]);
            records = await Records.find();
        } else {
            const patientOne = await Patient.findOne({ email: email });
            logs = await PatientLog.find({ patient: patientOne?._id, deletedAt: null }).populate('patient');
            apps = await Appointment.findOne({ patient: patientOne?._id, deletedAt: null, schedule: { $gte: new Date() } }).sort({ schedule: -1 });
            records = await Records.find();
        }
        const posts = await Post.find({ deletedAt: null }).sort({ createdAt: -1 });
        const patient = await Patient.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', posts: posts, logs: logs, appointment: apps, patient: patient, records: records, meds: meds}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}