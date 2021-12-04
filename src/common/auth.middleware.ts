import { verify, JwtPayload } from 'jsonwebtoken';
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';
import { MiddleWareInterface } from './middleware.interface';

export class AuthMiddleware implements MiddleWareInterface {
	constructor(private secret: string) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.headers.authorization) {
			const jwt = req.headers.authorization.split(' ')[1];
			const verifyAsync = promisify<string, string, JwtPayload>(verify);
			try {
				const payload = await verifyAsync(jwt, this.secret);
				req.user = payload.email;
			} catch (err) {
				next();
			}
		} else {
			next();
		}
	}
}
