import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UuidMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    Object.assign(req.query, { uuid: uuidv4() });
    next();
  }
}
