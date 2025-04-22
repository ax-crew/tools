import { AxToolBaseConfig } from '../../core/src';

export interface GoogleOAuth2Credentials {
  accessToken: string;
  refreshToken: string;
}

export interface GoogleServiceConfig extends AxToolBaseConfig {
  credentials: GoogleOAuth2Credentials;
}
