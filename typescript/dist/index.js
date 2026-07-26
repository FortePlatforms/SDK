"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForteClient = void 0;
var runtime_1 = require("./generated/runtime");
var ProjectsServerApi_1 = require("./generated/apis/ProjectsServerApi");
var UsersServerApi_1 = require("./generated/apis/UsersServerApi");
var transport_1 = require("./transport");
__exportStar(require("./generated/models"), exports);
var ForteClient = /** @class */ (function () {
    function ForteClient(options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c;
        // Falls back to FORTE_API_TOKEN env var in Node.js; safe in browsers where process is undefined.
        // No token is OK: in browsers the Forte-User-Session-Token cookie authenticates users.*;
        // in BFFs the caller passes `authorization` per-call to users.*.
        var token = (_a = options.apiToken) !== null && _a !== void 0 ? _a : (typeof process !== 'undefined' ? (_b = process.env) === null || _b === void 0 ? void 0 : _b.FORTE_API_TOKEN : undefined);
        var headers = {};
        if (token) {
            headers.Authorization = "Bearer ".concat(token);
        }
        var config = new runtime_1.Configuration({
            basePath: (_c = options.baseUrl) !== null && _c !== void 0 ? _c : 'https://api.forteplatforms.com',
            headers: headers,
            // Always include credentials so browsers send the Forte-User-Session-Token cookie
            // cross-origin. No-op for Node.js fetch.
            credentials: 'include',
            // Quick automatic retries on network / 5xx failures. Only GET/HEAD and requests carrying an
            // Idempotency-Key (idempotent endpoints) are retried; the same key is reused on every attempt.
            fetchApi: (0, transport_1.withRetries)(function (input, init) { return fetch(input, init); }),
        });
        this.projects = new ProjectsServerApi_1.ProjectsServerApi(config);
        this.users = new UsersServerApi_1.UsersServerApi(config);
    }
    return ForteClient;
}());
exports.ForteClient = ForteClient;
