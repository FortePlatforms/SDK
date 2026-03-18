import os

from forte_sdk.generated import ApiClient, Configuration
from forte_sdk.generated.api import ProjectsServerApi, UsersServerApi


class ForteClient:
    """Official Python client for the Forte Platforms API."""

    def __init__(
        self,
        api_token: str | None = None,
        base_url: str | None = None,
    ):
        token = api_token or os.environ.get("FORTE_API_TOKEN")
        if not token:
            raise ValueError(
                "FORTE_API_TOKEN is required. "
                "Set it as an environment variable or pass api_token."
            )

        config = Configuration(host=base_url or "https://api.forteplatforms.com")
        client = ApiClient(config)
        client.default_headers["Authorization"] = f"Bearer {token}"

        self.projects = ProjectsServerApi(client)
        self.users = UsersServerApi(client)
