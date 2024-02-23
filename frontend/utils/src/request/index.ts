/* global chrome */
import { extend } from 'umi-request';
import type { RequestOptionsWithResponse, RequestOptionsInit, RequestOptionsWithoutResponse } from 'umi-request';
import { errorHandler, responseMiddleware } from '../error-handlers';
import { adaptor } from '../adaptor';
import { isExtension, API_DOMAIN, VERSION_KEY, VERSION_VALUE, getApiDomain, getWebDefaultUrl } from '../utils';
import { abortRequestMap } from './abort-map';
import { getSessionValue } from '../storage';

type IUmiRequestOptions = RequestOptionsWithResponse | RequestOptionsInit | RequestOptionsWithoutResponse;
type IOptions = (IUmiRequestOptions & { abortId?: string }) | undefined;

// version对象
export const requestVersionObj = VERSION_KEY ? { [VERSION_KEY]: VERSION_VALUE ?? '' } : {};

const __umiRequest = extend({
    credentials: 'include',
    prefix: API_DOMAIN,
    headers: {
        ...requestVersionObj
    },
    timeout: 30 * 1000,
    errorHandler,
    errorConfig: {
        adaptor
    },
    parseResponse: false
});

// 响应拦截器
__umiRequest.interceptors.response.use((response) => {
    return responseMiddleware(response);
});

export async function umiRequest(url: string, options: IOptions) {
    try {
        // 存 abortId
        let controller;
        let _options = options;
        if (_options?.abortId) {
            controller = new AbortController();
            abortRequestMap.set(_options?.abortId, controller);
        }

        const _commonApiUrl = await getApiDomain();
        let _webHost = (await getWebDefaultUrl()) ?? '';
        if (_webHost) {
            try {
                _webHost = new URL(_webHost).host;
            } catch (e) {}
        }
        if (_commonApiUrl) {
            if (!_options) _options = {};
            _options.prefix = _commonApiUrl;
            _options.headers = {
                ..._options.headers,
                'Web-Host': String(_webHost)
            };
        }

        const response = await __umiRequest(url, {
            ..._options,
            signal: controller?.signal
        });

        // del abortId
        if (_options?.abortId) {
            abortRequestMap.delete(_options.abortId);
        }

        const parseResponse = await response.clone().json();
        return {
            success: true,
            data: parseResponse?.data,
            __parseResponse: parseResponse,
            __response: response
        };
    } catch (e) {
        console.log('👻umiRequest error:', e);
        return { success: false, data: e };
    }
}

// API 请求正常，数据正常
export const API_CODE = {
    // API 请求正常
    OK: 200,
    // API 请求正常，数据异常
    ERR_DATA: 403,
    // API 请求正常，空数据
    ERR_NO_DATA: 301,
    // API 请求正常，登录异常
    ERR_LOGOUT: 401
};
// API 请求异常报错内容
export const API_FAILED = '网络连接异常，请稍后再试';

export const request: (
    url: string,
    options: IOptions,
    background?: boolean
) => Promise<Promise<any> | undefined> = async (url, options, background = isExtension) => {
    const finalOptions = {
        ...options,
        _fe_show_message_error: (options as any)._fe_show_message_error ?? true
    };
    if (background) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const extensionReqest = require('./request.extension');
        // 插件
        return extensionReqest.sendRequestToBackground(url, finalOptions) as any;
    } else {
        // web
        const result = await umiRequest(url, finalOptions);
        if (result?.success) {
            return result;
        } else {
            throw result;
        }
    }
};

export const abortRequest = (abortId?: string, background = isExtension) => {
    if (!abortId) {
        return;
    }
    if (background) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const extensionReqest = require('./request.extension');
        // 插件
        return extensionReqest.abortRequestToBackground(abortId);
    } else {
        // web
        const controller = abortRequestMap.get(abortId);
        controller?.abort();
    }
};
