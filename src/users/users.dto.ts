import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
