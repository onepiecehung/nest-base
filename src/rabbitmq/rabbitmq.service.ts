import { JOB_NAME } from 'src/worker/worker.constant';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(@Inject('WORKER_SERVICE') private client: ClientProxy) {}

  async testRmq(): Promise<boolean> {
    try {
      await this.client.emit(JOB_NAME.TEST_RABBIT, {
        test: `${new Date().toLocaleDateString()}`,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
