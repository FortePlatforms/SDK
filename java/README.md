# Forte Platforms Java SDK

Official Java SDK for interacting with the Forte Platforms API.

## Installation

### Maven

```xml
<dependency>
    <groupId>com.forteplatforms</groupId>
    <artifactId>sdk</artifactId>
    <version>1.0.48</version>
</dependency>
```

### Gradle

```groovy
implementation 'com.forteplatforms:sdk:1.0.48'
```

## Authentication

When your code runs inside a Forte-hosted service, `FORTE_API_TOKEN` is set automatically and scoped to the service's project — no configuration needed:

```java
ForteClient client = new ForteClient();
```

Outside of Forte (local development, external hosting), pass the token explicitly:

```java
ForteClient client = new ForteClient("your_api_token_here");
```

Or set it as an environment variable:

```bash
export FORTE_API_TOKEN=your_api_token_here
```

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
