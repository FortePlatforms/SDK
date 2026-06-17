package com.forteplatforms.sdk;

import com.forteplatforms.sdk.generated.invoker.ApiClient;
import java.net.http.HttpClient;

/**
 * {@link ApiClient} that hands the generated API classes a {@link RetryingHttpClient}, so transient
 * network / 5xx failures are retried automatically. The generated API classes capture the client once
 * (via {@code apiClient.getHttpClient()}) at construction, so wrapping it here covers every call.
 */
final class RetryingApiClient extends ApiClient {

    @Override
    public HttpClient getHttpClient() {
        return new RetryingHttpClient(super.getHttpClient());
    }
}
