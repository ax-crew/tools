import type { AxFunction } from '@ax-llm/ax';
import { drive } from '@googleapis/drive';
import { google } from 'googleapis';
import type { Config } from '../../common/src/config';

export interface DriveConfig extends Config {
  credentials: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken: string;
  };
}

export class DriveSearch {
  private config: DriveConfig;
  private state: any;

  constructor(config: DriveConfig, state: any) {
    this.config = config;
    this.state = state;
  }

  toFunction(): AxFunction {
    return {
      name: 'DriveSearch',
      description: 'Search Google Drive files',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Drive search query'
          }
        },
        required: ['query']
      },
      func: async ({ query }) => {
        // Resolve credentials: use values from config; fallback to state.env if missing.
        const clientId = this.config.credentials.clientId || (this.state?.env && this.state.env.DRIVE_CLIENT_ID);
        const clientSecret = this.config.credentials.clientSecret || (this.state?.env && this.state.env.DRIVE_CLIENT_SECRET);
        const redirectUri = this.config.credentials.redirectUri || (this.state?.env && this.state.env.DRIVE_REDIRECT_URI);
        const refreshToken = this.config.credentials.refreshToken || (this.state?.env && this.state.env.DRIVE_REFRESH_TOKEN);
        
        if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
          throw new Error("Missing required Drive credentials. Please provide clientId, clientSecret, redirectUri, and refreshToken either in the config or in state.env (expected keys: DRIVE_CLIENT_ID, DRIVE_CLIENT_SECRET, DRIVE_REDIRECT_URI, DRIVE_REFRESH_TOKEN).");
        }

        const auth = new google.auth.OAuth2(
          clientId,
          clientSecret,
          redirectUri
        );

        auth.setCredentials({
          refresh_token: refreshToken
        });

        const driveClient = google.drive({
          version: 'v3',
          auth
        });
        
        const response = await driveClient.files.list({
          q: query,
          fields: 'files(id, name, mimeType, webViewLink)'
        });

        return response.data;
      }
    };
  }
}