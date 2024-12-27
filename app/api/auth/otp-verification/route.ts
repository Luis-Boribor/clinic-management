import { EmailTemplate } from "@/app/components/AuthOTP";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { Types } from "mongoose";
import connect from "@/lib/connect";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(length: number = 6): string {
    const digits: string = '0123456789';
    let otp: string = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

export const POST = async (request: Request) => {
    try {
        const { name, email } = await request.json();
        const code_pass = generateOTP();
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'OTP Verification',
            react: EmailTemplate({ full_name: name, otp: code_pass }),
        });

        if (error) {
            return new NextResponse(JSON.stringify({message: error}), {status: 500});
        }

        const updateUser = await User.findOneAndUpdate(
            { email: email },
            { verification_code: code_pass },
            { new: true }
        );

        if (!updateUser) {
            return new NextResponse(JSON.stringify({message: 'Failed to update user'}), {status: 500});
        }

        return new NextResponse(JSON.stringify({message: 'OK', data: data}), {status: 200});
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
        const { code_pass } = await request.json();
        const userId = searchParams.get('user_id');

        if (!userId) {
            return new NextResponse(JSON.stringify({message: 'Missing user id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid user id'}), {status: 400});
        }

        await connect();
        const user = await User.findOne({ _id: userId });
        if (user?.verification_code !== code_pass) {
            return new NextResponse(JSON.stringify({message: 'Invalid verification code'}), {status: 400});
        }

        const result = await User.findOneAndUpdate(
            { _id: userId },
            { verifiedAt: new Date(), emailVerified: true },
            { new: true }
        );
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to verify email'}), {status: 500});
        }

        return new NextResponse(JSON.stringify({message: 'OK', user: result}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}