import {
  Allow,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { File } from 'src/files/entities/file.entity';
import { Language } from 'src/utils/constant/language.constant';
import { KeywordDto, PaginationDto } from 'src/utils/dto/pagination.dto';

import { IntersectionType } from '@nestjs/swagger';

import { UserStatus, UserType } from './entities/user.entity';

export class UserLoginSNSDto {
  @IsNotEmpty()
  @IsIn(Object.values(UserType))
  userType: string;

  @IsNotEmpty()
  @IsString()
  socialToken: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(Language))
  language: Language = Language.Kor;

  @IsOptional()
  @IsString()
  deviceToken: string;
}

export class UserRegister {
  @IsNotEmpty()
  @IsIn(Object.values(UserType))
  userType: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  nickname: string;
}

export class UserLogin {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(Language))
  language: Language = Language.Kor;

  @IsOptional()
  @IsString()
  deviceToken: string;
}

export class UserUpdateUsername {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  username: string;
}

export class UserUpdateProfile {
  @IsOptional()
  @IsString()
  @MinLength(1)
  username: string;

  @IsOptional()
  avatar: File;

  @IsOptional()
  @IsString()
  @MinLength(1)
  introduction: string;

  @IsOptional()
  receiveNotification: boolean;

  @IsOptional()
  receiveNotificationMarketing: boolean;
}

export class UserVerifyPassAppDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  impUid: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  merchantUid: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  phoneNumber: string;
}

export class UserVerifyPassAppForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  impUid: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  merchantUid: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(1)
  email: string;
}

export class UserForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  uuid: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  password: string;
}

export class GetUsersDto extends IntersectionType(PaginationDto, KeywordDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @Allow()
  @IsIn([...Object.values(UserStatus), null, ''])
  status: string;
}

export class GetUsersFollowDto extends IntersectionType(
  PaginationDto,
  KeywordDto,
) {
  @IsOptional()
  username: string;
}

export class GetUsersBlockDto extends IntersectionType(
  PaginationDto,
  KeywordDto,
) {
  @IsOptional()
  status: number;
}
