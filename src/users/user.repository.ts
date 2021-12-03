import { UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma/prisma.service';
import { TYPES } from '../types';
import { User } from './user.entity';
import { UserRepositoryInterface } from './user.repository.interface';

@injectable()
export class UserRepository implements UserRepositoryInterface {
	constructor(@inject(TYPES.DatabaseService) private prismaService: PrismaService) {}

	async create(user: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email: user.getEmail(),
				password: user.getPassword(),
				name: user.getName(),
			},
		});
	}

	async findOne(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
