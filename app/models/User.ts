// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  emailVerified: boolean;
  role: string;
  verification_code: string;
  verifiedAt: Date;
  profile_image: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  emailVerified: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  verification_code: String,
  verifiedAt: Date,
  profile_image: String,
});

// Export Mongoose model or create one if it doesn't exist
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
