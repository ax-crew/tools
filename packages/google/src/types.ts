import { AxToolBaseConfig } from '../../core/src';

export interface GoogleServiceConfig extends AxToolBaseConfig {
  accessToken: string;
  refreshToken: string;
  googleServiceApiUrl: string;
}
