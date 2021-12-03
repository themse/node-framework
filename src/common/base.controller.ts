import { LoggerService } from '../logger/logger.service';
import { Router, Response } from 'express';
import { RouteInterface } from './route.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly router: Router;

	constructor(private logger: LoggerService) {
		this.router = Router();
	}

	getRouter(): Router {
		return this.router;
	}

	send<T>(res: Response, code: number, message: T): Response {
		return res.status(code).json(message);
	}

	ok<T>(res: Response, message: T): Response {
		return this.send<T>(res, 200, message);
	}

	protected bindRoutes(routes: RouteInterface[]): void {
		routes.forEach((route) => {
			this.logger.log(`[${route.method}]: ${route.path}`);

			const middlewares = route.middlewares?.map((m) => m.execute.bind(m)) ?? [];
			const handler = route.handler.bind(this);

			const pipeline = middlewares.length > 0 ? [...middlewares, handler] : handler;
			this.router[route.method](route.path, pipeline);
		});
	}
}
