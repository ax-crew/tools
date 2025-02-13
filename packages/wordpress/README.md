# @ax-crew/tools-wordpress

WordPress integration for AxCrew agents, enabling automated content management and site administration.

## Installation

```bash
npm install @ax-crew/tools-wordpress
```

## Features

```typescript
import { WordPressPost } from '@ax-crew/tools-wordpress';
```

### Configuration

Add the following environment variables to your AxCrew state. For example:
```typescript
crew.state.set('env', {
  WORDPRESS_URL: 'your_wordpress_url',
  WORDPRESS_USERNAME: 'your_username',
  WORDPRESS_PASSWORD: 'your_application_password'
});
```
