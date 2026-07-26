"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetries = void 0;
var MAX_RETRIES = 3;
var MIN_DELAY_MS = 50;
var MAX_DELAY_MS = 100;
var SAFE_METHODS = new Set(['GET', 'HEAD']);
function headerPresent(headers, name) {
    if (!headers)
        return false;
    var lower = name.toLowerCase();
    if (headers instanceof Headers)
        return headers.has(name);
    if (Array.isArray(headers))
        return headers.some(function (_a) {
            var k = _a[0];
            return k.toLowerCase() === lower;
        });
    return Object.keys(headers).some(function (k) { return k.toLowerCase() === lower; });
}
/**
 * A request is safe to auto-retry only if it has no side effects (GET/HEAD) or it carries an
 * Idempotency-Key header (i.e. it targets an idempotent endpoint, so the server can deduplicate the
 * replay). Everything else is left alone to avoid duplicating effects like a double charge.
 */
function isRetryable(init) {
    var _a;
    var method = ((_a = init === null || init === void 0 ? void 0 : init.method) !== null && _a !== void 0 ? _a : 'GET').toUpperCase();
    if (SAFE_METHODS.has(method))
        return true;
    return headerPresent(init === null || init === void 0 ? void 0 : init.headers, 'Idempotency-Key');
}
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
/**
 * Wraps a fetch implementation with quick automatic retries for transient failures: network errors and
 * 5xx responses are retried up to 3 times with a 50-100ms jittered backoff. The identical init (and
 * therefore the same Idempotency-Key, if any) is re-sent on every attempt, so a retried idempotent
 * request stays deduplicable server-side.
 */
function withRetries(baseFetch) {
    var _this = this;
    return function (input, init) { return __awaiter(_this, void 0, void 0, function () {
        var retryable, attempt, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retryable = isRetryable(init);
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, baseFetch(input, init)];
                case 2:
                    response = _a.sent();
                    if (response.status < 500 || !retryable || attempt >= MAX_RETRIES) {
                        return [2 /*return*/, response];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (!retryable || attempt >= MAX_RETRIES) {
                        throw error_1;
                    }
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, delay(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    }); };
}
exports.withRetries = withRetries;
