# Forte Platforms TypeScript SDK

Official TypeScript SDK for interacting with the Forte Platforms API.

## Installation

```bash
npm install @forteplatforms/sdk
```

## Authentication

The SDK supports three auth modes depending on where it runs.

### Inside a Forte-hosted service (no config)

`FORTE_API_TOKEN` is set automatically and scoped to the service's project:

```typescript
const client = new ForteClient();
```

### Client-side (browser / mobile)

For calls to `client.users.*`, construct with no arguments. The browser sends the `Forte-User-Session-Token` cookie automatically after the user logs in. The SDK sets `credentials: 'include'` so the cookie reaches the API cross-origin.

```typescript
const client = new ForteClient();
await client.users.renewSessionToken({ projectId });
```

Do **not** pass `apiToken` from browser code — it's a server-side secret.

### Server-side BFF calling `client.users.*` (no token, per-call authorization)

In a BFF that proxies user-scoped calls, omit the token and forward each user's session token as the `authorization` parameter on each call:

```typescript
const client = new ForteClient();
await client.users.renewSessionToken({
  projectId,
  authorization: `Bearer ${userSessionToken}`,
});
```

### External server-side calling `client.projects.*` (explicit token)

```typescript
const client = new ForteClient({ apiToken: 'your_api_token_here' });
```

Or set `FORTE_API_TOKEN` in the environment (Node.js only) and call `new ForteClient()`.

You can generate an API token from the Forte Platforms dashboard.

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
