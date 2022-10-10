import { instanceToPlain } from 'class-transformer';
import { WithTimestamp } from 'src/utils/entity/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

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
  name: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dob: Date;

  // allow receive notification
  @Column('boolean', { default: true })
  receiveNotification: boolean;

  @Column('longtext', { nullable: true })
  socialId: string;

  @Column('varchar', { length: 65, nullable: true })
  phoneNumber: string;

  @Column('varchar', { length: 255, nullable: true })
  password: string;

  toJSON() {
    const result = instanceToPlain(this);
    delete result.password;
    return result;
  }
}
