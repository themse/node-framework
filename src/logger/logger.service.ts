import { injectable } from 'inversify';
import { Logger } from 'tslog';
import 'reflect-metadata';
import { LoggerInterface } from './logger.interface';

@injectable()
export class LoggerService implements LoggerInterface {
	logger: Logger;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
