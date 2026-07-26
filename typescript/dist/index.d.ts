import { ProjectsServerApi } from './generated/apis/ProjectsServerApi';
import { UsersServerApi } from './generated/apis/UsersServerApi';
export * from './generated/models';
export interface ForteClientOptions {
    apiToken?: string;
    baseUrl?: string;
}
export declare class ForteClient {
    readonly projects: ProjectsServerApi;
    readonly users: UsersServerApi;
    constructor(options?: ForteClientOptions);
}
