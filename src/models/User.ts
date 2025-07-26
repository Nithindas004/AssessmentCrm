import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  role: 'admin' | 'salesperson';
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'salesperson'], default: 'salesperson' },
}, { timestamps: true });

export default models.User || mongoose.model<IUser>('User', UserSchema);