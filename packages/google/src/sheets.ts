import type { AxFunction } from '@ax-llm/ax';
import type { GoogleServiceConfig } from './types';

/**
 * Google Sheets functionality for AxCrew.
 * Enables listing all sheets within a Google Spreadsheet.
 * 
 * @example Configuration:
 * ```typescript
 * const config: GoogleServiceConfig = {
 *     accessToken: 'your_access_token',
 *     refreshToken: 'your_refresh_token',
 *     googleServiceApiUrl: 'http://localhost:8080'
 * };
 * const sheetsLister = new ListSheets(config);
 * ```
 */
export class ListSheets {
  private config: GoogleServiceConfig;

  constructor(config: GoogleServiceConfig) {
    this.config = config;
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
        const { accessToken, googleServiceApiUrl } = this.config;

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

/**
 * Google Sheets functionality for AxCrew.
 * Enables retrieving data from a specific sheet and range within a Google Spreadsheet.
 * 
 * @example Configuration:
 * ```typescript
 * const config: GoogleServiceConfig = {
 *     accessToken: 'your_access_token',
 *     refreshToken: 'your_refresh_token',
 *     googleServiceApiUrl: 'http://localhost:8080'
 * };
 * const dataGetter = new GetData(config);
 * ```
 */
export class GetData {
  private config: GoogleServiceConfig;

  constructor(config: GoogleServiceConfig) {
    this.config = config;
  }

  /**
   * Creates a function that retrieves data from a specific sheet and range within a Google Spreadsheet.
   * @returns {AxFunction} A function that returns the sheet data
   */
  toFunction(): AxFunction {
    return {
      name: 'GetData',
      description: 'Get data from a specific sheet and range within a Google Spreadsheet',
      parameters: {
        type: 'object',
        properties: {
          spreadsheet_id: {
            type: 'string',
            description: 'The ID of the spreadsheet'
          },
          sheetName: {
            type: 'string',
            description: 'The name of the sheet within the spreadsheet to get data from'
          },
          range: {
            type: 'string',
            description: 'The A1 notation range to get data from (e.g., "A1:B10"). If not provided, fetches all data.'
          }
        },
        required: ['spreadsheet_id', 'sheetName']
      },
      func: async ({ spreadsheet_id, sheetName, range }) => {
        const { accessToken, googleServiceApiUrl } = this.config;

        if (!googleServiceApiUrl) {
          throw new Error('Google service API URL not configured in your crew state');
        }

        if (!accessToken) {
          throw new Error('Google service Access token is not configured');
        }

        try {
          const queryParams = new URLSearchParams({
            spreadsheet_id,
            sheetName,
            ...(range && { range })
          });

          const response = await fetch(`${googleServiceApiUrl}/service/google/sheets/data/?${queryParams}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to get sheet data: ${response.statusText}`);
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
