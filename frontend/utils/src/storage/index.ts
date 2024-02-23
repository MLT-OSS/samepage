import { isExtension, safeParse, safeStringify } from '../utils';

export async function setSessionValue({ key, value }: { key: string; value: string | number | Record<string, any> }) {
    try {
        if (isExtension) {
            const Browser = await import('webextension-polyfill');
            return Browser.storage.local.set({ [key]: value });
        } else {
            return localStorage.setItem(key, safeStringify(value));
        }
    } catch (e) {
        console.log(e);
        return Promise.reject;
    }
}

export async function getSessionValue(key: string): Promise<string | number | Record<string, any> | null> {
    try {
        if (isExtension) {
            const Browser = await import('webextension-polyfill');
            const result = await Browser.storage.local.get(key);
            return result[key];
        } else {
            try {
                const __value__ = localStorage.getItem(key);
                return __value__ ? JSON.parse(__value__) : __value__;
            } catch (e) {
                return localStorage.getItem(key);
            }
        }
    } catch (e) {
        console.log(e);
        return Promise.reject;
    }
}

export async function removeSessionValue(_keys: string | string[]) {
    const keys = typeof _keys === 'string' ? [_keys] : _keys;
    try {
        if (isExtension) {
            const Browser = await import('webextension-polyfill');
            await Browser.storage.local.remove(keys);
            return true;
        } else {
            keys.forEach((k) => {
                localStorage.removeItem(k);
            });
            return true;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}
