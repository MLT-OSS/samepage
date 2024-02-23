import queryString from 'query-string';
import { MSG_FORM_LOGIN, STORAGE_LOGIN_SEARCH } from '@/constants';
import { PLATFORM_URL_MAP, getRedirectUrl, getWebDefaultUrl } from '../utils';

export const pwdPattern = {
    pattern: /^[0-9A-z!@#$%^&*()-=¡£_+`~.,<>/?;:'"|[\]{}]{6,20}$/,
    errMsg: '请输入6-20位数字、字母以及特殊字符的密码'
};

// 手机验证码正则
export const VERIFY_CODE_PATTERN = {
    pattern: /^\d{6}$/,
    errorMsg: '请输入正确的验证码'
};

export const navigateToChat = (search?: string) => {
    const sessionLoginSearch = sessionStorage.getItem(STORAGE_LOGIN_SEARCH);

    const searchParams = queryString.parse((search || sessionLoginSearch) ?? '');

    if (searchParams?.platform === 'extension') {
        chrome.runtime.sendMessage(searchParams?.appId as string, {
            type: MSG_FORM_LOGIN,
            data: {
                sourceTabId: searchParams?.tabId,
                appId: searchParams?.appId,
                redirect: searchParams?.redirect
            }
        });
    } else {
        (async () => {
            const _webDefaultUrl = await getWebDefaultUrl();
            const targetUrl = PLATFORM_URL_MAP[searchParams.target as string] ?? _webDefaultUrl;
            window.location.href = getRedirectUrl(targetUrl, searchParams?.redirect as string);
        })();
    }
};
