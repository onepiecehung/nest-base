import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async loginSNS({ socialId, userType, language, deviceToken }): Promise<User> {
    let user = await this.userRepository.findOne({
      where: {
        socialId,
        userType,
      },
    });

    if (!user) {
      user = this.userRepository.create({
        socialId,
        userType,
      });
      await this.userRepository.save(user);
    }
    return user;
  }
}
