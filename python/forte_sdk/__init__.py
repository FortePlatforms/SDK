import os

from forte_sdk.generated import Configuration
from forte_sdk.generated.api import ProjectsServerApi, UsersServerApi
from forte_sdk._transport import RetryingApiClient


class ForteClient:
    """Official Python client for the Forte Platforms API."""

    def __init__(
        self,
        api_token: str | None = None,
        base_url: str | None = None,
    ):
        # Falls back to FORTE_API_TOKEN env var. No token is OK for BFF usage where the
        # caller passes `authorization` per-call to users.* operations.
        token = api_token or os.environ.get("FORTE_API_TOKEN")

        config = Configuration(host=base_url or "https://api.forteplatforms.com")
        client = RetryingApiClient(config)
        if token:
            client.default_headers["Authorization"] = f"Bearer {token}"

        self.projects = ProjectsServerApi(client)
        self.users = UsersServerApi(client)
