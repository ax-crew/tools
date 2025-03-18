import { AxToolBaseConfig } from '../../core/src';

export interface WordPressCredentials {
  url: string;
  username: string;
  password: string;
}

export interface WordPressConfig extends AxToolBaseConfig {
  credentials: WordPressCredentials;
} 