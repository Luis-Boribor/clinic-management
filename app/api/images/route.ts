import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

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