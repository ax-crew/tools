import type { AxFunction } from '@ax-llm/ax';
import { drive_v3, google } from '@googleapis/drive';

export interface DriveConfig {
  credentials: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken: string;
  };
}

export function createDriveSearchFunction(config: DriveConfig): AxFunction {
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
      const auth = new google.auth.OAuth2(
        config.credentials.clientId,
        config.credentials.clientSecret,
        config.credentials.redirectUri
      );
      
      auth.setCredentials({
        refresh_token: config.credentials.refreshToken
      });

      const drive = google.drive({ version: 'v3', auth });
      
      const response = await drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, webViewLink)'
      });

      return response.data;
    }
  };
}