import type { AxFunction } from '@ax-llm/ax';
import fetch from 'node-fetch';
import https from 'https';
import type { WordPressConfig } from './types';

/**
 * WordPress post creation functionality for AxCrew.
 * Allows creating and publishing posts to a WordPress site via the WordPress REST API.
 * 
 * @example Configuration:
 * ```typescript
 * const config: WordPressConfig = {
 *   credentials: {
 *     url: 'your_wordpress_url',
 *     username: 'your_username',
 *     password: 'your_application_password'
 *   }
 * };
 * const wordPressPost = new WordPressPost(config);
 * ```
 */
export class WordPressPost {
  private config: WordPressConfig;

  constructor(config: WordPressConfig) {
    this.config = config;
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
        const { url, username, password } = this.config.credentials;
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
  
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false
        });

        try {
          const response = await fetch(`${url}/wp-json/wp/v2/posts`, {
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