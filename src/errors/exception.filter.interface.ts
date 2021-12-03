import { Request, Response, NextFunction } from 'express';

export interface ExceptionFilterInterface {
	catch(err: Error, req: Request, res: Response, next: NextFunction): void;
}
