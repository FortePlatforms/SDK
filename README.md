# Forte Platforms SDKs

[![npm](https://img.shields.io/npm/v/@forteplatforms/sdk)](https://www.npmjs.com/package/@forteplatforms/sdk)
[![PyPI](https://img.shields.io/pypi/v/forte-sdk)](https://pypi.org/project/forte-sdk/)
[![Maven Central](https://img.shields.io/maven-central/v/com.forteplatforms/sdk)](https://central.sonatype.com/artifact/com.forteplatforms/sdk)

Official SDKs for the [Forte Platforms](https://forteplatforms.com) API.

## SDKs

| Language | Package | Install |
|----------|---------|---------|
| [TypeScript](typescript/README.md) | [`@forteplatforms/sdk`](https://www.npmjs.com/package/@forteplatforms/sdk) | `npm install @forteplatforms/sdk` |
| [Python](python/README.md) | [`forte-sdk`](https://pypi.org/project/forte-sdk/) | `pip install forte-sdk` |
| [Java](java/README.md) | [`com.forteplatforms:sdk`](https://central.sonatype.com/artifact/com.forteplatforms/sdk) | See [Maven/Gradle setup](java/README.md#installation) |

## Authentication

All SDKs authenticate using an API token. Set it as an environment variable:

```bash
export FORTE_API_TOKEN=your_api_token_here
```

Or pass it directly when creating the client. You can generate an API token from the [Forte Platforms dashboard](https://forteplatforms.com).

## Documentation

- [Quickstart](https://forteplatforms.com/docs/getting-started/quickstart)
- [SDKs Reference](https://forteplatforms.com/docs/core-concepts/sdks)
- [Projects](https://forteplatforms.com/docs/core-concepts/projects)
- [Users](https://forteplatforms.com/docs/core-concepts/users)
- [Full Documentation](https://forteplatforms.com/docs)
