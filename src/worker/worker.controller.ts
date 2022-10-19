import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { JOB_NAME } from './worker.constant';

import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern(JOB_NAME.TEST_RABBIT)
  testRmq(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      console.log('testRmq', data);
      channel.ack(originalMsg);
    } catch (error) {
      console.log(error);
      channel.nack(originalMsg);
    }
  }
}
