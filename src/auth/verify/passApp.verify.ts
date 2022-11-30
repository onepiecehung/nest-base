import axios from 'axios';
import * as qs from 'qs';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosService } from '../../utils/http/axios.service';

@Injectable()
export class PassAppAuthService {
  private readonly clientHost: string;
  private readonly impKey: string;
  private readonly impSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly axiosService: AxiosService,
  ) {
    this.clientHost = this.configService.get<string>('IMP_AUTH_ACCESS_LINK');
    this.impKey = this.configService.get<string>('IMP_KEY');
    this.impSecret = this.configService.get<string>('IMP_SECRET');
  }

  public async authenticate(
    impUid: string,
    merchantUid: string,
  ): Promise<any | { error: boolean }> {
    try {
      const data = qs.stringify({
        imp_key: `${this.impKey}`,
        imp_secret: `${this.impSecret}`,
      });

      const getToken: any = await axios({
        method: 'post',
        url: 'https://api.iamport.kr/users/getToken',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      });

      // console.log(getToken);

      const getVerification: any = await this.axiosService.get(
        `https://api.iamport.kr/certifications/${impUid}?_token=${getToken.data.response.access_token}`,
      );

      if (getVerification.data.code == 0) {
        if (getVerification.data.response.merchant_uid == merchantUid) {
          return getVerification.data;
        } else throw new Error('merchant_uid bot belongs to imp_uid');
      } else {
        throw new Error('Verification PassApp failed');
      }
    } catch (error) {
      console.error('PASS APP VERIFY FAIL: ', error);

      return { error: true };
    }
  }
}
