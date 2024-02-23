import type { WebDevServerOptions } from '@nx/webpack';
export interface DevServerExecutorSchema extends WebDevServerOptions {
    target: string;
    portEnvKey?: string;
} // eslint-disable-line
