import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { writeFile } from "fs/promises"
import User from '@/app/models/User'
import { Types } from 'mongoose'

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const image = searchParams.get('filename');
        if (!image) {
            return new NextResponse(JSON.stringify({message: 'Missing filename'}), {status: 400});
        }
        const imagePath = path.join(process.cwd(), 'assets', 'images', image);
        const imageBuffer = fs.readFileSync(imagePath);
        const response = new NextResponse(imageBuffer, {status: 200});
        response.headers.set('Content-type', 'image/png');
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
    const uid = formData.get("uid");
    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No files received or invalid file." }, { status: 400 });
    }

    if (!uid || typeof uid !== "string") {
        return NextResponse.json({ error: "No user ID provided." }, { status: 400 });
    }

    if (!Types.ObjectId.isValid(uid)) {
        return new NextResponse(JSON.stringify({message: "Invalid user ID"}), { status: 400 });
    }
  
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = path.extname(file.name); 
    const filename = Date.now().toString() + extension;
    
    try {
        await writeFile(
            path.join(process.cwd(), "app", "profile-image", filename),
            buffer
        );
        await User.findOneAndUpdate(
            { _id: uid },
            { profile_image: filename },
            { new: true }
        );
        return NextResponse.json({ Message: "Success", fileName: filename, status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}