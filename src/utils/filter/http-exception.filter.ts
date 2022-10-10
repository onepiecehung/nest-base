import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const text: string | object | any = exception.getResponse();
    // console.log(exception);
    response.status(status).json({
      statusCode: status,
      message: {
        code: status,
        text: typeof text === 'string' ? text : text.message,
        name: exception.name,
      },
      request: {
        method: request.method,
        path: request.url,
        data: {
          params: request.params,
          query: request.query,
          body: request.body,
        },
      },
    });
  }
}
