import { inject, injectable } from 'inversify';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserServiceInterface } from './user.service.interface';
import 'reflect-metadata';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserModel } from '.prisma/client';
import { compare } from 'bcryptjs';

@injectable()
export class UserService implements UserServiceInterface {
	constructor(
		@inject(TYPES.ConfigService)
		private configService: ConfigServiceInterface,
		@inject(TYPES.UserRepository)
		private userRepository: UserRepositoryInterface,
	) {}

	async createUser(dto: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(dto.email, dto.name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(dto.password, +salt);

		const existedUser = await this.userRepository.findOne(dto.email);

		return !existedUser ? await this.userRepository.create(newUser) : null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.findOne(dto.email);
		if (!existedUser) {
			return false;
		}
		return compare(dto.password, existedUser.password);
	}
}
