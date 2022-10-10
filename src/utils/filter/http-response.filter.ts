// import { ArgumentsHost, Injectable, ExecutionContext } from '@nestjs/common';

// import { Request, Response } from 'express';

// import { MESSAGE_CODE, MESSAGE_TEXT } from '../config/message.config';

// export interface IResponse {
//   statusCode: number;
//   message: {
//     code: number;
//     text: string;
//   };
//   data: any;
// }
// @Injectable()
// class HttpResponseFilter {
//   private statusCode: number;
//   private messageCode: number;
//   private message: string | number;

//   constructor() {
//     this.messageCode = MESSAGE_CODE.SUCCESS;
//   }
//   intercept(context: ExecutionContext) {}
//   public success(data: any) {
//     if (data.messageCode) {
//       this.message = MESSAGE_TEXT[this.messageCode];
//     }
//     return {};
//   }
// }
