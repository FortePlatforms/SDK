# Forte Platforms TypeScript SDK

Official TypeScript SDK for interacting with the Forte Platforms API.

## Installation

```bash
npm install @forteplatforms/sdk
```

## Authentication

When your code runs inside a Forte-hosted service, `FORTE_API_TOKEN` is set automatically and scoped to the service's project — no configuration needed:

```typescript
const client = new ForteClient();
```

Outside of Forte (local development, external hosting), pass the token explicitly:

```typescript
const client = new ForteClient({ apiToken: 'your_api_token_here' });
```

Or set it as an environment variable (Node.js only):

```bash
export FORTE_API_TOKEN=your_api_token_here
```

You can generate an API token from the Forte Platforms dashboard.

> **Note:** The TypeScript SDK works in both Node.js and browser/React environments. In browsers, you must pass `apiToken` directly since environment variables are not available.

## Quick Start

```typescript
import { ForteClient } from '@forteplatforms/sdk';

const client = new ForteClient();

// List your projects
const projects = await client.projects.listProjects();

// Get a specific project
const project = await client.projects.getProject({ projectId: 'your-project-id' });
```

## Error Handling

API errors are thrown as exceptions with HTTP status information:

```typescript
try {
  const project = await client.projects.getProject({ projectId: 'invalid-id' });
} catch (error) {
  console.error('API error:', error);
}
```

## User Custom Attributes

Store arbitrary key-value metadata on your users. Useful for tracking subscription tiers, feature flags, preferences, or any application-specific data.

```typescript
// Set custom attributes on a user
const user = await client.projects.putUserCustomAttributes({
  projectId: 'your-project-id',
  userId: 'user-id',
  requestBody: {
    plan: 'pro',
    referral_source: 'google',
    onboarding_completed: 'true',
  },
});

console.log(user.customMetadataAttributes);
// { plan: 'pro', referral_source: 'google', onboarding_completed: 'true' }
```

**Key constraints:**
- Keys must be 1-64 characters: letters, numbers, underscores, and hyphens only
- Values are strings
- Each call replaces all existing attributes — include any you want to keep

### Merge with existing attributes

```typescript
// Read current attributes, then merge
const user = await client.projects.getProjectUser({
  projectId: 'your-project-id',
  userId: 'user-id',
});

await client.projects.putUserCustomAttributes({
  projectId: 'your-project-id',
  userId: 'user-id',
  requestBody: {
    ...user.customMetadataAttributes,
    plan: 'enterprise', // update one field
  },
});
```

## API Reference

### `client.projects`

Manage projects and services on Forte Platforms.

### `client.users`

Manage end-users within your projects.
