# AxCrew Tools

A collection of ready-to-use tools that help AI agents interact with popular services like Gmail, Google Drive, and WordPress. These tools are designed to work with [AxCrew](https://github.com/amitdeshmukh/ax-crew) and [AxLLM](https://axllm.dev) frameworks.

## What does it do?

These tools let your AI agents:
- Read and send emails through Gmail
- Manage files in Google Drive
- Create and manage WordPress content
- And more...

Think of it as giving your AI agents the ability to interact with real-world services, just like a human would.

## Quick Start

1. Install the tools you need:
```bash
# For Google services (Gmail, Drive)
npm install @ax-crew/tools-google

# For WordPress
npm install @ax-crew/tools-wordpress
```

2. Set up your tools with AxCrew:

```typescript
import { GmailSearch, GmailSend, DriveSearch } from '@ax-crew/tools-google';
import { AxCrew } from 'ax-crew';

// Configure Google services
const googleConfig = {
  credentials: {
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'your_redirect_uri',
    refreshToken: 'your_refresh_token'
  }
};

// Create service instances
const gmailSearch = new GmailSearch(googleConfig);
const gmailSend = new GmailSend(googleConfig);
const driveSearch = new DriveSearch(googleConfig);

// Register with AxCrew
const googleFunctions = {
  GmailSearch: gmailSearch.toFunction(),
  GmailSend: gmailSend.toFunction(),
  DriveSearch: driveSearch.toFunction()
};

// Your AxCrew configuration
const crew = new AxCrew(AxCrewConfig, googleFunctions);
```

```typescript
import { WordPressPost } from '@ax-crew/tools-wordpress';
import { AxCrew } from 'ax-crew';

// Configure WordPress
const wordPressConfig = {
  credentials: {
    url: 'https://your-site.com',
    username: 'your_username',
    password: 'your_application_password'  // Use application passwords, not your login password!
  }
};

// Create WordPress instance
const wordPressPost = new WordPressPost(wordPressConfig);

// Register with AxCrew
const wordPressFunctions = {
  WordPressPost: wordPressPost.toFunction()
};

// Your AxCrew configuration
const crew = new AxCrew(AxCrewConfig, wordPressFunctions);
```

3. Use the tools with AxLLM agents

```typescript
const ai = new AxAI({
    name: 'openai',
    apiKey: process.env['OPENAI_APIKEY'] ?? "",
});

// Create a model using the provider
const model = new AxAIProvider(ai);

const functions = [
  GmailSearch.toFunction()
]

export const gmailSearchAgent = new AxAgent({
  name: 'gmail-search',
  description:
    'Use this agent to search for emails',
  signature: `searchQuery: string -> emailList: string[] "A list of emails that match the search query"`,
  functions
})
```

## Available Tools

### @ax-crew/tools-google
- **Gmail**
  - Search emails by any criteria
  - Send new emails
  - Reply to threads
  - Manage labels and folders
- **Google Drive**
  - Search files
  - Upload/download files
  - Manage file permissions
  - Create/delete folders

### @ax-crew/tools-wordpress
- Post content to WordPress
- See `wordpress-example.ts` in the [examples](examples) folder

## Getting Help

- 📚 [Full Documentation](https://docs.axcrew.dev)
- 🐛 [Report Issues](https://github.com/ax-crew/tools/issues)
- 💬 [Ask Questions](https://github.com/ax-crew/tools/discussions)

## For Contributors

We use a monorepo structure with npm workspaces. Each tool lives in its own package under `packages/`.

```bash
# Clone and setup
git clone https://github.com/ax-crew/tools.git
cd tools
npm install

# Create a new feature
git checkout -b feature/your-feature
# Make your changes
git commit -m 'Add awesome feature'
git push origin feature/your-feature
# Open a Pull Request
```

## License

MIT - feel free to use in your projects! See [LICENSE](LICENSE) for details.

