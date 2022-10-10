import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  public async get(
    url: string,
    configuration?: AxiosRequestConfig,
  ): Promise<any> {
    return lastValueFrom(
      this.httpService.get(url, configuration).pipe(
        map((res) => {
          return res || null;
        }),
      ),
    );
  }
}
