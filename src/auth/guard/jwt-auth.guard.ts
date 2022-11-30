import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StepRegister } from 'src/users/entities/user.entity';
import { MESSAGE_CODE } from 'src/utils/config/message.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, jwtDecode, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !jwtDecode) {
      throw err || new UnauthorizedException();
    }

    // console.log(jwtDecode);

    const { user } = jwtDecode;

    // console.log(user);

    if (user.stepRegister !== StepRegister.registered) {
      throw new HttpException(
        {
          messageCode: MESSAGE_CODE.USER_NOT_COMPLETED_REGISTRATION,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return jwtDecode;
  }
}
