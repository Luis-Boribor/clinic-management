import fs from "fs";
import path from "path";
import mime from "mime-types";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import Patient from "@/app/models/Patient";
import { Types } from "mongoose";
import User from "@/app/models/User";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const fileName = searchParams.get('fileName');
        if (!fileName) {
            return new NextResponse(
                JSON.stringify({ message: 'Missing filename' }),
                { status: 400 }
            );
        }

        const imagePath = path.join(process.cwd(), 'app', 'profile-image', fileName);

        if (!fs.existsSync(imagePath)) {
            return new NextResponse(
                JSON.stringify({ message: 'File not found' }),
                { status: 404 }
            );
        }

        const mimeType = mime.lookup(imagePath);
        if (!mimeType || !['image/png', 'image/jpeg', 'image/jpg'].includes(mimeType)) {
            return new NextResponse(
                JSON.stringify({ message: 'Unsupported file type' }),
                { status: 400 }
            );
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const response = new NextResponse(imageBuffer, { status: 200 });
        response.headers.set('Content-Type', mimeType);
        return response;
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const POST = async (request: Request) => {
    const formData = await request.formData();
  
    const file = formData.get("image");
    const patientId = formData.get("patient_id");
    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No files received or invalid file." }, { status: 400 });
    }

    if (!patientId || typeof patientId !== "string") {
        return NextResponse.json({ error: "No patient ID provided." }, { status: 400 });
    }

    if (!Types.ObjectId.isValid(patientId)) {
        return new NextResponse(JSON.stringify({message: "Invalid patient ID"}), { status: 400 });
    }
  
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = path.extname(file.name); 
    const filename = Date.now().toString() + extension;
    
    try {
        await writeFile(
            path.join(process.cwd(), "app", "profile-image", filename),
            buffer
        );
        const patient = await Patient.findOneAndUpdate(
            { _id: patientId },
            { profile_image: filename },
            { new: true }
        );
        await User.findOneAndUpdate(
            { email: patient?.email },
            { profile_image: filename },
            { new: true }
        );
        return NextResponse.json({ Message: "Success", fileName: filename, status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}