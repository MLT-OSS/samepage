/* eslint-disable @typescript-eslint/member-ordering */
import { fetchSSE } from '../fetch-sse';
import { isEmpty } from 'lodash-es';
import { API_DOMAIN, getApiDomain, safeParse, safeStringify } from '../../utils/index';
import { requestVersionObj } from '../../request/index';
import { MSG_RESPONSE_TAB_ID } from '@/constants';

export interface GenerateAnswerParams {
    url: string;
    data: any;
    onEvent: (event: Event) => void;
    signal?: AbortSignal;
    taskId: string;
    extensionTabId?: string;
    method?: 'GET' | 'POST';
}

export interface Provider {
    generateAnswer: (params: GenerateAnswerParams) => Promise<{ cleanup?: () => void }>;
    cancelTask: (taskId: string) => void;
}

export class ChatProvider implements Provider {
    tasks: any = {};

    getTasks() {
        return this.tasks;
    }

    async generateAnswer(params: GenerateAnswerParams) {
        const { url, data, taskId, extensionTabId } = params;
        console.log(params, 'generateAnswer');

        const cleanup = () => {
            // todo
        };

        const abortController = new AbortController();

        this.tasks[taskId] = {
            abortController
        };

        const _apiDomain = await getApiDomain();

        const fullUrl = `${_apiDomain}/${url}`;

        await fetchSSE(fullUrl, {
            method: data?.method || 'POST',
            signal: abortController.signal,
            headers: {
                'Content-Type': 'application/json',
                ...requestVersionObj
            },
            body: data?.method === 'GET' ? undefined : safeStringify(data),
            onMessage(message: any) {
                let parseData = {};
                try {
                    parseData = safeParse(message || '{}');
                } catch {}
                if (isEmpty(parseData)) {
                    return;
                }
                console.log(new Date(), '后台打印 message', parseData);
                params.onEvent(parseData as any);
            },
            timeout: 120 * 1000,
            [MSG_RESPONSE_TAB_ID]: extensionTabId
        } as any);
        return { cleanup };
    }

    cancelTask(taskId: string) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        const taskInfo = that.tasks[taskId];
        if (!taskInfo) {
            return;
        }
        taskInfo.abortController.abort();
    }
}
