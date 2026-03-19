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
    // Falls back to FORTE_API_TOKEN env var in Node.js; safe in browsers where process is undefined
    const token = options.apiToken
      ?? (typeof process !== 'undefined' ? process.env?.FORTE_API_TOKEN : undefined);
    if (!token) {
      throw new Error(
        'API token is required. Pass apiToken in the constructor options, or set the FORTE_API_TOKEN environment variable (Node.js only).',
      );
    }

    const config = new Configuration({
      basePath: options.baseUrl ?? 'https://api.forteplatforms.com',
      headers: { Authorization: `Bearer ${token}` },
    });

    this.projects = new ProjectsServerApi(config);
    this.users = new UsersServerApi(config);
  }
}
