import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { MESSAGE_CODE, MESSAGE_TEXT } from '../config/message.config';

export interface IResponse<T> {
  data: T;
  message: any;
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  private statusCode: number;
  private messageCode: number;
  private message: string | number;

  constructor() {
    this.messageCode = MESSAGE_CODE.SUCCESS;
    this.message = MESSAGE_TEXT[this.messageCode];
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    this.statusCode = context.switchToHttp().getResponse<Response>().statusCode;
    return next.handle().pipe(
      map((data) => ({
        statusCode: this.statusCode,
        message: {
          code: this.messageCode,
          text: this.message,
        },
        data: data,
      })),
    );
  }
}
