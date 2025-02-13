import type { AxFunction } from '@ax-llm/ax';
import fetch from 'node-fetch';
import https from 'https';

/**
 * WordPress post creation functionality for AxCrew.
 * Allows creating and publishing posts to a WordPress site via the WordPress REST API.
 * 
 * @requires WordPress REST API credentials (URL, username, password) in environment variables
 * 
 */
export class WordPressPost {
  private state: any;

  constructor(state: any) {
    this.state = state;
  }

  /**
   * Creates a function that posts content to WordPress.
   * @returns {AxFunction} A function that creates a new WordPress post
   * 
   * @example
   * ```typescript
   * const result = await PostToWordPress({
   *   title: "My Blog Post",
   *   content: "<p>Hello World!</p>",
   *   status: "draft" // or "publish"
   * });
   * // Returns: { id: 123, url: "https://mysite.com/post", status: "draft" }
   * ```
   */
  toFunction(): AxFunction {
    return {
      name: 'PostToWordPress',
      description: 'Creates a new post on WordPress with the given title and content',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the WordPress post'
          },
          content: {
            type: 'string',
            description: 'The content of the WordPress post (can include HTML)'
          },
          status: {
            type: 'string',
            enum: ['draft', 'publish'],
            description: 'Whether to publish the post immediately or save as draft'
          }
        },
        required: ['title', 'content']
      },
      func: async ({ title, content, status = 'draft' }) => {
        const env = this.state.get('env');
        
        const wpUrl = env?.WORDPRESS_URL;
        const wpUsername = env?.WORDPRESS_USERNAME;
        const wpPassword = env?.WORDPRESS_PASSWORD;

        if (!wpUrl || !wpUsername || !wpPassword) {
          throw new Error(`Missing required WordPress credentials in environment variables. Please provide WORDPRESS_URL, WORDPRESS_USERNAME, and WORDPRESS_PASSWORD. Got url: ${wpUrl}, username: ${wpUsername}, password: ${wpPassword}`);
        }

        const auth = Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64');
  
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false
        });

        try {
          const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title,
              content,
              status
            }),
            agent: httpsAgent
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(`WordPress API error: ${error}`);
          }

          const post = await response.json() as {
            id: number;
            link: string;
            status: string;
          };
          return {
            id: post.id,
            url: post.link,
            status: post.status
          };        
        } catch (error: unknown) {
          throw new Error(`Failed to post to WordPress: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    };
  }
}
