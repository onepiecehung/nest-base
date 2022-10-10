import { Cache } from 'cache-manager-ioredis';

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  create(createTestDto: CreateTestDto) {
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
