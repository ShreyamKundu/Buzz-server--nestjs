import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Response, Request, NextFunction } from 'express';

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies.userId) {
      const newUserId = uuidv4();
      res.cookie('userId', newUserId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: false,  
        sameSite: 'strict', 
      });
    }
    next();
  }
}
