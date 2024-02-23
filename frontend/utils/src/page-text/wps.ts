import axios from 'axios';
import get from 'lodash-es/get';
import { pageTextSendMessage } from './index';
import { getText as getPDFText } from './pdf';

const getWPSClientId = (DOM?: Document) => {
    if (!DOM) return null;
    const scriptText = DOM.querySelector('script')?.innerHTML;
    const clientIdMatch = scriptText?.match(/"conn_id":"(\w+)"/);
    return clientIdMatch?.[1];
};

/**
 *  判断是否符合金山文档/WPS的页面
 * @param url 页面地址
 * @returns  boolean
 */
const isMatch = (url: string) => {
    const _url = new URL(url);
    return _url.hostname.includes('kdocs.cn');
};

/**
 * 获取默认链接参数配置
 * @param url 页面地址
 * @returns
 */
export const getDefaultConfig = (url: string, DOM?: Document) => {
    if (!isMatch(url)) return null;
    try {
        const _url = new URL(url);
        const _pathArr = _url.pathname?.split('/');
        const _id = _pathArr?.pop();
        const clientId = getWPSClientId(DOM);
        if (!clientId) throw new Error('wps clientId is not found');

        return {
            url: `https://www.kdocs.cn/api/v3/office/file/${_id}/export`,
            method: 'POST',
            data: {
                format: 'pdf',
                options: {
                    showCommentBalloon: false,
                    withBackground: false,
                    zoomPrint: { paperWidth: 0, paperHeight: 0 },
                    revision: { revisionsView: 0, revisionsShowMarkup: true }
                },
                print: true,
                clientId
            },
            parsePaths: ['url']
        };
    } catch (e) {
        console.log('❌wps url config error: ', e);
        return null;
    }
};

export const getText = async (url: string) => {
    if (!isMatch(url)) return '';
    const _requestParams: any = await pageTextSendMessage();
    if (_requestParams) {
        const { url, method, parsePaths, data } = _requestParams;
        const _res = await axios({
            url,
            method,
            data
        });
        const _data = _res.data || _res;
        for (const parsePath of parsePaths) {
            const url = get(_data, parsePath);
            if (url) {
                return await getPDFText(url);
            }
        }
    }
    return '';
};
