import { Request, Response, NextFunction } from 'express';
import { MiddleWareInterface } from './middleware.interface';
import { HttpError } from '../errors/http-error.class';

export class AuthGuard implements MiddleWareInterface {
	execute(req: Request, res: Response, next: NextFunction): void | Promise<void> {
		if (req.user) {
			return next();
		}
		return next(new HttpError(401, "You're not authorized"));
	}
}
