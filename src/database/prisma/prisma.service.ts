import { PrismaClient, UserModel } from '.prisma/client';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { DatabaseServiceInterface } from '../database.service.interface';

@injectable()
export class PrismaService implements DatabaseServiceInterface<PrismaClient> {
	readonly client: PrismaClient;

	constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Database is connected');
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error('[PrismaService] Database connection is invalid');
			}
		}
	}

	async disconnect(): Promise<void> {
		try {
			this.client.$disconnect();
			this.logger.log('[PrismaService] Database is disconnected');
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error('[PrismaService] Database disconnect is invalid');
			}
		}
	}
}
