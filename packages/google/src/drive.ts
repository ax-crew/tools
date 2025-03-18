import type { AxFunction } from '@ax-llm/ax';
import { google } from 'googleapis';
import type { DriveConfig } from './types';

/**
 * Google Drive search functionality for AxCrew.
 * Enables searching through Drive files using Drive's search query syntax.
 * 
 * @example Configuration:
 * ```typescript
 * const config: DriveConfig = {
 *   credentials: {
 *     clientId: 'your_client_id',
 *     clientSecret: 'your_client_secret',
 *     redirectUri: 'your_redirect_uri',
 *     refreshToken: 'your_refresh_token'
 *   }
 * };
 * const driveSearch = new DriveSearch(config);
 * ```
 */
export class DriveSearch {
  private config: DriveConfig;

  constructor(config: DriveConfig) {
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
        const { clientId, clientSecret, redirectUri, refreshToken } = this.config.credentials;

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
          fields: 'files(id, name, mimeType, webViewLink, modifiedTime, size)'
        });

        return response.data;
      }
    };
  }
}