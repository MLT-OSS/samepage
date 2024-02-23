import { sendMsg } from './msg';
import { taskPool } from './pool';
import {
    MSG_FETCH,
    MSG_FETCH_LIMIT,
    MSG_FETCH_CLEAR,
    CACHE_NAME,
    OPT_TRANS_MICROSOFT,
    OPT_TRANS_OPENAI,
    DEFAULT_FETCH_INTERVAL,
    DEFAULT_FETCH_LIMIT
} from './constants';
import { msAuth } from './auth';

/**
 * 构造缓存 request
 */
const newCacheReq = async (request: Request) => {
    if (request.method !== 'GET') {
        const body = await request.text();
        const cacheUrl = new URL(request.url);
        cacheUrl.pathname += body;
        // eslint-disable-next-line no-param-reassign
        request = new Request(cacheUrl.toString(), { method: 'GET' });
    }

    return request;
};

/**
 * 发起请求
 */
const fetchApi = async ({
    input,
    init = {},
    translator,
    token
}: {
    input: URL;
    init: any;
    translator: string;
    token: string;
}) => {
    if (translator === OPT_TRANS_MICROSOFT) {
        init.headers['Authorization'] = `Bearer ${token}`;
    } else if (translator === OPT_TRANS_OPENAI) {
        init.headers['Authorization'] = `Bearer ${token}`;
        init.headers['api-key'] = token;
    }
    return fetch(input, init);
};

/**
 * 请求池实例
 */
export const fetchPool = taskPool(
    fetchApi,
    async ({ translator }: { translator: string }) => {
        if (translator === OPT_TRANS_MICROSOFT) {
            const [token] = await msAuth();
            return { token };
        }
        return {};
    },
    DEFAULT_FETCH_INTERVAL,
    DEFAULT_FETCH_LIMIT
);

/**
 * 请求数据统一接口
 */
export const fetchData = async (input: any, { useCache, usePool, translator, token, ...init }: any = {}) => {
    const cacheReq = await newCacheReq(new Request(input, init));
    const cache = await caches.open(CACHE_NAME);
    let res: any;

    // 查询缓存
    if (useCache) {
        try {
            res = await cache.match(cacheReq);
        } catch (err) {
            console.log('[cache match]', err);
        }
    }

    if (!res) {
        // 发送请求
        if (usePool) {
            res = await fetchPool.push({ input, init, translator, token });
        } else {
            res = await fetchApi({ input, init, translator, token });
        }

        if (!res?.ok) {
            throw new Error(`response: ${res.statusText}`);
        }

        // 插入缓存
        if (useCache) {
            try {
                await cache.put(cacheReq, res.clone());
            } catch (err) {
                console.log('[cache put]', err);
            }
        }
    }

    const contentType = res.headers.get('Content-Type');
    if (contentType?.includes('json')) {
        return await res.json();
    }
    return await res.text();
};

/**
 * fetch 兼容性封装
 */
export const fetchPolyfill = async (input: any, { isBg = false, ...opts }: any = {}) => {
    // 插件
    if (!isBg) {
        const res = await sendMsg(MSG_FETCH, { input, opts });
        if (res.error) {
            throw new Error(res.error);
        }
        return res.data;
    }

    // 油猴/网页/BackgroundPage
    return await fetchData(input, opts);
};

/**
 * 更新 fetch pool 参数
 */
export const fetchUpdate = async (interval: number, limit: number) => {
    const res = await sendMsg(MSG_FETCH_LIMIT, { interval, limit });
    if (res.error) {
        throw new Error(res.error);
    }
};

/**
 * 清空任务池
 */
export const fetchClear = async () => {
    const res = await sendMsg(MSG_FETCH_CLEAR);
    if (res.error) {
        throw new Error(res.error);
    }
};
