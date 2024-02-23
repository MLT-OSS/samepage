import { formatFiles, generateFiles, Tree, readProjectConfiguration, parseJson, readJsonFile } from '@nx/devkit';
import { applicationGenerator } from '@nx/react';
import { Linter } from '@nx/linter/src/generators/utils/linter';
import * as path from 'path';
import { updateFile } from './utils/update-file';
import { copyFile } from './utils/copy-file';
import { envDevTemplateData, envTemplateData, nginxTemplateData } from './utils/template-string';

import { XmReactAppGeneratorSchema } from './schema';

import type { Schema } from '@nx/react/src/generators/application/schema';

const getUpperName = (name: string) => {
    return name.toUpperCase().replace(/-/g, '_');
};

export async function xmReactAppGenerator(tree: Tree, options: Schema & XmReactAppGeneratorSchema) {
    const projectRoot = `apps/${options.name}`;

    const upperName = getUpperName(options.name);
    const version = readJsonFile('package.json').version;

    const xmDefaultOptions: Partial<Schema> = {
        unitTestRunner: 'none',
        e2eTestRunner: 'none',
        inSourceTests: false,
        routing: true,
        style: 'less',
        directory: `apps`,
        linter: Linter.EsLint
    };

    await applicationGenerator(tree, { ...xmDefaultOptions, ...options });
    const configs = readProjectConfiguration(tree, options.name);

    /** 处理 project.json 文件 */
    const _projectJsonFilePath = `${configs.root}/project.json`;
    const _projectJsonFile = tree.read(_projectJsonFilePath);

    if (_projectJsonFile) {
        const _projectJson = parseJson(_projectJsonFile.toString());
        const xmProjectJson = {
            ..._projectJson,
            targets: {
                ..._projectJson.targets,
                _build: {
                    ..._projectJson.targets.build,
                    configurations: {
                        ..._projectJson.targets.build.configurations,
                        test: {
                            optimization: true,
                            outputHashing: 'all',
                            sourceMap: false,
                            namedChunks: false,
                            extractLicenses: true,
                            vendorChunk: false
                        }
                    }
                },
                _serve: {
                    executor: '@nx/webpack:dev-server',
                    defaultConfiguration: 'development',
                    options: {
                        buildTarget: `${options.name}:_build`,
                        hmr: true,
                        proxyConfig: 'proxyConf.js',
                        allowedHosts: 'all',
                        host: '0.0.0.0'
                    },
                    configurations: {
                        development: {
                            buildTarget: `${options.name}:_build:development`
                        },
                        production: {
                            buildTarget: `${options.name}:_sbuild:production`,
                            hmr: false
                        }
                    }
                },
                build: {
                    executor: '@xm/custom-plugins:env-transfer',
                    defaultConfiguration: 'production',
                    options: {
                        target: `${options.name}:_build`,
                        transfers: [
                            {
                                from: `NX_${upperName}_BASE_URL`,
                                to: 'baseHref'
                            }
                        ]
                    },
                    configurations: {
                        development: {
                            target: `${options.name}:_build:development`
                        },
                        test: {
                            target: `${options.name}:_build:test`
                        },
                        production: {
                            target: `${options.name}:_build:production`
                        }
                    }
                },
                serve: {
                    executor: '@xm/custom-plugins:env-transfer',
                    defaultConfiguration: 'development',
                    options: {
                        target: `${options.name}:_serve`,
                        transfers: [
                            {
                                from: `NX_${upperName}_BASE_URL`,
                                to: 'baseHref'
                            },
                            {
                                from: `NX_${upperName}_PORT`,
                                to: 'port'
                            }
                        ]
                    }
                },
                stylelint: {}
            },
            tags: ['type:app', `project:${options.name}`, ..._projectJson.tags]
        };

        tree.write(_projectJsonFilePath, JSON.stringify(xmProjectJson));

        await formatFiles(tree);
    }

    /** 删除 app 模板 */
    tree.delete(`${configs.root}/src/app`);

    /** 整合 options */
    const _options = {
        ...options,
        xm_upper_name: upperName,
        xm_version: version
    };

    /** 处理模板文件 */
    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, _options);

    /** 复制 favicon.ico 文件 */
    copyFile(tree, path.join(__dirname, 'copys', 'favicon.ico'), `${configs.root}/src/favicon.ico`);

    /** 处理 .env.development.template */
    updateFile(tree, `.env.development.template`, envDevTemplateData(_options));

    /** 处理 .env.development */
    updateFile(tree, `.env.development`, envDevTemplateData(_options));

    /** 处理 .env */
    updateFile(tree, `.env`, envTemplateData(_options));

    /** 处理 package.json 增加启动命令 */
    const _packageJsonFilePath = `package.json`;
    const _packageJsonFile = tree.read(_packageJsonFilePath);
    if (_packageJsonFile) {
        const _packageJson = parseJson(_packageJsonFile.toString());
        const _scripts = _packageJson.scripts || {};
        const _scriptsKeys = Object.keys(_scripts);
        const _startLoginKey = `start:${options.name.charAt(0).toLowerCase()}:l`;
        const _startKey = `start:${options.name}`;
        let _startIndex = _scriptsKeys.findIndex((item) => item === 'start');
        let _startLoginIndex = _scriptsKeys.findIndex((item) => item.match(/^start:[a-zA-Z]+:l$/));
        if (_startLoginIndex < 0) _startLoginIndex = 0;
        if (_startIndex < 0) _startIndex = _startLoginIndex;
        const _newScriptsKeys = [
            ..._scriptsKeys.slice(0, _startLoginIndex),
            _startKey,
            ..._scriptsKeys.slice(_startLoginIndex, _startIndex),
            ...(options.isLogin ? [_startLoginKey] : []),
            ..._scriptsKeys.slice(_startIndex)
        ].filter(Boolean);

        _scripts[_startKey] = `nx serve ${options.name}`;
        if (options.isLogin) {
            _scripts[_startLoginKey] = `nx run-many -t serve -p ${options.name} login`;
        }

        const _newScripts = _newScriptsKeys.reduce((acc, cur) => {
            acc[cur] = _scripts[cur];
            return acc;
        }, {});

        _packageJson.scripts = _newScripts;

        tree.write(_packageJsonFilePath, JSON.stringify(_packageJson));
    }

    /** 处理 nginx.conf */
    updateFile(tree, `deploy/nginx/base_location.conf`, nginxTemplateData(_options));

    await formatFiles(tree);
}

export default xmReactAppGenerator;
