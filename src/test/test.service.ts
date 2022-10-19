import { Cache } from 'cache-manager-ioredis';

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { JOB_NAME } from 'src/worker/worker.constant';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('WORKER_SERVICE') private client: ClientProxy,
  ) {}
  async create(createTestDto: CreateTestDto) {
    // await this.client.connect();
    // await this.client.emit(JOB_NAME.TEST_RABBIT, { test: "this's emit" });
    return { test: 'This action adds a new test' };
  }

  async findAll() {
    const config = await this.cacheManager.store.keys();
    // const config = await this.cacheManager.store.get('mykey');
    const test = await this.cacheManager.get('mykey');

    console.log('mykey', test, config);
    return { test: test };
  }

  findOne(id: number) {
    return `This action returns a #${id} test`;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }
}
