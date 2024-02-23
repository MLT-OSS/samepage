import { ChatProvider } from './provider/chat';
import { v4 as uuidv4 } from 'uuid';
import { isExtension } from '../utils';

interface ISseRequestOption {
    onSuccess?: (data: any) => void;
    onError?: () => void;
    extensionTabId?: string;
}

let provider: any = null;
let taskId: string;
export const __sseRequest: (
    url?: string | undefined,
    options?: ISseRequestOption
) => {
    cancelSseRequest: () => void;
    runSseRequest: (data: any) => Promise<any>;
} = (url, options) => {
    const runSseRequest = async (data: any) => {
        const { model, url: _url, ...others } = data;

        provider = new ChatProvider();
        taskId = uuidv4();
        await provider.generateAnswer({
            url: _url || url,
            data: others,
            taskId,
            onEvent: options?.onSuccess,
            extensionTabId: options?.extensionTabId
        });
    };

    const cancelSseReqest = async () => {
        provider?.getTasks();
        return provider?.cancelTask(taskId);
    };

    return {
        cancelSseRequest: cancelSseReqest,
        runSseRequest: runSseRequest
    };
};

// eslint-disable-next-line max-params
export const sseRequest = (url?: string, options?: ISseRequestOption, background: boolean = isExtension) => {
    if (background) {
        let port: any = null;
        return {
            cancelSseRequest: async () => {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const exSse = await require('./sse.extension');
                await exSse?.sseCancel(port);
                port.onMessage.removeListener(options?.onSuccess);
                port.disconnect();
            },
            runSseRequest: async (data: any) => {
                const { url: _url, ...others } = data;
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const exSse = await require('./sse.extension');
                port = await exSse?.sseConnect();
                port.onMessage.addListener(options?.onSuccess);
                // todo
                port?.postMessage({
                    url: _url || url,
                    data: others
                });
            }
        };
    } else {
        return __sseRequest(url, options);
    }
};
