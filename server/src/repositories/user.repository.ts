import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { UserModel, type UserDocument } from '../models';

interface CreateUserAttrs {
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
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
}
