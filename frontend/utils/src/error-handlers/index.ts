/*
 * 网络请求异常处理程序
 */
import { isExtension } from '../utils';
import { MSG_RESPONSE_ERROR, EVENT_RESPONSE_ERROR_MESSAGE, MSG_RESPONSE_TAB_ID } from '@/constants';
import { eventEmitter, EventType } from '../event-emitter';
import type { IResponseErrorEventData } from '@/types';

/**
 * @description: 业务异常码 and http状态码
 * @param {number}
 */
const codeMessage: {
    [key: number]: string;
} = {
    '200': '服务器成功返回请求的数据',
    '403': '用户得到授权，但是访问是被禁止的。',
    '500': '服务器发生错误，请检查服务器。',
    '502': '网关错误。',
    '503': '服务不可用，服务器暂时过载或维护。',
    '504': '网关超时。',
    '-1001': '导入失败'
};

export const errorDispatch = async (error: any, extensionTabId: string) => {
    if (isExtension && extensionTabId) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const extension = require('./index.extension');
        extension?._sendMessage(extensionTabId, {
            type: MSG_RESPONSE_ERROR,
            data: error
        });
    } else {
        eventEmitter.dispatch(EventType.RESPONSE_ERROR, EVENT_RESPONSE_ERROR_MESSAGE, { ...error });
    }
};

/**
 * 异常处理程序
 */
export const errorHandler = async (error: any) => {
    console.log('❌errorHandler:', error, error.name);
    const { response, request } = error;
    // 用户中止不提示
    const isAbort = error?.name === 'AbortError';
    const showMessageError = isAbort ? false : request.options._fe_show_message_error;
    const extensionTabId = request.options?.[MSG_RESPONSE_TAB_ID];

    const code = response?.status || response?.code || response?.statusCode;
    const errorMsg =
        response?.message ||
        codeMessage?.[code] ||
        (((error?.message || '') as string).indexOf('timeout') > -1 ? '请求超时' : '网络连接异常');

    const _error: IResponseErrorEventData = {
        code,
        showType: 'message',
        message: errorMsg
    };

    if (showMessageError) {
        errorDispatch(_error, extensionTabId);
    }

    throw error;
};

// 只做响应数据的转换，具体的错误数据传输在errorHandler处理
export const responseMiddleware = async (res: any) => {
    const response = await res.clone().json();

    const { statusCode } = response || {};
    // 只有在内部的状态码不为200的情况下才会手动reject, 其他情况都走通用的判断逻辑
    if (res?.status === 200 && statusCode !== 200) {
        return Promise.reject({ response });
    }
    return Promise.resolve(res);
};
