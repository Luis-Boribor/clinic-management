import connect from "@/lib/connect";
import User from "@/app/models/User";
import Patient from "@/app/models/Patient";
import { NextResponse } from "next/server";
import { EmailTemplate } from "@/app/components/AuthOTP";
import { Resend } from "resend";
import bcryptjs from "bcryptjs";

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
        const body = await request.json();
        await connect();
        const salt = await bcryptjs.genSalt(10);
        const code_pass = generateOTP();
        
        const hashedPassword = await bcryptjs.hash(body?.password, salt);
        const newUser = new User({
            ...body,
            name: body?.first_name + ' ' + body?.middle_name + ' ' + body?.last_name + ' ' + body?.extension,
            password: hashedPassword,
            verification_code: code_pass,
        });
        await newUser.save();
        if (!newUser) {
            return new NextResponse(JSON.stringify({message: 'Failed to create new user'}), {status: 400});
        }

        const fullName = body?.first_name+' '+body?.middle_name+' '+body?.last_name+' '+body?.extension;
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [body?.email],
            subject: 'OTP Verification',
            react: EmailTemplate({ full_name: fullName, otp: code_pass }),
        });

        if (error) {
            return new NextResponse(JSON.stringify({message: error}), {status: 500});
        }
        await Patient.create(body);
        return new NextResponse(JSON.stringify({message: 'OK', user: newUser}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}