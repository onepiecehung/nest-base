import { Request, Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { MESSAGE_TEXT } from '../config/message.config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    // eslint-disable-next-line prefer-const
    let text: string | object | any = exception.getResponse();

    console.log('===========> error: ', text);
    // console.log('text', text, typeof text);

    // eslint-disable-next-line prefer-const
    let messageCode = 0;

    if (typeof text === 'object') {
      const responseError: any = text.response;

      // console.log(responseError);
      if (text.hasOwnProperty('message')) {
        text = text.message;
        messageCode = status;
      }

      if (text?.hasOwnProperty('messageCode')) {
        // console.log(123);
        messageCode = text?.messageCode;
        text = MESSAGE_TEXT[messageCode];
      }
      // console.log(messageCode);
      // console.log(text);
      if (responseError?.hasOwnProperty('messageCode')) {
        // console.log(123);
        messageCode = responseError?.messageCode;
        text = MESSAGE_TEXT[messageCode];
      }

      if (responseError?.response) {
        const err = responseError.response;
        console.log(err);
        console.log(responseError);
        if (err.hasOwnProperty('message')) {
          text = err.message;
          messageCode = status;
        }

        if (responseError?.hasOwnProperty('messageCode')) {
          // console.log(123);
          messageCode = responseError?.messageCode;
          text = MESSAGE_TEXT[messageCode];
        }
        // console.log(messageCode);
        // console.log(text);
        if (err?.hasOwnProperty('messageCode')) {
          messageCode = err?.messageCode;
          text = MESSAGE_TEXT[messageCode];
        }
      }
    } else {
      messageCode = status;
    }
    // console.log(exception);
    response.status(status).json({
      statusCode: status,
      message: {
        code: messageCode,
        text: text,
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
