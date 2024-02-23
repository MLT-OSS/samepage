import { RcFile } from 'antd/lib/upload';

export const isMobile = () => {
    const flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag;
};
export const isPad = () => {
    const flag = navigator.userAgent.match(/(pad|iPad)/i);
    return flag;
};

export const systemInfo = () => {
    const system = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(system)) {
        return 'ios';
    } else if (/(Android|Adr)/i.test(system)) {
        return 'android';
    }
    return '';
};

export const hasNotch = () => {
    if (CSS.supports('padding-left: constant(safe-area-inset-bottom)')) {
        const div = document.createElement('div');

        div.style.paddingBottom = 'constant(safe-area-inset-bottom)';

        document.body.appendChild(div);

        const calculatedPadding = parseInt(window.getComputedStyle(div).paddingBottom);

        document.body.removeChild(div);

        if (calculatedPadding > 0) {
            return calculatedPadding;
        }
    }
    if (CSS.supports('padding-left: env(safe-area-inset-bottom)')) {
        const div = document.createElement('div');

        div.style.paddingBottom = 'env(safe-area-inset-bottom)';

        document.body.appendChild(div);

        const calculatedPadding = parseInt(window.getComputedStyle(div).paddingBottom);

        document.body.removeChild(div);

        if (calculatedPadding > 0) {
            return calculatedPadding;
        }
    }

    return 0;
};

export enum QrCodeStatus {
    NORMAL = 1,
    TIMEOUT = 2,
    SUCCESS = 3,
    WAITING = 4
}

export const shareContentType = {
    video: 'video', // 视频分享
    collection: 'collection' // 集合分享
};

export const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const formatNumberTwo = (num: number): string => {
    if (num < 10) {
        return `0${Math.max(0, num)}`;
    }
    return String(num);
};

export const formatTime = (sec: number) => {
    const HH = formatNumberTwo(Math.floor(sec / 3600));
    const MM = formatNumberTwo(Math.floor((sec / 60) % 60));
    const SS = formatNumberTwo(Math.floor(sec % 60));
    return sec < 3600 ? `${MM}:${SS}` : `${HH}:${MM}:${SS}`;
};

/**
 * 企业微信官方提供的 ua
 * iPhone:Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 wxwork/2.2.0 MicroMessenger/6.3.2
 * Android:Mozilla/5.0 (Linux; Android 7.1.2; g3ds Build/NJH47F; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043508 Safari/537.36 wxwork/2.2.0 MicroMessenger/6.3.22 NetType/WIFI Language/zh
 * Windows:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36 wxwork/2.1.3 (MicroMessenger/6.2) WindowsWechat QBCore/3.43.644.400 QQBrowser/9.0.2524.400
 * Mac:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/603.3.8 (KHTML, like Gecko) wxwork/2.2.0 (MicroMessenger/6.2) WeChat/2.0.4
 */
const is = (regexp: RegExp) => () => {
    return regexp.test(window.navigator.userAgent);
};

/* 是否是微信内置浏览器 */
export const isWx = is(/MicroMessenger/i);

/* 是否是手机打开 */
export const isMobileTerminal = is(/mobile/i);

// 智能问答充值产品名称
export const productionNames: Record<string, any> = {
    '1': 20,
    '2': 150,
    '3': 700,
    '4': 1500
};
// 智能问答模式名称
export const modelNames: Record<string, any> = {
    'GPT-QA': '一问一答',
    'GPT-CHAT': '多轮对话' // 名称待定
};
// 智能问答模式最大值限制
export const modelMaxToken: Record<string, any> = {
    'GPT-QA': 2000,
    'GPT-CHAT': 2000
};
// 智能问答模式最小值限制
export const modelMinToken: Record<string, any> = {
    'GPT-QA': 1000,
    'GPT-CHAT': 1000
};
// 智能问答模式弹出切换新对话限制
export const multipleRoundsMaxToken = 4097;
// 预期回答token
export const multipleRoundsAnswerToken = 1024;
