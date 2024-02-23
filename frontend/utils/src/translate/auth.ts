import { setSessionValue, getSessionValue } from '../storage';
import { safeParse } from '../utils';
import { STOKEY_MSAUTH, URL_MICROSOFT_AUTH } from './constants';
import { fetchData } from './fetch';

const parseMSToken = (token: string) => {
    try {
        return safeParse(atob(token.split('.')[1])).exp;
    } catch (err) {
        console.log('[parseMSToken]', err);
    }
    return 0;
};

/**
 * 闭包缓存 token，减少对 storage 查询
 */
const _msAuth = () => {
    let { token, exp }: { token: string; exp: number } = {} as any;

    return async () => {
        // 查询内存缓存
        const now = Date.now();
        if (token && exp * 1000 > now + 1000) {
            return [token, exp];
        }

        // 查询storage缓存
        const res: any = (await getSessionValue(STOKEY_MSAUTH)) || {};
        token = res.token;
        exp = res.exp;
        if (token && exp * 1000 > now + 1000) {
            return [token, exp];
        }

        // 缓存没有或失效，查询接口
        token = await fetchData(URL_MICROSOFT_AUTH);
        exp = parseMSToken(token);
        setSessionValue({ key: STOKEY_MSAUTH, value: { token, exp } });
        return [token, exp];
    };
};

export const msAuth = _msAuth();
