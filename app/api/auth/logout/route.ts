import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from "@/lib/connect";
import User from "@/app/models/User";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');
        if (!userId) {
            return new NextResponse(JSON.stringify({message: 'Missing user id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid user id'}), {status: 400});
        }
        await connect();
        const user = await User.findOne({ _id: userId });
        const response = NextResponse.json({message: 'OK'}, {status: 200});
        if (user?.role==='admin') {
            response.cookies.set('admin-token', '', { httpOnly: true, expires: new Date(0) });
        } else {
            response.cookies.set('user-token', '', { httpOnly: true, expires: new Date(0) });
        }
        return response;
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}