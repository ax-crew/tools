import type { AxFunction } from '@ax-llm/ax';
import { gmail } from '@googleapis/gmail';
import { google } from 'googleapis';
import type { GmailConfig } from './types';

/**
 * Gmail search functionality for AxCrew.
 * Enables searching through Gmail messages using Gmail's search query syntax.
 * 
 * @example Configuration:
 * ```typescript
 * const config: GmailConfig = {
 *   credentials: {
 *     clientId: 'your_client_id',
 *     clientSecret: 'your_client_secret',
 *     redirectUri: 'your_redirect_uri',
 *     refreshToken: 'your_refresh_token'
 *   }
 * };
 * const gmailSearch = new GmailSearch(config);
 * ```
 */
export class GmailSearch {
  private config: GmailConfig;

  constructor(config: GmailConfig) {
    this.config = config;
  }

  /**
   * Creates a function that searches Gmail emails.
   * @returns {AxFunction} A function that searches Gmail using query strings
   */
  toFunction(): AxFunction {
    return {
      name: 'GmailSearch',
      description: `Search Gmail emails using the same query format as Gmail search. For example, "from:john@example.com" or "is:unread" or "label:inbox" or "after:2025/01/01" or a combination of these.`,
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
        const { clientId, clientSecret, redirectUri, refreshToken } = this.config.credentials;

        const auth = new google.auth.OAuth2(
          clientId,
          clientSecret,
          redirectUri
        );

        auth.setCredentials({
          refresh_token: refreshToken
        });

        const gmailClient = gmail({
          version: 'v1',
          auth
        });
        
        const response = await gmailClient.users.messages.list({
          userId: 'me',
          q: query
        });

        return response.data;
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
 * const config: GmailConfig = {
 *   credentials: {
 *     clientId: 'your_client_id',
 *     clientSecret: 'your_client_secret',
 *     redirectUri: 'your_redirect_uri',
 *     refreshToken: 'your_refresh_token'
 *   }
 * };
 * const gmailSend = new GmailSend(config);
 * ```
 */
export class GmailSend {
  private config: GmailConfig;

  constructor(config: GmailConfig) {
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
        const { clientId, clientSecret, redirectUri, refreshToken } = this.config.credentials;

        const auth = new google.auth.OAuth2(
          clientId,
          clientSecret,
          redirectUri
        );

        auth.setCredentials({
          refresh_token: refreshToken
        });

        const gmailClient = gmail({
          version: 'v1',
          auth
        });
        
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

        const response = await gmailClient.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedEmail
          }
        });
        
        return response.data;
      }
    };
  }
}
