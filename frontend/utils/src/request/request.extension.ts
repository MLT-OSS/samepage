import { MSG_ABORT_REQUEST, MSG_REQUEST, MSG_RESPONSE_TAB_ID } from '@/constants';
import type { RequestOptionsWithResponse, RequestOptionsInit, RequestOptionsWithoutResponse } from 'umi-request';
import { isExtension } from '../utils';

type IOptions = RequestOptionsWithResponse | RequestOptionsInit | RequestOptionsWithoutResponse | undefined;

// 委托 background 执行请求
export const sendRequestToBackground = (url: string, options: IOptions) => {
    return new Promise((resolve, reject) => {
        // chrome.runtime.sendMessage 中只能传递 JSON 数据，不能传递 file 类型数据，因此直接从 popup 发起请求。
        // The message to send. This message should be a JSON-ifiable object.
        // 详情参阅：https://developer.chrome.com/extensions/runtime#method-sendMessage
        if (isExtension && chrome?.runtime) {
            chrome.runtime.sendMessage({ type: MSG_REQUEST, data: { url, options } }, (result) => {
                // 接收background script的sendResponse方法返回的消数据result
                // 只接收结果，根据不同的 success 的状态 返回 resolve 和 reject （具体返回的数据格式由backgroud script的sendResponse来定义）
                // todo 返回 Promise
                if (result?.success) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        } else {
            console.log('未找到chrome API');
        }
    });
};

export const abortRequestToBackground = (abortId: string) => {
    if (isExtension && chrome?.runtime) {
        chrome.runtime.sendMessage({ type: MSG_ABORT_REQUEST, data: { abortId } }, (result) => {
            console.log('取消成功');
            // do something
        });
    } else {
        console.log('未找到chrome API');
    }
};
