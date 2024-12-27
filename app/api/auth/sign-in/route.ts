import connect from "@/lib/connect";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { createSigner } from "fast-jwt";

export const POST = async (request: Request) => {
    try {
        const { email, password } = await request.json();
        await connect();
        const user = await User.findOne({ email: email });
        if (!user) {
            return new NextResponse(JSON.stringify({message: 'Invalid email'}), {status: 401});
        }
        if (!await bcryptjs.compare(password, user.password)) {
            return new NextResponse(JSON.stringify({message: 'Wrong password'}), {status: 401});
        }
        const tokenData = {
            id: user._id,
            email: user.email,
            position: user.position,
        }
        const signer = createSigner({ key: process.env.SECRET_KEY });
        const token = signer(tokenData);
        const response = NextResponse.json({
            message: 'OK',
            user: user
        });
        const now = new Date();
        now.setMinutes(now.getMinutes() + 60);
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        if (user.role === 'admin') {
            response.cookies.set('admin-token', token, { httpOnly: true, expires: now });
        } else {
            response.cookies.set('user-token', token, { httpOnly: true, expires: now });
        }
        return response;
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}