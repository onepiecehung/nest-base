import { instanceToPlain } from 'class-transformer';
import { WithTimestamp } from 'src/utils/entity/BaseEntity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { User } from './user.entity';

export enum UserAccessFrequencyStatus {
  Active = 'ACTIVE',
  Removed = 'REMOVED',
}

@Entity()
export class UserAccessFrequency extends WithTimestamp {
  @Index()
  @Column({
    type: 'enum',
    enum: UserAccessFrequencyStatus,
    default: UserAccessFrequencyStatus.Active,
  })
  status: UserAccessFrequencyStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  date: Date;

  @Column('int', { default: 1 })
  totalAccess: number;

  @Column('int', { nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.accessFrequency, { nullable: true })
  user: User;

  toJSON() {
    const result = instanceToPlain(this);
    return result;
  }
}
