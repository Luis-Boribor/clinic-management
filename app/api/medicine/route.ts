import connect from "@/lib/connect";
import Medicine from "@/app/models/Medicine";
import InventoryLog from "@/app/models/InventoryLog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const meds = await Medicine.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', medicines: meds}), {status: 200});
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
        const result = await Medicine.create(body);
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to create medicine'}), {status: 400});
        }
        const meds = await Medicine.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', medicines: meds}), {status: 200});
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
            { deletedAt: new Date() },
            { new: true }
        );
        
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to create medicine'}), {status: 400});
        }
        const meds = await Medicine.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', medicines: meds}), {status: 200});
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
        const medicineId = searchParams.get('medicine_id');
        const { quantity } = await request.json();

        if (!medicineId) {
            return new NextResponse(JSON.stringify({message: 'Missing medicine id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(medicineId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid medicine id'}), {status: 400});
        }
        await connect();
        const med = await Medicine.findOne({ _id: medicineId });
        const totalQuantity = med.stock + quantity;
        const result = await Medicine.findOneAndUpdate(
            { _id: medicineId },
            { stock: totalQuantity },
            { new: true }
        );

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to update stock'}), {status: 400});
        }
        const log = {
            medicine: medicineId,
            quantity: quantity,
        };
        await InventoryLog.create(log);
        const meds = await Medicine.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', medicines: meds}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}