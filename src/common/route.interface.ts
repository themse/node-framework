import { NextFunction, Request, Response, Router } from 'express';
import { MiddleWareInterface } from './middleware.interface';

export interface RouteInterface {
	path: string;
	handler: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
	middlewares?: MiddleWareInterface[];
}
