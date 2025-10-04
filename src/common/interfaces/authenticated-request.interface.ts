import { Request } from 'express';
import { JwtPayload } from 'src/auth/auth.dto';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
