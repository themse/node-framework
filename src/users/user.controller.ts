import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { sign, SignOptions } from 'jsonwebtoken';
import { promisify } from 'util';

import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HttpError } from '../errors/http-error.class';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserControllerInterface } from './user.interface';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UserServiceInterface } from './user.service.interface';

@injectable()
export class UserController extends BaseController implements UserControllerInterface {
	constructor(
		@inject(TYPES.Logger) private loggerService: LoggerInterface,
		@inject(TYPES.UserService) private userService: UserServiceInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				handler: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				handler: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/info',
				method: 'post',
				handler: this.info,
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isValid = await this.userService.validateUser(req.body);
		if (!isValid) {
			return next(new HttpError(401, 'User is unauthorized. Email or password is wrong'));
		}
		const jwt = await this.signJwt(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(req.body);
		if (!result) {
			return next(new HttpError(422, 'Account is exist. Try another one'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, { email: user });
	}

	// TODO do we really need it here?
	private async signJwt(email: string, secret: string): Promise<string> {
		const payload = {
			email,
			iat: Math.floor(Date.now() / 1000),
		};
		const options: SignOptions = { algorithm: 'HS256' };
		const signAsync = promisify<typeof payload, string, SignOptions, string>(sign);

		try {
			const token = await signAsync(payload, secret, options);

			return token;
		} catch (err) {
			this.loggerService.error(`[Sign JWT] ${err}`);
		}
	}
}
