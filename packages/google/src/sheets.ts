import type { AxFunction } from '@ax-llm/ax';
import type { GoogleServiceConfig } from './types';

/**
 * Google Sheets functionality for AxCrew.
 * Enables listing all sheets within a Google Spreadsheet.
 * 
 * @example Configuration:
 * ```typescript
 * const config: GoogleServiceConfig = {
 *   credentials: {
 *     accessToken: 'your_access_token',
 *     refreshToken: 'your_refresh_token'
 *   }
 * };
 * const sheetsLister = new ListSheets(config);
 * ```
 */
export class ListSheets {
  private config: GoogleServiceConfig;
  public state: any;

  constructor(config: GoogleServiceConfig, state: any) {
    this.config = config;
    this.state = state;
  }

  /**
   * Creates a function that lists all sheets within a Google Spreadsheet.
   * @returns {AxFunction} A function that returns a list of sheet names
   */
  toFunction(): AxFunction {
    return {
      name: 'ListSheets',
      description: 'List all sheets within a Google Spreadsheet',
      parameters: {
        type: 'object',
        properties: {
          spreadsheet_id: {
            type: 'string',
            description: 'The ID of the spreadsheet'
          }
        },
        required: ['spreadsheet_id']
      },
      func: async ({ spreadsheet_id }) => {
        const { accessToken } = this.config.credentials;
        const googleServiceApiUrl = this.state.get('googleServiceApiUrl');

        if (!googleServiceApiUrl) {
          throw new Error('Google service API URL not configured in your crew state');
        }

        if (!accessToken) {
          throw new Error('Google service Access token is not configured');
        }

        try {
          const response = await fetch(`${googleServiceApiUrl}/service/google/sheets/sheets/?spreadsheet_id=${spreadsheet_id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to list sheets: ${response.statusText}`);
          }

          const data = await response.json();
          return data;
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
