# @ax-crew/tools-google

Google service integrations for AxCrew agents, including Gmail and Google Drive capabilities.

## Installation

```bash
npm install @ax-crew/tools-google
```

## Features

### Gmail Integration

```typescript
import { GmailSearch, GmailSend, GmailConfig } from '@ax-crew/tools-google';

// Configure Gmail credentials
const config: GmailConfig = {
  credentials: {
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'your_redirect_uri',
    refreshToken: 'your_refresh_token'
  }
};

// Create Gmail instances
const gmailSearch = new GmailSearch(config);
const gmailSend = new GmailSend(config);

// Register with AxCrew
const customFunctions = {
  GmailSearch: gmailSearch.toFunction(),
  GmailSend: gmailSend.toFunction()
};
```

### Google Drive Integration

```typescript
import { DriveSearch, DriveConfig } from '@ax-crew/tools-google';

// Configure Drive credentials
const config: DriveConfig = {
  credentials: {
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'your_redirect_uri',
    refreshToken: 'your_refresh_token'
  }
};

// Create Drive instance
const driveSearch = new DriveSearch(config);

// Register with AxCrew
const customFunctions = {
  DriveSearch: driveSearch.toFunction()
};
const crew = new AxCrew(AxCrewConfig, customFunctions);
```
