import { Schema, Types, type HydratedDocument } from 'mongoose';
import {
  ALL_ROLES,
  type UserRole,
  DEFAULT_ROLE,
} from '../constants/roles';

export const USER_MODEL = 'User';

export interface User {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
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
    role: {
      type: String,
      enum: [...ALL_ROLES],
      default: DEFAULT_ROLE,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'users', versionKey: false }
);