import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiPrefixMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Add 'api' prefix to all routes if not already present
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + req.url;
    }
    next();
  }
}