import { instanceToPlain } from 'class-transformer';
import { WithTimestamp } from 'src/utils/entity/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

export enum UserPassAppStatus {
  Unused = 'UNUSED',
  Used = 'USED',
}

@Entity()
export class UserPassApp extends WithTimestamp {
  @Index()
  @Column({
    type: 'enum',
    enum: UserPassAppStatus,
    default: UserPassAppStatus.Unused,
  })
  status: UserPassAppStatus;

  @Column('varchar', { length: 255, nullable: false })
  impUid: string;

  @Column('varchar', { length: 255, nullable: false })
  merchantUid: string;

  @Column('int', { nullable: false })
  userId: number;

  toJSON() {
    const result = instanceToPlain(this);
    return result;
  }
}
