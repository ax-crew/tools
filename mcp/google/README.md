# Google MCP Server

This is a Model Context Protocol (MCP) server implementation for Google services, providing tools for interacting with Google Drive and Gmail.

## Features

- Google Drive operations:
  - List files and folders
  - Upload files
  - Download files

- Gmail operations:
  - List messages
  - Send messages
  - Get message details

## Installation

```bash
pnpm install
```

## Usage

Start the server:

```bash
pnpm start
```

For development with auto-reload:

```bash
pnpm dev
```

## Available Tools

### Google Drive Tools

1. `google_drive_list_files`
   - Lists files and folders in Google Drive
   - Parameters:
     - `folderId`: ID of the folder to list (use "root" for root folder)
     - `pageSize`: Maximum number of files to return (default: 100)
     - `query`: Optional search query to filter files

2. `google_drive_upload_file`
   - Uploads a file to Google Drive
   - Parameters:
     - `name`: Name of the file to create
     - `content`: Content of the file
     - `mimeType`: MIME type of the file (default: text/plain)
     - `folderId`: Optional folder ID to upload to

3. `google_drive_download_file`
   - Downloads a file from Google Drive
   - Parameters:
     - `fileId`: ID of the file to download

### Gmail Tools

1. `gmail_list_messages`
   - Lists email messages from Gmail
   - Parameters:
     - `maxResults`: Maximum number of messages to return (default: 10)
     - `query`: Optional search query to filter messages
     - `labelIds`: Optional array of label IDs to filter by

2. `gmail_send_message`
   - Sends an email message
   - Parameters:
     - `to`: Recipient email address
     - `subject`: Email subject
     - `body`: Email body content
     - `cc`: Optional CC recipients (comma-separated)
     - `bcc`: Optional BCC recipients (comma-separated)

3. `gmail_get_message`
   - Gets a specific email message
   - Parameters:
     - `messageId`: ID of the message to retrieve
     - `format`: Message format (full, minimal, raw) (default: full)

## Authentication

This server uses the authentication configuration from the `@ax-crew/tools-google` package. Make sure you have the proper Google API credentials configured.

## Development

The server is built using TypeScript and the MCP SDK. To modify or extend the server:

1. Add new tools in the `src/tools` directory
2. Update the server configuration in `src/server.ts`
3. Build and test your changes

## License

Same as the parent project 