import { AxToolBaseConfig } from '../../core/src';

export interface GoogleOAuth2Credentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

export interface GoogleServiceConfig extends AxToolBaseConfig {
  credentials: GoogleOAuth2Credentials;
}

// Type aliases for specific services to maintain API compatibility
export type GmailConfig = GoogleServiceConfig;
export type DriveConfig = GoogleServiceConfig; 