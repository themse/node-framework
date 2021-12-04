import { Container } from 'inversify';
import 'reflect-metadata';
import casual from 'casual';
import { UserModel } from '@prisma/client';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserServiceInterface } from './user.service.interface';
import { UserService } from './user.service';
import { TYPES } from '../types';
import { User } from './user.entity';

const ConfigServiceMock: ConfigServiceInterface = {
	get: jest.fn(),
};

const UserRepositoryMock: UserRepositoryInterface = {
	create: jest.fn(),
	findOne: jest.fn(),
};

const container = new Container();
let configService: ConfigServiceInterface;
let userRepository: UserRepositoryInterface;
let userService: UserServiceInterface;
let createdUser: UserModel | null = null;

const mockUser = {
	email: casual.email,
	name: casual.full_name,
	password: casual.password,
	id: casual.integer(0),
};

beforeAll(() => {
	container.bind<UserServiceInterface>(TYPES.UserService).to(UserService);
	container.bind<ConfigServiceInterface>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<UserRepositoryInterface>(TYPES.UserRepository).toConstantValue(UserRepositoryMock);

	configService = container.get<ConfigServiceInterface>(TYPES.ConfigService);
	userRepository = container.get<UserRepositoryInterface>(TYPES.UserRepository);
	userService = container.get<UserServiceInterface>(TYPES.UserService);
});

describe('UserService', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		userRepository.create = jest.fn().mockImplementationOnce((user: User) => {
			return {
				name: user.getName(),
				email: user.getEmail(),
				password: user.getPassword(),
				id: mockUser.id,
			};
		});

		createdUser = await userService.createUser(mockUser);
		expect(createdUser.id).toEqual(mockUser.id);
		expect(createdUser.password).not.toEqual(mockUser.password);
	});

	it('validateUser: User does not exist', async () => {
		userRepository.findOne = jest.fn().mockReturnValueOnce(null);

		const isExist = await userService.validateUser({
			email: mockUser.email,
			password: mockUser.password,
		});

		expect(isExist).toBeFalsy();
	});

	it('validateUser: User exists', async () => {
		userRepository.findOne = jest.fn().mockReturnValueOnce(createdUser);
		const isExist = await userService.validateUser({
			email: mockUser.email,
			password: mockUser.password,
		});

		expect(isExist).toBeTruthy();
	});

	it('validateUser: Wrong Password', async () => {
		userRepository.findOne = jest.fn().mockReturnValueOnce(createdUser);
		const isExist = await userService.validateUser({
			email: mockUser.email,
			password: casual.password,
		});

		expect(isExist).toBeFalsy();
	});
});
