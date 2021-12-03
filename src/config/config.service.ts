import { ConfigServiceInterface } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { LoggerInterface } from '../logger/logger.interface';
import 'reflect-metadata';

@injectable()
export class ConfigService implements ConfigServiceInterface {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error("[ConfigService] Cannot read the file .env, may it's not existed");
		} else {
			this.logger.log('[ConfigService] Config is downloaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
