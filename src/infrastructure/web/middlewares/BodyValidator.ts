import type { NextFunction,Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateBody = (validatorFn: (body: any) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            validatorFn(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };
};
