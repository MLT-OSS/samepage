import { EXT_DISABLED_URL_REG, MSG_OPEN_LOGIN, STORAGE_OPEN_TIMES } from '@/constants';
import { getSessionValue, setSessionValue } from '../storage';
import SparkMD5 from 'spark-md5';
import { CONV_CONTEXT } from 'types/conv-context';

const getUrl = ({ domain = '', port = '', path = '' }) => `${domain}${port ? `:${port}` : ''}${path}`;

// new URL 不能处理下面 case
// new URL('/test?a=123','http://baidu.com/abc/')
export const getRedirectUrl = (serverPath = '', redirect = '') => {
    const isServerPathSlashSuffix = serverPath.slice(-1) === '/';
    const isRedirectSlashPrefix = redirect[0] === '/';

    if (isServerPathSlashSuffix && isRedirectSlashPrefix) {
        return `${serverPath.slice(0, -1)}${redirect}`;
    }
    if (!isServerPathSlashSuffix && !isRedirectSlashPrefix) {
        return `${serverPath}/${redirect}`;
    }
    return `${serverPath}${redirect}`;
};

export const ENV = process.env;

const {
    NX_PLATFORM,
    NX_API_DOMAIN,
    NX_LOGIN_DOMAIN,
    NX_WEB_PORT,
    NX_LOGIN_PATH,
    NX_PREFECT_CORP_INFO_PATH,
    NX_TASK_TARGET_CONFIGURATION,
    NX_SSE_DOMAIN,
    NX_SSE_PORT,
    NX_SSE_PATH,
    NX_LOGIN_PORT,
    NX_WEB_DOMAIN,
    NX_WEB_PATH,
    NX_API_PORT,
    NX_API_PATH,
    NX_HOME_DOMAIN,
    NX_HOME_PORT,
    NX_HOME_BASE_URL,
    NX_LOGIN_BASE_URL,
    NX_DOC_CHAT_BASE_URL,
    NX_DOC_CHAT_DOMAIN,
    NX_DOC_CHAT_PORT,
    NX_DOC_CHAT_PATH,
    NX_VERSION_KEY,
    NX_VERSION_VALUE,
    NX_WEB_BASE_URL,
    NX_EXT_DOWNLOAD_DOMAIN,
    NX_EXT_DOWNLOAD_PATH,
    NX_H5_BASE_URL,
    NX_H5_DOMAIN,
    NX_H5_PORT,
    NX_H5_PATH,
    NX_CTM_DOMAIN,
    NX_CTM_PORT,
    NX_CTM_BASE_URL,
    NX_CTM_PATH,
    NX_CTM_PROMPT_PATH,
    NX_CTM_APPROVE_PATH,
    NX_SCRIPTS_BASE_URL,
    NX_SCRIPTS_DOMAIN,
    NX_SCRIPTS_PORT,
    NX_SCRIPTS_PATH,
    NX_PLAYGROUND_DOMAIN,
    NX_PLAYGROUND_PORT,
    NX_PLAYGROUND_BASE_URL,
    NX_PLAYGROUND_PATH,
    NX_FEED_BACK_URL
} = ENV;

export const VERSION_KEY = NX_VERSION_KEY;
export const VERSION_VALUE = NX_VERSION_VALUE;

export const FEED_BACK_URL = NX_FEED_BACK_URL;

export const HOME_URL = getUrl({
    domain: NX_HOME_DOMAIN,
    port: NX_HOME_PORT,
    path: `${NX_HOME_BASE_URL}`
});

export const isExtension = !!(NX_PLATFORM && ['extension'].includes(NX_PLATFORM));

export const isMini = !isExtension && window?.__wxjs_environment === 'miniprogram';

export const isDocChat = !!(NX_PLATFORM && ['doc-chat'].includes(NX_PLATFORM));

export const isH5 = !!(NX_PLATFORM && ['h5'].includes(NX_PLATFORM));

export const isWeb = !!(NX_PLATFORM && ['web'].includes(NX_PLATFORM));

export const API_DOMAIN = getUrl({ domain: NX_API_DOMAIN, port: NX_API_PORT, path: NX_API_PATH });

export const getApiDomain = async () => {
    const _commonApiUrl = (await getSessionValue('API_DOMAIN')) as string;
    if (_commonApiUrl) {
        return _commonApiUrl;
    }
    return API_DOMAIN;
};

export const LOGIN_URL = getUrl({
    domain: NX_LOGIN_DOMAIN,
    port: NX_LOGIN_PORT,
    path: `${NX_LOGIN_BASE_URL}${NX_LOGIN_PATH}`
});

