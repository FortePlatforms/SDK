"""Transport helpers for the Forte Python SDK.

Adds quick automatic retries on transient failures (network errors and 5xx responses) on top of the
generated ApiClient. Only requests that are safe to retry are retried: GET/HEAD, or any request
carrying an Idempotency-Key header (i.e. an idempotent endpoint, so the server can deduplicate the
replay). The same serialized request -- including the Idempotency-Key -- is re-sent on every attempt.
"""

import random
import time

import urllib3

from forte_sdk.generated import ApiClient
from forte_sdk.generated.exceptions import ApiException

_MAX_RETRIES = 3
_MIN_DELAY_S = 0.05
_MAX_DELAY_S = 0.10
_SAFE_METHODS = frozenset({"GET", "HEAD"})


def _is_retryable(method, header_params):
    if (method or "GET").upper() in _SAFE_METHODS:
        return True
    if not header_params:
        return False
    return any(k.lower() == "idempotency-key" for k in header_params)


class RetryingApiClient(ApiClient):
    """ApiClient that retries transient failures up to 3 times with a 50-100ms jittered backoff."""

    def call_api(
        self,
        method,
        url,
        header_params=None,
        body=None,
        post_params=None,
        _request_timeout=None,
    ):
        retryable = _is_retryable(method, header_params)
        attempt = 0
        while True:
            try:
                response_data = super().call_api(
                    method,
                    url,
                    header_params=header_params,
                    body=body,
                    post_params=post_params,
                    _request_timeout=_request_timeout,
                )
                if response_data.status < 500 or not retryable or attempt >= _MAX_RETRIES:
                    return response_data
            except (ApiException, urllib3.exceptions.HTTPError):
                if not retryable or attempt >= _MAX_RETRIES:
                    raise
            attempt += 1
            time.sleep(random.uniform(_MIN_DELAY_S, _MAX_DELAY_S))
