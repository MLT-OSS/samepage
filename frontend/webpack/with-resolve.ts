import * as path from 'path';
import { Configuration } from 'webpack';
import { ExecutorContext } from 'nx/src/config/misc-interfaces';

import { NormalizedWebpackExecutorOptions, NxWebpackPlugin } from '@nx/webpack';
import AppendPathPlugin from './plugins/append-path-plugin';

import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const processed = new Set();

export interface WithResolveOptions {
    preExtension?: string | false;
}

/**
 * @param {WithNxOptions} pluginOptions
 * @returns {NxWebpackPlugin}
 */
export function withResolve(pluginOptions?: WithResolveOptions): NxWebpackPlugin {
    const { preExtension = process.env.NX_PLATFORM } = pluginOptions ?? {};
    return function configure(
        config: Configuration,
        {
            options,
            context
        }: {
            options: NormalizedWebpackExecutorOptions;
            context: ExecutorContext;
        }
    ): Configuration {
        const { root } = options;
        if (processed.has(config)) return config;

        let _preExtensions = [];
        if (preExtension) {
            _preExtensions = (config?.resolve?.extensions ?? []).map((_extension) => `.${preExtension}${_extension}`);
        }

        const updated = {
            ...config,
            // 新增别名
            resolve: {
                ...config.resolve,
                extensions: [..._preExtensions, ...(config?.resolve?.extensions ?? [])],
                alias: {
                    ...config.resolve?.alias,
                    '@/common': path.resolve(root!, `./common`)
                },
                plugins: [
                    ...(config.resolve?.plugins ?? []),
                    new AppendPathPlugin({
                        prePath: preExtension,
                        /**
                         * 排除文件(根据字符串匹配)
                         * node_modules: 只在项目中生效
                         * common: 排除静态资源加载(因为有h5文件的影响)
                         * utils: 排除工具类(因为有login、extension文件的影响)
                         * services: 排除请求(因为有login文件的影响;按理说应该是一套请求)
                         * TODO: 后续需要将原来的一步引入变成分端打包的形式
                         */
                        exclude: ['node_modules', 'common', 'utils', 'services']
                    })
                ]
            }
        };

        processed.add(updated);
        return updated;
    };
}
