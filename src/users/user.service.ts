import { inject, injectable } from 'inversify';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserServiceInterface } from './user.service.interface';
import 'reflect-metadata';

@injectable()
export class UserService implements UserServiceInterface {
	constructor(@inject(TYPES.ConfigService) private configService: ConfigServiceInterface) {}

	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const newUser = new User(dto.email, dto.name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(dto.password, +salt);

		return newUser ?? null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
