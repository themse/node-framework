import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../types';
import { ExceptionFilterInterface } from './exception.filter.interface';
import { HttpError } from './http-error.class';

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
	constructor(@inject(TYPES.Logger) private readonly logger: LoggerInterface) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`Status: ${err.statusCode} ${err.message}`);
			res.status(err.statusCode).send({
				error: err.message,
			});
			return;
		}

		this.logger.error(err.message);
		res.status(500).send({
			error: err.message,
		});
		return;
	}
}
