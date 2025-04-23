import type { AxFunction } from '@ax-llm/ax';
import type { GoogleServiceConfig } from './types';

/**
 * Google Drive search functionality for AxCrew.
 * Enables searching through Drive files using Drive's search query syntax.
 * 
 * @example Configuration:
 * ```typescript
 * const config: GoogleServiceConfig = {
 *     accessToken: 'your_access_token',
 *     refreshToken: 'your_refresh_token',
 *     googleServiceApiUrl: 'http://localhost:8080'
 * };
 * const driveSearch = new DriveSearch(config);
 * ```
 */
export class DriveSearch {
  private config: GoogleServiceConfig;

  constructor(config: GoogleServiceConfig) {
    this.config = config;
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
        const { accessToken, googleServiceApiUrl } = this.config;

        if (!googleServiceApiUrl) {
          throw new Error('Google service API URL not configured in your crew state');
        }

        if (!accessToken) {
          throw new Error('Google service Access token is not configured');
        }

        try {
          const params = new URLSearchParams({
            q: query,
            fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)'
          });
          const response = await fetch(`${googleServiceApiUrl}/service/google/drive/files?${params}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
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

export class ListDriveFiles {
  private config: GoogleServiceConfig;
  public state: any;

  constructor(config: GoogleServiceConfig) {
    this.config = config;
  }

  public toFunction(): AxFunction {
    return {
      name: 'ListDriveFiles',
      description: 'List files in Google Drive with optional pagination and sorting. Returns most recently modified files by default.',
      parameters: {
        type: 'object',
        properties: {
          pageSize: {
            type: 'string',
            description: 'Number of files to return per page (max: 25)'
          },
        }
      },
      func: async ({ pageSize = '25' }) => {
        const { accessToken, googleServiceApiUrl } = this.config;

        if (!googleServiceApiUrl) {
          throw new Error('Google service API URL not configured in your crew state');
        }

        if (!accessToken) {
          throw new Error('Google service Access token is not configured');
        }

        try {
          const params = new URLSearchParams({
            fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
            pageSize
          });
          const response = await fetch(`${googleServiceApiUrl}/service/google/drive/files?${params}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
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
