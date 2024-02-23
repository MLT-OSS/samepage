import { DevServerExecutorSchema } from './schema';
import { ExecutorContext, runExecutor } from '@nx/devkit';

export default async function DevServerExecutor(options: DevServerExecutorSchema, context: ExecutorContext) {
    const { target, portEnvKey, ...others } = options;
    const _name = context.projectName;
    const _overrides: Record<string, any> = {};

    let _port = null;

    if (portEnvKey) {
        _port = process.env[portEnvKey];
    } else if (_name) {
        const _upperName = _name.toUpperCase();
        _port = process.env[`NX_${_upperName}_PORT`] || process.env[`${_upperName}_PORT`];
    }

    if (_port && !isNaN(_port)) {
        _overrides.port = _port;
    }

    const result = await runExecutor(
        {
            project: context.projectName,
            target
        },
        { ..._overrides },
        {
            ...context,
            ...others
        }
    );
    for await (const res of result) {
        if (!res.success) return res;
    }
    return {
        success: true
    };
}
