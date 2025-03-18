# @ax-crew/tools-wordpress

WordPress integration for AxCrew agents, enabling automated content management and site administration.

## Installation
First ensure you have the [Basic Auth plugin](https://github.com/WP-API/Basic-Auth) installed on your WordPress site. Then install the package:

```bash
npm install @ax-crew/tools-wordpress
```

## Usage

```typescript
import { WordPressPost, WordPressConfig } from '@ax-crew/tools-wordpress';

// Configure WordPress credentials
const config: WordPressConfig = {
  credentials: {
    url: 'your_wordpress_url',
    username: 'your_username',
    password: 'your_application_password'
  }
};

// Create WordPress instance
const wordPressPost = new WordPressPost(config);

// Register with AxCrew
const customFunctions = {
  WordPressPost: wordPressPost.toFunction()
};
const crew = new AxCrew(AxCrewConfig, customFunctions);
```
