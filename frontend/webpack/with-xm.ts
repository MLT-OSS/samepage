import * as path from 'path';
import * as webpack from 'webpack';
import { Configuration } from 'webpack';
import { ExecutorContext } from 'nx/src/config/misc-interfaces';

import { NormalizedWebpackExecutorOptions, NxWebpackPlugin } from '@nx/webpack';

import { workspaceRoot } from '@nx/devkit';

import * as CopyPlugin from 'copy-webpack-plugin';
import version from '../version';
import AppendPathPlugin from './plugins/append-path-plugin';
import { withResolve, WithResolveOptions } from './with-resolve';

import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const processed = new Set();

export interface WithNxOptions {
    skipTypeChecking?: boolean;
}

/**
 * @param {WithNxOptions} pluginOptions
 * @returns {NxWebpackPlugin}
 */
export function withXm(pluginOptions?: WithNxOptions & WithResolveOptions): NxWebpackPlugin {
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
        const { outputPath, projectRoot, watch, root } = options;
        const { preExtension } = pluginOptions ?? {};
        config = withResolve({ preExtension })(config, { options, context });
        if (processed.has(config)) return config;

        // 关闭自带调试报错页面
        if (config.devServer && (config.devServer.client as any)?.overlay) {
            (config.devServer.client as any).overlay = false;
        }

        const plugins = [
            // 复制图片静态资源 TODO: 使用nx的replace
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(workspaceRoot, `./common/assets/images/__default`),
                        to: path.resolve(outputPath, './images')
                    }
                ]
            }),
            // 设置全局变量
            new webpack.DefinePlugin({
                // 获取版本
                VERSION: JSON.stringify(version)
            })
        ];

        let preExtensions = config.resolve?.extensions ?? [];
        if (process.env.NX_PLATFORM) {
            preExtensions = preExtensions.map((_extension) => `.${process.env.NX_PLATFORM}${_extension}`);
        }

        const updated = {
            ...config,
            plugins: (config.plugins ?? []).concat(plugins)
        };

        processed.add(updated);
        return updated;
    };
}
