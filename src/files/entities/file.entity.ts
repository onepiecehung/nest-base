import { WithTimestamp } from 'src/utils/entity/BaseEntity';
import { Column, Entity, Index } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

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

  toJSON() {
    const result = instanceToPlain(this);
    delete result.key;
    delete result.path;
    delete result.originalName;
    delete result.size;
    delete result.fileType;
    delete result.user;
    return result;
  }
}
