import { Configuration } from './generated/runtime';
import { ProjectsServerApi } from './generated/apis/ProjectsServerApi';
import { UsersServerApi } from './generated/apis/UsersServerApi';

declare var process: { env: Record<string, string | undefined> } | undefined;

export * from './generated/models';

export interface ForteClientOptions {
  apiToken?: string;
  baseUrl?: string;
}

export class ForteClient {
  public readonly projects: ProjectsServerApi;
  public readonly users: UsersServerApi;

  constructor(options: ForteClientOptions = {}) {
    // Falls back to FORTE_API_TOKEN env var in Node.js; safe in browsers where process is undefined.
    // No token is OK: in browsers the Forte-User-Session-Token cookie authenticates users.*;
    // in BFFs the caller passes `authorization` per-call to users.*.
    const token = options.apiToken
      ?? (typeof process !== 'undefined' ? process.env?.FORTE_API_TOKEN : undefined);

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = new Configuration({
      basePath: options.baseUrl ?? 'https://api.forteplatforms.com',
      headers,
      // Always include credentials so browsers send the Forte-User-Session-Token cookie
      // cross-origin. No-op for Node.js fetch.
      credentials: 'include',
    });

    this.projects = new ProjectsServerApi(config);
    this.users = new UsersServerApi(config);
  }
}
