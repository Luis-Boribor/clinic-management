import connect from "@/lib/connect";
import Appointment from "@/app/models/Appointment";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const result = await Appointment.create(body);
        if (!result) {
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