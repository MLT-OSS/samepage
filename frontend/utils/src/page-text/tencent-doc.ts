import axios from 'axios';
import get from 'lodash-es/get';
import { pageTextSendMessage } from './index';

const TENCENT_DOC_PREFIX = ['doc.weixin.qq.com/doc/', 'docs.qq.com/doc/'];

/**
 *  判断是否符合腾讯文档的页面
 * @param url 页面地址
 * @returns  boolean
 */
const isMatch = (url: string) => {
    return TENCENT_DOC_PREFIX.some((item) => url.includes(item));
};

/**
 * 获取默认链接参数配置
 * @param url 页面地址
 * @returns
 */
export const getDefaultConfig = (url: string) => {
    if (!isMatch(url)) return null;
    try {
        const _url = new URL(url);
        const _pathArr = _url.pathname?.split('/');
        const _id = _pathArr?.pop();
        const _scode = _url.searchParams.get('scode');

        return {
            url: `${_url.protocol}//${
                _url.host
            }/dop-api/opendoc?id=${_id}&scode=${_scode}&t=${new Date().getTime()}&&u=null&doc_chunk_flag=0&normal=1&noEscape=1&outformat=1&preview_token=&shortcut_id=&commandsFormat=0`,
            method: 'GET',
            parsePaths: [
                'clientVars.collab_client_vars.initialAttributedText.text[0].commands[0].mutations[0].s',
                'initialTitle'
            ]
        };
    } catch (e) {
        console.log('❌tencent doc parse error: ', e);
        return null;
    }
};

export const getText = async (url: string, DOM?: Document) => {
    if (!isMatch(url)) return '';
    const _requestParams: any = await pageTextSendMessage();
    if (_requestParams) {
        const { url, method, parsePaths } = _requestParams;
        const _res = await axios({
            url,
            method
        });
        const _data = _res.data || _res;
        for (const parsePath of parsePaths) {
            const text = get(_data, parsePath);
            if (text) {
                // eslint-disable-next-line no-control-regex
                return text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');
            }
        }
    }
};
