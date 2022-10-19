import {
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

import { UserType } from './entities/user.entity';

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
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
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
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
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
}
