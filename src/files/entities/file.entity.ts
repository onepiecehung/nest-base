import { WithTimestamp } from 'src/utils/entity/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

import { User } from '../../users/entities/user.entity';

export enum FileStatus {
  Inactivate = 'INACTIVATE',
  Active = 'ACTIVE',
  Deleted = 'DELETED',
}

@Entity()
export class File extends WithTimestamp {
  @Index()
  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.Inactivate,
  })
  status: FileStatus;

  @Column('text', { nullable: true })
  url: string;

  @Column('text', { nullable: true })
  key: string;

  @Column('text', { nullable: true })
  path: string;

  @Column('text', { nullable: true })
  originalName: string;

  @Column('int', { nullable: true })
  size: number;

  @Column('text', { nullable: true })
  fileType: string;

  @Column('int', { nullable: false })
  user: number;
}
