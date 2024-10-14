import connect from "@/lib/connect";
import MedicalRecord from "@/app/models/MedicalRecord";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const medex = await MedicalRecord.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', medex: medex}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}