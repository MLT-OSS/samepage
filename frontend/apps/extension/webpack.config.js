const { composePlugins } = require('@nx/webpack');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const { workspaceRoot } = require('@nx/devkit');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const WebextensionPlugin = require('@webextension-toolbox/webpack-webextension-plugin').default;
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const { xmWithNx } = require('../../webpack/nx/xm-with-nx');
const { withResolve } = require('../../webpack/with-resolve');
const { getClientEnvironment } = require('../../webpack/nx/get-client-environment');
const version = require('../../version.js');

const lessRegex = /\.less$/;
const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '500000');

// Nx plugins for webpack.
module.exports = composePlugins(
    xmWithNx(),
    withResolve({
        preExtension: 'ex' // 因为有使用到.extension的文件，所以rename一下 TODO: 后续整理相关文件
    }),
    (config, { options, context }) => {
        const { outputPath, projectRoot, watch, root } = options;
        // Update the webpack config as needed here.
        // e.g. `config.plugins.push(new MyPlugin())`
        const __config = merge(config, {
            entry: {
                background: path.resolve(workspaceRoot, `${projectRoot}/background/index.ts`)
            },
            output: {
                filename: '[name].js',
                scriptType: 'text/javascript',
                publicPath: '/'
            },
            plugins: [
                new CopyPlugin({
                    patterns: [
                        {
                            from: path.resolve(workspaceRoot, `${projectRoot}/public`),
                            to: path.resolve(outputPath)
                        },
                        {
                            from: path.resolve(workspaceRoot, `${projectRoot}/manifest.json`),
                            to: path.resolve(outputPath)
                        },
                        {
                            from: path.resolve(workspaceRoot, `./common/assets/images/__default`),
                            to: path.resolve(outputPath, './images')
                        }
                    ]
                }),
                new webpack.DefinePlugin({
                    // ...getClientEnvironment(),
                    ...getClientEnvironment(process.env.NODE_ENV).stringified,
                    global: 'globalThis',
                    VERSION: JSON.stringify(version)
                }),
                new NodePolyfillPlugin(),
                watch &&
                    new WebextensionPlugin({
                        vendor: 'chrome',
                        autoreload: true,
                        quiet: true
                    })
            ],
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: [require.resolve('style-loader'), require.resolve('css-loader')]
                    },
                    {
                        test: lessRegex,
                        use: [
                            {
                                loader: require.resolve('style-loader'),
                                options: {
                                    insert: function (element) {
                                        var __ml_styles_dom__ = document.getElementById('__xm_shadow_dom_style__');
                                        if (__ml_styles_dom__) {
                                            __ml_styles_dom__.appendChild(element);
                                        } else {
                                            const styleDiv = document.createElement('div');
                                            styleDiv.id = '__xm_shadow_dom_style__';
                                            styleDiv.appendChild(element);
                                            document.body.appendChild(styleDiv);
                                        }
                                    }
                                }
                            },
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    modules: {
                                        getLocalIdent: getCSSModuleLocalIdent,
                                        exportLocalsConvention: 'camelCase'
                                    }
                                }
                            },
                            {
                                loader: require.resolve('less-loader')
                            }
                        ]
                    },
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                maxSize: imageInlineSizeLimit
                            }
                        }
                    },
                    {
                        test: /\.svg$/,
                        use: [
                            {
                                loader: require.resolve('@svgr/webpack'),
                                options: {
                                    prettier: false,
                                    svgo: false,
                                    svgoConfig: {
                                        plugins: [{ removeViewBox: false }]
                                    },
                                    titleProp: true,
                                    ref: true
                                }
                            },
                            {
                                loader: require.resolve('file-loader'),
                                options: {
                                    name: 'static/media/[name].[hash].[ext]'
                                }
                            }
                        ],
                        issuer: {
                            and: [/\.(ts|tsx|js|jsx|md|mdx)$/]
                        }
                    }
                ]
            }
        });

        return __config;
    }
);
