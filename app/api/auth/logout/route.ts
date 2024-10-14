import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const response = NextResponse.json({message: 'OK'}, {status: 200});
        response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
        return response;
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}