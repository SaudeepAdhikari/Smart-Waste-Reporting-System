import { Request } from 'express';
import type { AuthenticatedUser } from '../../middleware/jwt.strategy';

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
