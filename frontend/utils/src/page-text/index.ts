import { ASYNC_SCRIOPTS_ID, READ_PAGE_TEXT, GET_READ_PAGE_CONFIG } from '@/constants';
import { sendMessage } from '../send-message';

import { getText as getTencentDocText, getDefaultConfig as getTencentDocConfig } from './tencent-doc';
import { getText as getPDFText } from './pdf';
import { getText as getIframeText } from './iframe';
import { getText as getWpsText, getDefaultConfig as getWpsConfig } from './wps';

/**
 * 根据相关匹配规则列表，获取页面文本
 * 优先获取到文本的直接返回
 */
const getTexts = [getPDFText, getWpsText, getTencentDocText, getIframeText];

export const beforeGetBodyText = async (url: string, DOM?: Document) => {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < getTexts.length; i++) {
        const getTextFunc = getTexts[i];
        const text = await getTextFunc?.(url, DOM);
        if (text) {
            return text;
        }
    }
    return '';
};

/**
 * 根据相关匹配规则列表，获取请求配置
 * 优先获取到的配置直接返回
 */
const getConfigs = [getWpsConfig, getTencentDocConfig];
export const getPageTextConfig = async (url: string, DOM?: Document) => {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < getConfigs.length; i++) {
        const getConfigFunc = getConfigs[i];
        const config = await getConfigFunc?.(url, DOM);
        if (config) {
            return config;
        }
    }
    return null;
};

export const pageTextSendMessage = async () => {
    const iframe = document.getElementById(ASYNC_SCRIOPTS_ID) as HTMLIFrameElement;
    // console.log(iframe, 'iframe');
    if (iframe) {
        const msg: any = await sendMessage(iframe, {
            type: READ_PAGE_TEXT,
            data: {
                url: location.href,
                domInnerHtml: window.document.head.innerHTML + window.document.body.innerHTML
            }
        });
        console.log(msg, 'pageTextSendMessage');
        const { type, data } = msg;
        if (type === GET_READ_PAGE_CONFIG) {
            return data;
        }
    }
};
