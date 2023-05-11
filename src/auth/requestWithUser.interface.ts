
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

 
interface RequestWithUser extends Request {
  user: any;
}
 
export default RequestWithUser;