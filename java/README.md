# Forte Platforms Java SDK

Official Java SDK for interacting with the Forte Platforms API.

## Installation

### Maven

```xml
<dependency>
    <groupId>com.forteplatforms</groupId>
    <artifactId>sdk</artifactId>
    <version>1.0.176</version>
</dependency>
```

### Gradle

```groovy
implementation 'com.forteplatforms:sdk:1.0.176'
```

## Authentication

The SDK supports three auth modes.

### Inside a Forte-hosted service (no config)

`FORTE_API_TOKEN` is set automatically and scoped to the service's project:

```java
ForteClient client = new ForteClient();
```

### Server-side BFF calling `client.users()` (no token, per-call authorization)

When proxying user-scoped calls from a BFF, construct with no token and pass each user's session token as the `authorization` parameter on each call:

```java
ForteClient client = new ForteClient((String) null);

client.users().renewSessionToken(
    projectId,
    "Bearer " + userSessionToken,
    null,
    2592000L
);
```

The explicit `(String) null` cast disambiguates from the no-arg constructor (which falls back to the `FORTE_API_TOKEN` env var).

### External server-side calling `client.projects()` (explicit token)

```java
ForteClient client = new ForteClient("your_api_token_here");
```

Or set `FORTE_API_TOKEN` in the environment and call `new ForteClient()`.

You can generate an API token from the Forte Platforms dashboard.

## Quick Start

```java
import com.forteplatforms.sdk.ForteClient;

ForteClient client = new ForteClient();

// List your projects
var projects = client.projects().listProjects();

// Get a specific project
var project = client.projects().getProject("your-project-id");
```

## Error Handling

API errors are thrown as `ApiException`:

```java
import com.forteplatforms.sdk.generated.ApiException;

try {
    var project = client.projects().getProject("invalid-id");
} catch (ApiException e) {
    System.err.println("API error " + e.getCode() + ": " + e.getMessage());
}
```

## User Custom Attributes

Store arbitrary key-value metadata on your users. Useful for tracking subscription tiers, feature flags, preferences, or any application-specific data.

```java
// Set custom attributes on a user
var user = client.projects().putUserCustomAttributes(
    "your-project-id",
    "user-id",
    Map.of(
        "plan", "pro",
        "referral_source", "google",
        "onboarding_completed", "true"
    )
);

System.out.println(user.getCustomMetadataAttributes());
// {plan=pro, referral_source=google, onboarding_completed=true}
```

**Key constraints:**
- Keys must be 1-64 characters: letters, numbers, underscores, and hyphens only
- Values are strings
- Each call replaces all existing attributes — include any you want to keep

### Merge with existing attributes

```java
// Read current attributes, then merge
var user = client.projects().getProjectUser("your-project-id", "user-id");

var merged = new HashMap<>(user.getCustomMetadataAttributes());
merged.put("plan", "enterprise"); // update one field

client.projects().putUserCustomAttributes("your-project-id", "user-id", merged);
```

## API Reference

### `client.projects()`

Manage projects and services on Forte Platforms.

### `client.users()`

Manage end-users within your projects.
