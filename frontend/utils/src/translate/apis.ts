import queryString from 'query-string';
import { fetchPolyfill } from './fetch';
import {
    OPT_TRANS_GOOGLE,
    OPT_TRANS_MICROSOFT,
    OPT_TRANS_OPENAI,
    URL_MICROSOFT_TRANS,
    OPT_LANGS_SPECIAL,
    PROMPT_PLACE_FROM,
    PROMPT_PLACE_TO,
    KV_SALT_SYNC
} from './constants';
import { getSetting, detectLang } from './index';
import { sha256 } from './utils';
import { safeStringify } from '../utils';

/**
 * 同步数据
 * @param {*} url
 * @param {*} key
 * @param {*} data
 * @returns
 */
// eslint-disable-next-line max-params
export const apiSyncData = async (url: any, key: any, data: any, isBg = false) =>
    fetchPolyfill(url, {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${await sha256(key, KV_SALT_SYNC)}`
        },
        method: 'POST',
        body: safeStringify(data),
        isBg
    });

/**
 * 谷歌翻译
 * @param {*} text
 * @param {*} to
 * @param {*} from
 * @returns
 */
// eslint-disable-next-line max-params
const apiGoogleTranslate = async (translator: any, text: any, to: any, from: any) => {
    const params = {
        client: 'gtx',
        dt: 't',
        dj: 1,
        ie: 'UTF-8',
        sl: from,
        tl: to,
        q: text
    };
    const { googleUrl }: any = await getSetting();
    const input = `${googleUrl}?${queryString.stringify(params)}`;
    return fetchPolyfill(input, {
        headers: {
            'Content-type': 'application/json'
        },
        useCache: true,
        usePool: true,
        translator
    });
};

/**
 * 微软翻译
 * @param {*} text
 * @param {*} to
 * @param {*} from
 * @returns
 */
// eslint-disable-next-line max-params
const apiMicrosoftTranslate = (translator: string, text: string, to: string, from: string) => {
    const params = {
        from,
        to,
        'api-version': '3.0'
    };
    const input = `${URL_MICROSOFT_TRANS}?${queryString.stringify(params)}`;
    return fetchPolyfill(input, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: safeStringify([{ Text: text }]),
        useCache: true,
        usePool: true,
        translator
    });
};

/**
 * OpenAI 翻译
 * @param {*} text
 * @param {*} to
 * @param {*} from
 * @returns
 */
// eslint-disable-next-line max-params
const apiOpenaiTranslate = async (translator: any, text: any, to: any, from: any) => {
    const { openaiUrl, openaiKey, openaiModel, openaiPrompt }: any = await getSetting();
    const prompt = openaiPrompt.replaceAll(PROMPT_PLACE_FROM, from).replaceAll(PROMPT_PLACE_TO, to);
    return fetchPolyfill(openaiUrl, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: safeStringify({
            model: openaiModel,
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0,
            max_tokens: 256
        }),
        useCache: true,
        usePool: true,
        translator,
        token: openaiKey
    });
};

/**
 * 统一翻译接口
 * @param {*} param0
 * @returns
 */
export const apiTranslate = async ({ translator, q, fromLang, toLang }: any) => {
    let trText = '';
    let isSame = false;

    const from = OPT_LANGS_SPECIAL?.[translator]?.get(fromLang) ?? fromLang;
    const to = OPT_LANGS_SPECIAL?.[translator]?.get(toLang) ?? toLang;

    if (translator === OPT_TRANS_GOOGLE) {
        const res = await apiGoogleTranslate(translator, q, to, from);
        trText = res.sentences.map((item: any) => item.trans).join(' ');
        isSame = to === res.src;
    } else if (translator === OPT_TRANS_MICROSOFT) {
        const res = await apiMicrosoftTranslate(translator, q, to, '');
        const deLang = res[0].detectedLanguage.language;
        trText = res[0].translations[0].text;
        isSame = (from && from !== deLang) || q === trText;
    } else if (translator === OPT_TRANS_OPENAI) {
        const res = await apiOpenaiTranslate(translator, q, to, from);
        trText = res?.choices?.[0].message.content;
        isSame = (await detectLang(q)) === (await detectLang(trText));
    }

    return { trText, isSame };
};
