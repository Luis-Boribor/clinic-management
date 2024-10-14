import connect from "@/lib/connect";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const salt = await bcryptjs.genSalt(10);
        
        const hashedPassword = await bcryptjs.hash(body?.password, salt);
        const newUser = new User({
            ...body,
            password: hashedPassword
        });
        await newUser.save();

        return new NextResponse(JSON.stringify({message: 'OK', user: newUser}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}