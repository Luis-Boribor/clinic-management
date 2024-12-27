import connect from "@/lib/connect";
import Medicine from "@/app/models/Medicine";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const archive = await Medicine.find({ deletedAt: { $ne: null } });
        return new NextResponse(JSON.stringify({message: 'OK', archive: archive}), {status: 200});
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
        const medicineId = searchParams.get('medicine_id');
        
        if (!medicineId) {
            return new NextResponse(JSON.stringify({message: 'Missing medicine id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(medicineId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid medicine id'}), {status: 400});
        }
        await connect();
        const result = await Medicine.findOneAndUpdate(
            { _id: medicineId },
            { deletedAt: null },
            { new: true }
        );
        
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore medicine'}), {status: 400});
        }
        const archive = await Medicine.find({ deletedAt: { $ne: null } });
        return new NextResponse(JSON.stringify({message: 'OK', archive: archive}), {status: 200});
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
        const medicineId = searchParams.get('medicine_id');
        
        if (!medicineId) {
            return new NextResponse(JSON.stringify({message: 'Missing medicine id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(medicineId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid medicine id'}), {status: 400});
        }
        await connect();
        const result = await Medicine.findByIdAndDelete(medicineId);
        
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete medicine'}), {status: 400});
        }
        const archive = await Medicine.find({ deletedAt: { $ne: null } });
        return new NextResponse(JSON.stringify({message: 'OK', archive: archive}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}