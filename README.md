# AxCrew Tools

[AxCrew](https://github.com/amitdeshmukh/ax-crew) is a framework for building and managing teams of AI agents powered by [AxLLM](https://axllm.dev). This repository contains official tools and integrations that extend AxCrew's capabilities, allowing agents to interact with various external services.

- The tools are published as separate npm packages and can be installed individually.
- All tools are compatible with [AxCrew](https://github.com/amitdeshmukh/ax-crew) as well as [AxLLM](https://axllm.dev).

## 🚀 Features

- **Gmail Integration**: Search, send, and manage emails programmatically
- **Google Drive Integration**: File management and search capabilities
- **WordPress Integration**: Content management and site administration
- **Extensible Architecture**: Easy to add new integrations and tools
- **Configuration**: All tools define a configuration interface that can be used to configure the tool.

## 📦 Installation

Install individual packages based on your needs:

```bash
# Install specific tools
npm install @ax-crew/tools-google
npm install @ax-crew/tools-wordpress

```

## 🛠️ Available Tools

### Google (`@ax-crew/tools-google`)
Powerful Google API integration enabling agents to:
- Search and filter emails
- Send and reply to messages
- Search and manage Drive files

```typescript
import { GmailSearch, GmailConfig } from '@ax-crew/tools-google';

const config: GmailConfig = {
  credentials: {
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'your_redirect_uri',
    refreshToken: 'your_refresh_token'
  }
};

const gmailSearch = new GmailSearch(config);
```

### WordPress (`@ax-crew/tools-wordpress`)
WordPress site management featuring:
- Content publishing and management
- Post creation with full HTML support

```typescript
import { WordPressPost, WordPressConfig } from '@ax-crew/tools-wordpress';

const config: WordPressConfig = {
  credentials: {
    url: 'your_wordpress_url',
    username: 'your_username',
    password: 'your_application_password'
  }
};

const wordPressPost = new WordPressPost(config);
```

## 🧑‍💻 Development

This project uses a monorepo structure managed with npm workspaces. Each tool is maintained as a separate package in the `packages/` directory.

### Contributing

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes
```bash
git commit -m 'Add amazing feature'
```
4. Push to your branch
```bash
git push origin feature/amazing-feature
```
5. Open a Pull Request

### Publishing

#### Individual Packages
```bash
cd packages/<package-name>
npm version patch  # or minor/major
npm publish --access public
```

#### All Packages
```bash
npm run publish-packages
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- Documentation: [docs.axcrew.dev](https://docs.axcrew.dev)
- Issues: [GitHub Issues](https://github.com/ax-crew/tools/issues)
- Discussions: [GitHub Discussions](https://github.com/ax-crew/tools/discussions)

