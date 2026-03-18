package com.forteplatforms.sdk;

import com.forteplatforms.sdk.generated.ProjectsServerApi;
import com.forteplatforms.sdk.generated.UsersServerApi;
import com.forteplatforms.sdk.generated.invoker.ApiClient;

public class ForteClient {

    private static final String DEFAULT_BASE_URL = "https://api.forteplatforms.com";

    private final ProjectsServerApi projects;
    private final UsersServerApi users;

    public ForteClient() {
        this(System.getenv("FORTE_API_TOKEN"), DEFAULT_BASE_URL);
    }

    public ForteClient(String apiToken) {
        this(apiToken, DEFAULT_BASE_URL);
    }

    public ForteClient(String apiToken, String baseUrl) {
        if (apiToken == null || apiToken.isBlank()) {
            throw new IllegalArgumentException(
                    "FORTE_API_TOKEN is required. "
                            + "Set it as an environment variable or pass it to the constructor.");
        }

        ApiClient client = new ApiClient();
        client.setBasePath(baseUrl != null ? baseUrl : DEFAULT_BASE_URL);
        client.setRequestInterceptor(builder ->
                builder.header("Authorization", "Bearer " + apiToken));

        this.projects = new ProjectsServerApi(client);
        this.users = new UsersServerApi(client);
    }

    public ProjectsServerApi projects() {
        return projects;
    }

    public UsersServerApi users() {
        return users;
    }
}
