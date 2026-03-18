import { Configuration } from './generated/runtime';
import { ProjectsServerApi } from './generated/apis/ProjectsServerApi';
import { UsersServerApi } from './generated/apis/UsersServerApi';

export * from './generated/models';

export interface ForteClientOptions {
  apiToken?: string;
  baseUrl?: string;
}

export class ForteClient {
  public readonly projects: ProjectsServerApi;
  public readonly users: UsersServerApi;

  constructor(options: ForteClientOptions = {}) {
    const token = options.apiToken ?? process.env.FORTE_API_TOKEN;
    if (!token) {
      throw new Error(
        'FORTE_API_TOKEN is required. Set it as an environment variable or pass apiToken option.',
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
