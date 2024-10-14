// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: string;
  emailVerified: boolean;
  provider: string;
  role: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  emailVerified: { type: Boolean, default: false },
  provider: { type: String, required: true }, 
  role: { type: String, default: 'user' },
});

// Export Mongoose model or create one if it doesn't exist
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
