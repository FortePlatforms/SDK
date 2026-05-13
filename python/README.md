# Forte Platforms Python SDK

Official Python SDK for interacting with the Forte Platforms API.

## Installation

```bash
pip install forte-sdk
```

## Authentication

The SDK supports three auth modes.

### Inside a Forte-hosted service (no config)

`FORTE_API_TOKEN` is set automatically and scoped to the service's project:

```python
client = ForteClient()
```

### Server-side BFF calling `client.users.*` (no token, per-call authorization)

When proxying user-scoped calls from a BFF, omit the token and pass each user's session token as the `authorization` parameter on each call:

```python
client = ForteClient()
client.users.renew_session_token(
    project_id=project_id,
    authorization=f"Bearer {user_session_token}",
)
```

### External server-side calling `client.projects.*` (explicit token)

```python
client = ForteClient(api_token="your_api_token_here")
```

Or set `FORTE_API_TOKEN` in the environment and call `ForteClient()`.

You can generate an API token from the Forte Platforms dashboard.

## Quick Start

```python
from forte_sdk import ForteClient

client = ForteClient()

# List your projects
projects = client.projects.list_projects()

# Get a specific project
project = client.projects.get_project(project_id="your-project-id")
```

## Error Handling

API errors are raised as exceptions:

```python
from forte_sdk.generated.exceptions import ApiException

try:
    project = client.projects.get_project(project_id="invalid-id")
except ApiException as e:
    print(f"API error {e.status}: {e.reason}")
```

## User Custom Attributes

Store arbitrary key-value metadata on your users. Useful for tracking subscription tiers, feature flags, preferences, or any application-specific data.

```python
# Set custom attributes on a user
user = client.projects.put_user_custom_attributes(
    project_id="your-project-id",
    user_id="user-id",
    request_body={
        "plan": "pro",
        "referral_source": "google",
        "onboarding_completed": "true",
    },
)

print(user.custom_metadata_attributes)
# {'plan': 'pro', 'referral_source': 'google', 'onboarding_completed': 'true'}
```

**Key constraints:**
- Keys must be 1-64 characters: letters, numbers, underscores, and hyphens only
- Values are strings
- Each call replaces all existing attributes — include any you want to keep

### Merge with existing attributes

```python
# Read current attributes, then merge
user = client.projects.get_project_user(
    project_id="your-project-id",
    user_id="user-id",
)

client.projects.put_user_custom_attributes(
    project_id="your-project-id",
    user_id="user-id",
    request_body={
        **user.custom_metadata_attributes,
        "plan": "enterprise",  # update one field
    },
)
```

## API Reference

### `client.projects`

Manage projects and services on Forte Platforms.

### `client.users`

Manage end-users within your projects.
