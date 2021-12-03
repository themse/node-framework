import { PrismaClient } from '.prisma/client';
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ConfigServiceInterface } from './config/config.service.interface';
import { DatabaseServiceInterface } from './database/database.service.interface';
import { ExceptionFilterInterface } from './errors/exception.filter.interface';
import { LoggerInterface } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/user.controller';
import { UserControllerInterface } from './users/user.interface';

@injectable()
export class App {
	server: Server;
	app: Express;
	port: number;

	constructor(
		@inject(TYPES.Logger) private logger: LoggerInterface,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilterInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.DatabaseService) private databaseService: DatabaseServiceInterface<PrismaClient>,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(bodyParser.json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.getRouter());
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.databaseService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log('Server is alive', this.port);
	}
}
