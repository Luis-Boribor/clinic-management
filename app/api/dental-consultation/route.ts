import connect from "@/lib/connect";
import DentalConsultation from "@/app/models/DentalConsultation";
import MedicalRecord from "@/app/models/MedicalRecord";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const result = await DentalConsultation.create(body);
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to create new dental consultation'}), {status: 400});
        }
        await MedicalRecord.create({
            dental_consultation: result,
            patient: body?.patient,
            consultation_type: 'dental-consultation',
        });
        return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}