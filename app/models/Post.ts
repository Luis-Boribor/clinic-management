import { Schema, models, model } from "mongoose";

interface IPost extends Document {
    content: string;
    // images: string[];
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>(
    {
        content: {
            type: String,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true
    }
)

const Post = models.Post || model('Post', postSchema);

export default Post;