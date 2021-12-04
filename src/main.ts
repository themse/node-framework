import { PrismaClient } from '.prisma/client';
import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { ConfigServiceInterface } from './config/config.service.interface';
import { DatabaseServiceInterface } from './database/database.service.interface';
import { PrismaService } from './database/prisma/prisma.service';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerInterface } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/user.controller';
import { UserControllerInterface } from './users/user.interface';
import { UserRepository } from './users/user.repository';
import { UserRepositoryInterface } from './users/user.repository.interface';
import { UserService } from './users/user.service';
import { UserServiceInterface } from './users/user.service.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<LoggerInterface>(TYPES.Logger).to(LoggerService).inSingletonScope();
	bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<UserControllerInterface>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<UserServiceInterface>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<DatabaseServiceInterface<PrismaClient>>(TYPES.DatabaseService)
		.to(PrismaService)
		.inSingletonScope();
	bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

async function bootstrap(): Promise<{ appContainer: Container; app: App }> {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	await app.init();

	return { appContainer, app };
}

export const boot = bootstrap();
