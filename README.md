# AxCrew Tools

[AxCrew](https://github.com/amitdeshmukh/ax-crew) is a framework for building and managing teams of AI agents powered by [AxLLM](https://axllm.dev). It allows you to define agent behaviors and interactions through simple configuration files, making it easy to create complex multi-agent systems.

This repository contains tools that extend the capabilities of AxCrew.

## Installation

```bash
npm install @ax-crew/tools-gmail @ax-crew/tools-drive ...
```

## Available Tools

### Gmail

The `@ax-crew/tools-gmail` package provides a Gmail API integration for AxCrew. It allows you to search and send emails using the Gmail API.

### Google Drive

The `@ax-crew/tools-drive` package provides a Google Drive API integration for AxCrew. It allows you to search and manage files in Google Drive.

## Development

This repository uses a monorepo structure with individual packages in the `packages/` directory.

### Publishing Packages

To publish the packages:

1. Ensure you have an NPM account and are logged in:
```bash
npm login
```

2. For each package you want to publish:
```bash
cd packages/<package-name>
npm version patch  # or minor/major as needed
npm publish --access public
```

For example, to publish the Gmail package:
```bash
cd packages/google
npm version patch
npm publish --access public
```

### Publishing All Packages

Using npm workspaces, you can publish all packages at once:

```bash
# Using npm workspaces
npm run publish-packages
```

Note: Make sure each package has a unique name in its `package.json` and all dependencies are properly listed.

