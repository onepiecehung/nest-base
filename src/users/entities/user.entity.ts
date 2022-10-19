import { instanceToPlain } from 'class-transformer';
import { WithTimestamp } from 'src/utils/entity/BaseEntity';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { File } from '../../files/entities/file.entity';
import { UserDevice } from './userDevice.entity';

import { genSaltSync, hashSync } from 'bcrypt';

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
  Creator = 'CREATOR',
  Any = 'ANY',
}

export enum UserType {
  Email = 'EMAIL',
  Google = 'GOOGLE',
  Kakao = 'KAKAO',
  Naver = 'NAVER',
  Apple = 'APPLE',
}

export enum UserStatus {
  Active = 'ACTIVE',
  Block = 'BLOCK',
  Removed = 'REMOVED',
  CancelMembership = 'CANCEL_MEMBERSHIP',
}

export enum StepRegister {
  registered = 'REGISTERED',
  verifiedPhoneNumber = 'VERIFIED_PHONE_NUMBER',
  verifiedEmail = 'VERIFIED_EMAIL',
  verifiedNickname = 'VERIFIED_NICKNAME',
}

@Entity()
export class User extends WithTimestamp {
  @BeforeInsert()
  hashPassword(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    if (_this.password) {
      const salt = genSaltSync(10);
      _this.password = hashSync(_this.password, salt);
    }
  }

  @Index()
  @Column({
    type: 'enum',
    enum: [
      UserRole.User,
      UserRole.Admin,
      UserRole.SuperAdmin,
      UserRole.Creator,
    ],
    default: UserRole.User,
  })
  role: UserRole;

  @Index()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: StepRegister,
    default: StepRegister.registered,
  })
  stepRegister: StepRegister;

  @Index()
  @Column({ type: 'enum', enum: UserType, default: UserType.Email })
  userType: UserType;

  @Column('varchar', { length: 255, nullable: true })
  email: string;

  @Column('longtext', { nullable: true })
  nickname: string;

  @Column('longtext', { nullable: true })
  username: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dob: Date;

  // allow receive notification
  @Column('boolean', { default: true })
  receiveNotification: boolean;

  // allow receive notification marketing
  @Column('boolean', { default: true })
  receiveNotificationMarketing: boolean;

  @Column('longtext', { nullable: true })
  socialId: string;

  @Column('varchar', { length: 65, nullable: true })
  phoneNumber: string;

  @Column('varchar', { length: 255, nullable: true })
  password: string;

  @Column('varchar', { length: 255, nullable: true })
  introduction: string;

  @OneToMany(() => UserDevice, (userDevice) => userDevice.user)
  deviceToken: UserDevice[];

  @OneToOne(() => File, {
    // eager: true,
    nullable: true,
    // lazy: true,
  })
  @JoinColumn()
  avatar: File;

  toJSON() {
    const result = instanceToPlain(this);
    delete result.password;
    delete result.nickname;
    return result;
  }
}
