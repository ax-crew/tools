import type { AxFunction } from '@ax-llm/ax';
import { gmail } from '@googleapis/gmail';
import { google } from 'googleapis';

export class GmailSearch {
  private state: any;

  constructor(state: any) {
    this.state = state;
  }

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
        const env = this.state.get('env');
        
        const clientId = env?.GMAIL_CLIENT_ID;
        const clientSecret = env?.GMAIL_CLIENT_SECRET;
        const redirectUri = env?.GMAIL_REDIRECT_URI;
        const refreshToken = env?.GMAIL_REFRESH_TOKEN;
                
        if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
          throw new Error(`Missing required Gmail credentials in environment variables. Please provide GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI, and GMAIL_REFRESH_TOKEN. Got clientId: ${clientId}, clientSecret: ${clientSecret}, redirectUri: ${redirectUri}, refreshToken: ${refreshToken}`);
        }

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

export class GmailSend {
  private state: any;

  constructor(state: any) {
    this.state = state;
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
        // Use state.get() to retrieve env values
        const env = this.state.get('env');
        
        const clientId = env?.GMAIL_CLIENT_ID;
        const clientSecret = env?.GMAIL_CLIENT_SECRET;
        const redirectUri = env?.GMAIL_REDIRECT_URI;
        const refreshToken = env?.GMAIL_REFRESH_TOKEN;
        
        if (!clientId || !clientSecret || !redirectUri || !refreshToken) {
          throw new Error(`Missing required Gmail credentials in environment variables. Please provide GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI, and GMAIL_REFRESH_TOKEN. Got clientId: ${clientId}, clientSecret: ${clientSecret}, redirectUri: ${redirectUri}, refreshToken: ${refreshToken}`);
        }

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
        
        // Helper function to create a MIME compliant email (RFC 2822)
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
        
        // Build the raw email message
        const rawEmail = createEmail(from, to, subject, body);

        // Encode the raw email to base64 and convert to base64url format.
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
