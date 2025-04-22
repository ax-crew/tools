import type { AxFunction } from '@ax-llm/ax';
import type { GoogleServiceConfig } from './types';

/**
 * Google Drive search functionality for AxCrew.
 * Enables searching through Drive files using Drive's search query syntax.
 * 
 * @example Configuration:
 * ```typescript
 * const config: GoogleServiceConfig = {
 *   credentials: {
 *     accessToken: 'your_access_token',
 *     refreshToken: 'your_refresh_token'
 *   }
 * };
 * const driveSearch = new DriveSearch(config);
 * ```
 */
export class DriveSearch {
  private config: GoogleServiceConfig;
  public state: any;

  constructor(config: GoogleServiceConfig, state: any) {
    this.config = config;
    this.state = state;
  }

  /**
   * Creates a function that searches Google Drive files.
   * @returns {AxFunction} A function that searches Drive using query strings
   */
  toFunction(): AxFunction {
    return {
      name: 'DriveSearch',
      description: 'Search Google Drive files using Drive query syntax. For example, "name contains \'budget\'" or "mimeType = \'application/pdf\'" or "modifiedTime > \'2024-01-01\'".',
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
        const { accessToken, refreshToken } = this.config.credentials;
        const googleServiceApiUrl = this.state.get('googleServiceApiUrl');

        if (!googleServiceApiUrl) {
          throw new Error('Google service API URL not configured in your crew state');
        }

        if (!accessToken) {
          throw new Error('Google service Access token is not configured');
        }

        try {
          const response = await fetch(`${googleServiceApiUrl}/service/google/drive/files`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              q: query,
              fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)'
            })
          });

          if (!response.ok) {
            throw new Error(`Drive search failed: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            files: data.files || [],
            nextPageToken: data.nextPageToken
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          };
        }
      }
    };
  }
}

export class DriveList {
  private config: GoogleServiceConfig;
  public state: any;

  constructor(config: GoogleServiceConfig, state: any) {
    this.config = config;
    this.state = state;
  }

  public toFunction(): AxFunction {
    return {
      name: 'DriveList',
      description: 'List all files in your Google Drive account',
      func: async () => {
        const { accessToken } = this.config.credentials;
        const googleServiceApiUrl = this.state.get('googleServiceApiUrl');

        try {
          const response = await fetch(`${googleServiceApiUrl}/drive/v3/files`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)',
              pageSize: 100,
              orderBy: 'modifiedTime desc'
            })
          });

          if (!response.ok) {
            throw new Error(`Failed to list Drive files: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            files: data.files || [],
            nextPageToken: data.nextPageToken
          };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
          };
        }
      }
    };
  }
}
