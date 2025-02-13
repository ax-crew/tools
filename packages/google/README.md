# @ax-crew/tools-google

Google service integrations for AxCrew agents, including Gmail and Google Drive capabilities.

## Installation

```bash
npm install @ax-crew/tools-google
```

## Features

### Gmail Integration

```typescript
import { GmailSearch, GmailSend } from '@ax-crew/tools-google';
```

### Configuration

Add the following environment variables to your AxCrew state. For example:
```typescript
crew.state.set('env', {
  GMAIL_CLIENT_ID: 'your_client_id',
  GMAIL_CLIENT_SECRET: 'your_client_secret',
  GMAIL_REDIRECT_URI: 'your_redirect_uri',
  GMAIL_REFRESH_TOKEN: 'your_refresh_token'
});
```