export const getLoginUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_LOGIN_BASE_URL}${NX_LOGIN_PATH}`;
    }
    return LOGIN_URL;
};

// 完善企业信息页面
export const PREFECT_CORP_INFO_URL = getUrl({
    domain: NX_LOGIN_DOMAIN,
    port: NX_LOGIN_PORT,
    path: `${NX_LOGIN_BASE_URL}${NX_PREFECT_CORP_INFO_PATH}`
});

export const getProjectCorpInfoUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_LOGIN_BASE_URL}${NX_PREFECT_CORP_INFO_PATH}`;
    }
    return PREFECT_CORP_INFO_URL;
};

export const WEB_DEFAULT_URL = getUrl({
    domain: NX_WEB_DOMAIN,
    port: NX_WEB_PORT,
    path: `${NX_WEB_BASE_URL}${NX_WEB_PATH}`
});

export const getWebDefaultUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_WEB_BASE_URL}${NX_WEB_PATH}`;
    }
    return WEB_DEFAULT_URL;
};

export const PLAYGROUND_DEFAULT_URL = getUrl({
    domain: NX_PLAYGROUND_DOMAIN,
    port: NX_PLAYGROUND_PORT,
    path: `${NX_PLAYGROUND_BASE_URL}${NX_PLAYGROUND_PATH}`
});

export const getPlaygroundDefaultUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_PLAYGROUND_BASE_URL}${NX_PLAYGROUND_PATH}`;
    }
    return PLAYGROUND_DEFAULT_URL;
};

export const H5_DEFAULT_URL = getUrl({
    domain: NX_H5_DOMAIN,
    port: NX_H5_PORT,
    path: `${NX_H5_BASE_URL}${NX_H5_PATH}`
});

export const getH5DefaultUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_H5_BASE_URL}${NX_H5_PATH}`;
    }
    return H5_DEFAULT_URL;
};

export const CTM_DEFAULT_URL = getUrl({
    domain: NX_CTM_DOMAIN,
    port: NX_CTM_PORT,
    path: `${NX_CTM_BASE_URL}${NX_CTM_PATH}`
});

export const getCtmDefaultUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_CTM_BASE_URL}${NX_CTM_PATH}`;
    }
    return CTM_DEFAULT_URL;
};

export const CTM_PROMPT_URL = getUrl({
    domain: NX_CTM_DOMAIN,
    port: NX_CTM_PORT,
    path: `${NX_CTM_BASE_URL}${NX_CTM_PROMPT_PATH}`
});

export const getCtmPromptUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_CTM_BASE_URL}${NX_CTM_PROMPT_PATH}`;
    }
    return CTM_PROMPT_URL;
};

export const CTM_APPROVE_URL = getUrl({
    domain: NX_CTM_DOMAIN,
    port: NX_CTM_PORT,
    path: `${NX_CTM_BASE_URL}${NX_CTM_APPROVE_PATH}`
});

export const getCtmApproveUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_CTM_BASE_URL}${NX_CTM_APPROVE_PATH}`;
    }
    return CTM_APPROVE_URL;
};

export const SSE_URL = getUrl({ domain: NX_SSE_DOMAIN, port: NX_SSE_PORT, path: NX_SSE_PATH });

export const EXT_DOWNLOAD_URL = getUrl({ domain: NX_EXT_DOWNLOAD_DOMAIN, path: NX_EXT_DOWNLOAD_PATH });

export const DOC_CHAT_URL = getUrl({
    domain: NX_DOC_CHAT_DOMAIN,
    port: NX_DOC_CHAT_PORT,
    path: `${NX_DOC_CHAT_BASE_URL}${NX_DOC_CHAT_PATH}`
});

