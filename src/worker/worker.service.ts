import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkerService {
  testRABBIT(id: number) {
    return `This action removes a #${id} worker`;
  }
}
