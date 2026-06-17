package com.forteplatforms.sdk;

import java.io.IOException;
import java.net.Authenticator;
import java.net.CookieHandler;
import java.net.ProxySelector;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandler;
import java.net.http.HttpResponse.PushPromiseHandler;
import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLParameters;

/**
 * An {@link HttpClient} decorator that retries transient failures -- {@link IOException}s and 5xx
 * responses -- up to 3 times with a 50-100ms jittered backoff. Only requests that are safe to retry
 * are retried: GET/HEAD, or any request carrying an {@code Idempotency-Key} header (an idempotent
 * endpoint, so the server can deduplicate the replay). The same immutable {@link HttpRequest} -- and
 * therefore the same Idempotency-Key -- is re-sent on every attempt.
 */
final class RetryingHttpClient extends HttpClient {

    private static final int MAX_RETRIES = 3;
    private static final long MIN_DELAY_MS = 50;
    private static final long MAX_DELAY_MS = 100;
    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD");

    private final HttpClient delegate;

    RetryingHttpClient(HttpClient delegate) {
        this.delegate = delegate;
    }

    private static boolean isRetryable(HttpRequest request) {
        if (SAFE_METHODS.contains(request.method().toUpperCase())) {
            return true;
        }
        return request.headers().firstValue("Idempotency-Key").isPresent();
    }

    private static long backoffMillis() {
        return MIN_DELAY_MS + (long) (Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
    }

    @Override
    public <T> HttpResponse<T> send(HttpRequest request, BodyHandler<T> responseBodyHandler)
            throws IOException, InterruptedException {
        boolean retryable = isRetryable(request);
        for (int attempt = 0; ; attempt++) {
            try {
                HttpResponse<T> response = delegate.send(request, responseBodyHandler);
                if (response.statusCode() < 500 || !retryable || attempt >= MAX_RETRIES) {
                    return response;
                }
            } catch (IOException e) {
                if (!retryable || attempt >= MAX_RETRIES) {
                    throw e;
                }
            }
            Thread.sleep(backoffMillis());
        }
    }

    @Override
    public <T> CompletableFuture<HttpResponse<T>> sendAsync(
            HttpRequest request, BodyHandler<T> responseBodyHandler) {
        return sendAsyncWithRetry(request, responseBodyHandler, null, isRetryable(request), 0);
    }

    @Override
    public <T> CompletableFuture<HttpResponse<T>> sendAsync(
            HttpRequest request, BodyHandler<T> responseBodyHandler, PushPromiseHandler<T> pushPromiseHandler) {
        return sendAsyncWithRetry(request, responseBodyHandler, pushPromiseHandler, isRetryable(request), 0);
    }

    private <T> CompletableFuture<HttpResponse<T>> sendAsyncWithRetry(
            HttpRequest request, BodyHandler<T> handler, PushPromiseHandler<T> pushHandler, boolean retryable, int attempt) {
        CompletableFuture<HttpResponse<T>> future = pushHandler == null
                ? delegate.sendAsync(request, handler)
                : delegate.sendAsync(request, handler, pushHandler);
        if (!retryable || attempt >= MAX_RETRIES) {
            return future;
        }
        return future.handle((response, error) -> {
                    boolean shouldRetry = error != null || response.statusCode() >= 500;
                    if (!shouldRetry) {
                        return CompletableFuture.completedFuture(response);
                    }
                    Executor delayed = CompletableFuture.delayedExecutor(backoffMillis(), TimeUnit.MILLISECONDS);
                    return CompletableFuture.supplyAsync(() -> null, delayed)
                            .thenCompose(ignored ->
                                    sendAsyncWithRetry(request, handler, pushHandler, retryable, attempt + 1));
                })
                .thenCompose(f -> f);
    }

    // --- Configuration accessors: delegate to the wrapped client ---

    @Override
    public Optional<CookieHandler> cookieHandler() {
        return delegate.cookieHandler();
    }

    @Override
    public Optional<Duration> connectTimeout() {
        return delegate.connectTimeout();
    }

    @Override
    public Redirect followRedirects() {
        return delegate.followRedirects();
    }

    @Override
    public Optional<ProxySelector> proxy() {
        return delegate.proxy();
    }

    @Override
    public SSLContext sslContext() {
        return delegate.sslContext();
    }

    @Override
    public SSLParameters sslParameters() {
        return delegate.sslParameters();
    }

    @Override
    public Optional<Authenticator> authenticator() {
        return delegate.authenticator();
    }

    @Override
    public Version version() {
        return delegate.version();
    }

    @Override
    public Optional<Executor> executor() {
        return delegate.executor();
    }
}
