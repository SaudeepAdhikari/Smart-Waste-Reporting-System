import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { UserModel, type UserDocument } from '../models';
import type { UserRole } from '../constants/roles';

interface CreateUserAttrs {
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role?: UserRole;
}

export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
}

export interface PaginatedUsers {
  items: UserDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UserRepository {
  private readonly userModel: Model<UserDocument> = UserModel;

  async create(data: CreateUserAttrs): Promise<UserDocument> {
    const created = new this.userModel(data);
    return created.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.userModel.findById(id).exec();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel
      .countDocuments({ email: email.toLowerCase() })
      .exec();
    return count > 0;
  }

  async updateActiveStatus(id: string, isActive: boolean): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { new: true, runValidators: true }
      )
      .exec();
  }

  async findMany(
    filters: UserFilters,
    options: { page: number; limit: number }
  ): Promise<PaginatedUsers> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(options.limit || 20, 100));
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (filters.role !== undefined) {
      query.role = filters.role;
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const [items, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(query).exec(),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return { items, total, page, limit, totalPages };
  }
}