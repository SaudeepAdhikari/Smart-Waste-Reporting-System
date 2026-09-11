import { Schema, Types, type HydratedDocument } from 'mongoose';

export const USER_MODEL = 'User';

export interface User {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'CITIZEN';
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = new Schema<User>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CITIZEN'], default: 'CITIZEN' },
  },
  { timestamps: true, collection: 'users', versionKey: false }
);
