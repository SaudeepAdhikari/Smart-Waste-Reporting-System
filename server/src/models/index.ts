import { Model, model } from 'mongoose';
import { type User, type UserDocument, UserSchema, USER_MODEL } from './user.schema';
import { type Report, type ReportDocument, ReportSchema, REPORT_MODEL } from './report.schema';

export const UserModel = model<User>(
  USER_MODEL,
  UserSchema
) as unknown as Model<UserDocument>;

export const ReportModel = model<Report>(
  REPORT_MODEL,
  ReportSchema
) as unknown as Model<ReportDocument>;

export { USER_MODEL, REPORT_MODEL };
export type { User, UserDocument, Report, ReportDocument };
