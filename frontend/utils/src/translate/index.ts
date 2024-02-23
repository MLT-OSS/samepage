/**
 * 对照式翻译相关方法
 */
import { getSessionValue } from '../storage';
import { DEFAULT_SETTING, STOKEY_SETTING, STOKEY_RULES } from './constants';

/**
 * 查询storage中的设置
 */
export const getSetting = async () => {
    const cashSeting: any = (await getSessionValue(STOKEY_SETTING)) || {};
    return {
        ...DEFAULT_SETTING,
        ...cashSeting
    };
};

/**
 * 查询规则列表
 * @returns
 */
export const getRules = async () => (await getSessionValue(STOKEY_RULES)) || [];

/**
 * 本地语言识别
 * @param {*} q
 * @returns
 */
export const detectLang = async (q: any) => {
    try {
        const Browser = await import('webextension-polyfill');
        const res = await Browser?.i18n?.detectLanguage(q);
        return res?.languages?.[0]?.language;
    } catch (err) {
        console.log('[detect lang]', err);
    }
};
