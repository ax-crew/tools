import type { AxFunction } from '@ax-llm/ax';
import type { GoogleServiceConfig } from './types';

/**
 * Gmail search functionality for AxCrew.
 * Enables searching through Gmail messages using Gmail's search query syntax.
 * 
 * @example Configuration:
 * ```typescript
 * const config: GoogleOAuth2Config = {
 *   credentials: {
 *     accessToken: 'your_access_token',
 *     refreshToken: 'your_refresh_token'
 *   }
 * };
 * const gmailSearch = new GmailSearch(config);
 * ```
 */
export class GmailSearch {
  private config: GoogleServiceConfig;
  public state: any;

  constructor(config: GoogleServiceConfig) {
    this.config = config;
  }

  /**
   * Creates a function that searches Gmail emails.
   * @returns {AxFunction} A function that searches Gmail using query strings
   */
  toFunction(): AxFunction {
    return {
      name: 'GmailSearch',
      description: `Search google workspace emails using the Gmail search query format. For example, "from:john@example.com" or "is:unread" or "label:inbox" or "after:2025/01/01" or a combination of these.`,
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Gmail search query'
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
          const response = await fetch(`${googleServiceApiUrl}/service/google/gmail/search`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: query })
          });

          if (!response.ok) {
            throw new Error(`Gmail search failed: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            messages: data.messages || [],
            resultSizeEstimate: data.resultSizeEstimate || 0
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

/**
 * Gmail email sending functionality for AxCrew.
 * Enables sending emails through Gmail using OAuth2 authentication.
 * 
 * @example Configuration:
 * ```typescript
 * const config: GoogleOAuth2Config = {
 *   credentials: {
 *     accessToken: 'your_access_token',
 *     refreshToken: 'your_refresh_token'
 *   }
 * };
 * const gmailSend = new GmailSend(config);
 * ```
 */
export class GmailSend {
  private config: GoogleServiceConfig;
  public state: any;

  constructor(config: GoogleServiceConfig) {
    this.config = config;
  }

  toFunction(): AxFunction {
    return {
      name: 'GmailSend',
      description: 'Send an email using Gmail',
      parameters: {
        type: 'object',
        properties: {
          from: {
            type: 'string',
            description: 'Email address of the sender'
          },
          to: {
            type: 'string',
            description: 'Email address of the recipient'
          },
          subject: {
            type: 'string',
            description: 'Subject of the email'
          },
          body: {
            type: 'string',
            description: 'Body of the email'
          }
        },
        required: ['from', 'to', 'subject', 'body']
      },
      func: async ({ from, to, subject, body }) => {
        const { refreshToken, googleServiceApiUrl } = this.config;
        
        function createEmail(from: string, to: string, subject: string, messageText: string): string {
          const emailLines = [
            `From: ${from}`,
            `To: ${to}`,
            'Content-Type: text/plain; charset="UTF-8"',
            'MIME-Version: 1.0',
            `Subject: ${subject}`,
            '',
            messageText
          ];
          return emailLines.join('\r\n');
        }
        
        const rawEmail = createEmail(from, to, subject, body);
        const encodedEmail = Buffer.from(rawEmail)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        try {
          const response = await fetch(`${googleServiceApiUrl}/service/google/gmail/send`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${refreshToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              raw: encodedEmail
            })
          });

          if (!response.ok) {
            throw new Error(`Failed to send email: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            messageId: data.id,
            threadId: data.threadId,
            labelIds: data.labelIds
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
