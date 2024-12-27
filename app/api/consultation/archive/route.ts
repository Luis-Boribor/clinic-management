import connect from "@/lib/connect";
import Consultation from "@/app/models/Consultation";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const consultation = await Consultation.find({ deletedAt: { $ne: null } }).populate('patient');
        return new NextResponse(JSON.stringify({message: 'OK', consultation: consultation}), {status: 200});
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
            return new NextResponse(JSON.stringify({message: 'Missing consultation id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(consultationId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid consultation id'}), {status: 400});
        }

        await connect();
        const result = await Consultation.findOneAndUpdate(
            { _id: consultationId },
            { deletedAt: null },
            { new: true }
        );

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore consultation'}), {status: 400});
        }
        const consultation = await Consultation.find({ deletedAt: { $ne: null } }).populate('patient');
        return new NextResponse(JSON.stringify({message: 'OK', consultation: consultation}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const consultationId = searchParams.get('consultation_id');

        if (!consultationId) {
            return new NextResponse(JSON.stringify({message: 'Missing consultation id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(consultationId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid consultation id'}), {status: 400});
        }

        await connect();
        const result = await Consultation.findByIdAndDelete(consultationId);

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete consultation'}), {status: 400});
        }
        const consultation = await Consultation.find({ deletedAt: { $ne: null } }).populate('patient');
        return new NextResponse(JSON.stringify({message: 'OK', consultation: consultation}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}