import { EnvTransferExecutorSchema } from './schema';
import { ExecutorContext, runExecutor, parseTargetString } from '@nx/devkit';

export default async function EnvTransferExecutor(options: EnvTransferExecutorSchema, context: ExecutorContext) {
    const { target, transfers, overrides, ...others } = options;
    const _overrides: Record<string, any> = {};

    const _target = parseTargetString(options.target, context.projectGraph);

    transfers?.forEach(({ from, to }) => {
        let _formValue = null;

        if (from) {
            _formValue = process?.env?.[from];
        }

        if (_formValue) {
            _overrides[to] = _formValue;
        }
    });

    const result = await runExecutor(
        {
            ..._target
        },
        { ...overrides, ..._overrides },
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
