import { ASYNC_SCRIOPTS_ID } from '@/constants';
/**
 *  判断是否包含 iframe 页面
 * @returns  boolean
 */
const isMatch = () => {
    try {
        const _iframes = document.querySelectorAll('iframe');
        return _iframes.length > 0;
    } catch (e) {
        console.log('❌PDF url parse error: ', e);
        return false;
    }
};

export const getText = async (url: string, DOM?: Document) => {
    if (!isMatch() || !DOM) return '';
    try {
        const _iframes = DOM.querySelectorAll('iframe');
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < _iframes.length; i++) {
            const _iframe = _iframes[i];
            if (_iframe.id !== ASYNC_SCRIOPTS_ID) {
                const _iframeDoc = _iframe.contentDocument || _iframe.contentWindow?.document;
                const _iframeText = _iframeDoc?.body?.innerText;
                // eslint-disable-next-line max-depth
                if (_iframeText) {
                    return _iframeText;
                }
            }
        }
        return '';
    } catch (e) {
        console.log('❌获取 iframe 内容错误: ', e);
        return '';
    }
};
