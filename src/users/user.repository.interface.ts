import { UserModel } from '.prisma/client';
import { User } from './user.entity';

export interface UserRepositoryInterface {
	create(user: User): Promise<UserModel>;
	findOne(email: string): Promise<UserModel | null>;
}
