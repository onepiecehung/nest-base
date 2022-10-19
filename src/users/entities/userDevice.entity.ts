import { instanceToPlain } from 'class-transformer';
import { Language } from 'src/utils/constant/language.constant';
import { WithTimestamp } from 'src/utils/entity/BaseEntity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { User } from './user.entity';

export enum UserDeviceStatus {
  Active = 'ACTIVE',
  Logout = 'LOGOUT',
  Removed = 'REMOVED',
}

@Entity()
export class UserDevice extends WithTimestamp {
  @Index()
  @Column({
    type: 'enum',
    enum: UserDeviceStatus,
    default: UserDeviceStatus.Active,
  })
  status: UserDeviceStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: Language,
    default: Language.Kor,
  })
  language: Language;

  @Column('varchar', { length: 255, nullable: true })
  deviceToken: string;

  @Column('longtext', { nullable: true })
  uuid: string;

  @ManyToOne(() => User, (user) => user.deviceToken, { nullable: false })
  user: User;

  toJSON() {
    const result = instanceToPlain(this);
    return result;
  }
}
