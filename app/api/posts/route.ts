import connect from "@/lib/connect";
import Post from "@/app/models/Post";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const posts = await Post.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', posts: posts}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();

        const post = new Post(body);
        await post.save();

        if (!post) {
            return new NextResponse(JSON.stringify({message: 'Failed to post announcement'}), {status: 400});
        }
        const posts = await Post.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', posts: posts}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}