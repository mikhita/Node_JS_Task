import { Request } from 'express';
import { UserDoc } from '../models/user';

interface CategoryRequest extends Request {
  user?: UserDoc,
  token?: String
}

export default CategoryRequest;