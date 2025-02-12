import type { AxFunction } from '@ax-llm/ax';

export class WordPressPost {
  private state: any;

  constructor(state: any) {
    this.state = state;
  }

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
            })
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(`WordPress API error: ${error}`);
          }

          const post = await response.json();
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
