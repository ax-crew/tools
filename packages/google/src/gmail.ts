import type { AxFunction } from '@ax-llm/ax';
import type { GoogleServiceConfig } from './types';

export class GmailSearch {
  private config: GoogleServiceConfig;

  constructor(config: GoogleServiceConfig) {
    this.config = config;
  }

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
          throw new Error('Google service API URL not configured');
        }

        if (!accessToken) {
          throw new Error('Google service Access token is not configured');
        }

        try {
          const queryParams = new URLSearchParams({ q: query }).toString();
          const response = await fetch(`${googleServiceApiUrl}/service/google/gmail/search?${queryParams}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Gmail search failed: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            messages: data.messages || [],
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

export class GmailSend {
  private config: GoogleServiceConfig;

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
        required: ['to', 'subject', 'body']
      },
      func: async ({ to, subject, body }) => {
        const { accessToken, googleServiceApiUrl } = this.config;

        if (!googleServiceApiUrl) {
          throw new Error('Google service API URL not configured');
        }

        if (!accessToken) {
          throw new Error('Google service Access token is not configured');
        }

        try {
          const response = await fetch(`${googleServiceApiUrl}/service/google/gmail/send`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to,
              subject,
              body
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

export class GetGmailMessageById {
  private config: GoogleServiceConfig;

  constructor(config: GoogleServiceConfig) {
    this.config = config;
  }

  toFunction(): AxFunction {
    return {
      name: 'GetGmailMessageById',
      description: 'Retrieve an email from Gmail by messageId',
      parameters: {
        type: 'object',
        properties: {
          messageId: {
            type: 'string',
            description: 'Message Id of the email to retrieve'
          }
        },
        required: ['messageId']
      },
      func: async ({ messageId }) => {
        const { accessToken, googleServiceApiUrl } = this.config;

        if (!googleServiceApiUrl) {
          throw new Error('Google service API URL not configured');
        }

        if (!accessToken) {
          throw new Error('Google service Access token is not configured');
        }

        try {
          const response = await fetch(`${googleServiceApiUrl}/service/google/gmail/messages/${messageId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error(`Gmail search failed: ${response.statusText}`);
          }

          const data = await response.json();
          return {
            success: true,
            message: data
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