export const getDocChatUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_DOC_CHAT_BASE_URL}${NX_DOC_CHAT_PATH}`;
    }
    return DOC_CHAT_URL;
};

export const SCRIPTS_URL = getUrl({
    domain: NX_SCRIPTS_DOMAIN,
    port: NX_SCRIPTS_PORT,
    path: `${NX_SCRIPTS_BASE_URL}${NX_SCRIPTS_PATH}`
});

export const getScriptsUrl = async () => {
    const _commonApiUrl = (await getSessionValue('WEB_DOMAIN')) as string;
    if (_commonApiUrl) {
        const _url = new URL(_commonApiUrl);
        return `${_url.origin}${NX_SCRIPTS_BASE_URL}${NX_SCRIPTS_PATH}`;
    }
    return SCRIPTS_URL;
};

export const PLATFORM_URL_MAP: { [k: string]: string } = {
    'doc-chat': DOC_CHAT_URL,
    web: WEB_DEFAULT_URL,
    h5: H5_DEFAULT_URL,
    ctm: CTM_DEFAULT_URL,
    playground: PLAYGROUND_DEFAULT_URL
};

export const isDev = () => NX_TASK_TARGET_CONFIGURATION && ['development'].includes(NX_TASK_TARGET_CONFIGURATION);

export const safeStringify = (obj: any) => {
    if (!obj) {
        return obj;
    }

    try {
        return JSON.stringify(obj);
    } catch (error) {
        console.error('JSON.stringify 出错了:', error);
        return null;
    }
};

export const safeParse = (str: string) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        console.error('JSON.parse 出错了:', error);
        return null;
    }
};

export const downFile = (url?: string) => {
    if (!url) return;
    const paths = url.split('//')[1].split('/');
    const imgName = paths[paths.length - 1];
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = imgName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    /*
     * download: HTML5新增的属性
     * url: 属性的地址必须是非跨域的地址
     */
};
export const downloadImage = (imgsrc: string, name: string, type = 'png') => {
    const image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context?.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob(function (blob) {
            if (blob) {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = name || 'pic';
                a.click();
            }
        });
    };
    // 将资源链接赋值过去，才能触发image.onload 事件
    image.src = imgsrc;
};

export const setPageOpenTime = async () => {
    // 记录home页面打开次数 可能会超过number范围
    const times = await getSessionValue(STORAGE_OPEN_TIMES);
    let newTimes = 1;
    if (times) {
        newTimes = Number(times) + 1;
    }
    await setSessionValue({ key: STORAGE_OPEN_TIMES, value: newTimes });
};

export const getTimeStr = (s = '') => {
    const [date = '', time] = s.split(' ');
    const [year, month, day] = date.split('-');

    return [`${Number(year) || '-'}/${Number(month) || '-'}/${Number(day) || '-'}`, time || '-'];
};

export const replaceByIdx = <T>(array: T[], index = 0, ele: T): T[] => {
    if (!Array.isArray(array)) {
        return [];
    }

    let idx = index;
    if (idx < 0) {
        const length = array.length;
        idx = length + idx;

        if (idx < 0) {
            return [];
        }
    }

    return [...array.slice(0, idx), ele, ...array.slice(idx + 1)];
};

/**
 * 正则获取提示词中 [] 里面的变量内容
 */
export const getPromptVars = (text: string) => {
    const regex = /\[([^\]]*)\]/g;
    const matches = text.match(regex)?.map((match) => match.slice(1, -1));
    return matches || [];
};

export const formatFileSize = (size = 0) => {
    if (size < 1024) {
        return size + 'B';
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB';
    } else {
        return (size / 1024 / 1024).toFixed(2) + 'M';
    }
};

export const genFileMd5 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const blobSlice =
            File.prototype.slice || (File.prototype as any).mozSlice || (File.prototype as any).webkitSlice;
        const chunkSize = 2097152; // Read in chunks of 2MB
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();

        fileReader.onload = function (e) {
            spark.append(e?.target?.result as ArrayBuffer); // Append array buffer
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                resolve(spark.end());
            }
        };

        fileReader.onerror = function () {
            reject(new Error('生成 md5 失败'));
        };

        function loadNext() {
            const start = currentChunk * chunkSize;
            const end = start + chunkSize >= file.size ? file.size : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext();
    });
};

export interface GenWebDocUrlParams {
    docId: string;
    conversationId: string;
    lang: string;
}

export const genWebDocUrl = async ({ docId, conversationId, lang }: GenWebDocUrlParams) => {
    const _docChatUrl = await getDocChatUrl();
    return `${_docChatUrl}?docId=${docId}&lang=${lang}&conversationId=${conversationId || ''}`;
};

export const getDocLinkInfo = (data: string) => {
    let res: any = {};
    try {
        res = safeParse(data as string);
    } catch {}
    return res as { docId: string; docName: string };
};

export const getQueryString = (location: Location, name: string) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = (location?.search ?? '').substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
};

export const isExtDisabledUrl = (url: string) => EXT_DISABLED_URL_REG.test(url);

export const getValidUrl = (url?: string): [boolean, URL?] => {
    if (!url) {
        return [false];
    }

    try {
        const res = new URL(url);
        return [true, res];
    } catch {
        return [false];
    }
};

export const isFutureSupported = (modelInfo: CONV_CONTEXT.IModelInfo) => {
    return (modelInfo?.feature ?? []).includes('future_supported' as any);
};

/**
 * 文件生成临时url
 */

export const getObjectURL = (file: File) => {
    let url = null;
    if (window.URL) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
};

/**
 * 开通企业账号
 */
export const onPrefectCorpInfo = async () => {
    if (isExtension) {
        const Browser = await import('webextension-polyfill');
        Browser.runtime.sendMessage({
            type: MSG_OPEN_LOGIN,
            data: {
                action: 'prefect-corp-info',
                windowScreenLeft: window?.screenLeft,
                windowScreenTop: window?.screenTop,
                windowWidth: window?.outerWidth,
                windowHeight: window?.outerHeight
            }
        });
    } else {
        window.location.href = PREFECT_CORP_INFO_URL;
    }
};
