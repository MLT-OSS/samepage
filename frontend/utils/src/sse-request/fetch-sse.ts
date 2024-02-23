import { SSE_ERROR, SSE_ERROR_TIMEOUT, SSE_ERROR_USER_ABORT, MSG_RESPONSE_TAB_ID } from '@/constants';
import { getBytes, getLines, getMessages } from './sse-parse';
import { isEmpty } from 'lodash-es';
import { errorDispatch } from '../error-handlers';
import type { IResponseErrorEventData } from '@/types';
import { safeParse, safeStringify } from '../utils';

const LastEventId = 'last-event-id';

export async function fetchSSE(
    resource: string,
    options: RequestInit & {
        onMessage: (message: string) => void;
        timeout: number;
    }
) {
    const { timeout, onMessage, ...fetchOptions } = options;

    return Promise.race([
        fetch(resource, fetchOptions),
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new DOMException(`timeout of ${timeout}ms exceeded`, 'TimeoutError'));
            }, timeout);
        })
    ])
        .then(async (resp: any) => {
            const contentType = resp.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                const data = await resp.json().catch(() => ({}));
                throw new DOMException(safeStringify(data), 'XmUserError');
            }
            if (!resp.ok) {
                const error = await resp.json().catch(() => ({}));
                throw new Error(!isEmpty(error) ? safeStringify(error) : `${resp.status} ${resp.statusText}`);
            }

            const headers: any = fetchOptions?.headers || {};
            await getBytes(
                resp.body!,
                getLines(
                    getMessages(
                        (id) => {
                            if (id) {
                                // store the id and send it back on the next retry:
                                headers[LastEventId] = id;
                            } else {
                                // don't send the last-event-id header anymore:
                                delete headers[LastEventId];
                            }
                        },
                        (retry) => {
                            // todo
                        },
                        onMessage
                    )
                )
            );
        })
        .catch((e) => {
            if (e?.name === 'TimeoutError') {
                onMessage(safeStringify({ finished: SSE_ERROR_TIMEOUT }));
                return;
            }
            if (e?.name === 'AbortError') {
                onMessage(safeStringify({ finished: SSE_ERROR_USER_ABORT }));
                return;
            }
            if (e?.name === 'XmUserError') {
                let errorInfo: any = {};
                try {
                    errorInfo = safeParse(e?.message || '{}');
                } catch {}
                const _error: IResponseErrorEventData = {
                    code: errorInfo?.statusCode,
                    showType: 'message',
                    message: errorInfo.message
                };
                errorDispatch(_error, (fetchOptions as any)[MSG_RESPONSE_TAB_ID]);

                onMessage(safeStringify({ finished: `${SSE_ERROR}:${errorInfo.message}` }));
                return;
            }
            onMessage(safeStringify({ finished: `${SSE_ERROR}:${e}` }));
        });
}
