/* eslint-disable max-nested-callbacks */
import Browser from 'webextension-polyfill';
import queryString from 'query-string';
import {
    MSG_OPEN_MAIN,
    MSG_REQUEST,
    MSG_REQUEST_STREAM_PAUSE,
    MSG_OPEN_LOGIN,
    MSG_RESPONSE_TAB_ID,
    MSG_FORM_LOGIN,
    MSG_LOGIN_SUCCESS,
    MSG_ABORT_REQUEST
} from '@/constants';
import {
    isDev,
    umiRequest,
    __sseRequest,
    translate,
    setSessionValue,
    PREFECT_CORP_INFO_URL,
    getLoginUrl
} from '@/utils';
import { abortRequestMap } from 'utils/src/request/abort-map';
const {
    MSG_FETCH,
    MSG_FETCH_LIMIT,
    MSG_FETCH_CLEAR,
    DEFAULT_SETTING,
    DEFAULT_RULES,
    DEFAULT_SYNC,
    STOKEY_SETTING,
    STOKEY_RULES,
    STOKEY_SYNC,
    CACHE_NAME,

    getSetting,
    trySyncAll,
    fetchData,
    fetchPool,
    trySyncAllSubRules
} = translate;

let cancelSseFun: () => void;

// 存储当前打开的 window 窗口
// 目前有两个场景会打开 window 窗口
// 1. 登录; 2. 完善企业信息
const currWindowObj: Record<string, Browser.Windows.Window | null> = {};

// manifest.json 的 Permissions配置需添加 declarativeContent 权限
Browser.runtime.onInstalled.addListener(function (info) {
    setSessionValue({ key: STOKEY_SETTING, value: DEFAULT_SETTING });
    setSessionValue({ key: STOKEY_RULES, value: DEFAULT_RULES });
    setSessionValue({ key: STOKEY_SYNC, value: DEFAULT_SYNC });

    // 开发环境刷新页面
    if (isDev() && info.reason === 'update') {
        chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
            tabs.forEach((tab) => {
                // 1. reload 页面
                chrome.tabs.reload(tab.id!).then(() => {
                    setTimeout(() => {
                        openExtension(tab);
                    }, 3000);
                });
            });
        });
    }

    // 默认先禁止Page Action。如果不加这一句，则无法生效下面的规则
    chrome.action.disable();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // 设置规则
        const rule = {
            // 运行插件运行的页面URL规则
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        schemes: ['https', 'http']
                    }
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()] // 控制点击 action 操作
        };
        // 执行规则
        chrome.declarativeContent.onPageChanged.addRules([rule]);
    });
});

/**
 * 浏览器启动
 */
Browser.runtime.onStartup.addListener(async () => {
    // 同步数据
    await trySyncAll(true);

    // 清除缓存
    const setting: any = await getSetting();
    if (setting.clearCache) {
        caches.delete(CACHE_NAME);
    }

    // 同步订阅规则
    trySyncAllSubRules(setting, true);
});

async function openExtension(tab: any) {
    const { id } = tab;

    if (!id) {
        return;
    }

    Browser.tabs.sendMessage(id, { type: MSG_OPEN_MAIN, data: {} }).catch(() => void 0);
}

// 点击插件图标打开插件
Browser.action.onClicked.addListener(async (tab) => {
    await openExtension(tab);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 接收来自 content script 的消息，requset 里不允许传递 function 和 file 类型的参数
    chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
        const tabWindow = tabs[0];
        const { type, data } = message;
        // 处理常规请求
        if (type === MSG_REQUEST) {
            /** 返回content的数据c格式以 success 状态来判断是否成功 */
            const resp = await umiRequest(data.url, { ...data.options, [MSG_RESPONSE_TAB_ID]: tabWindow?.id });
            sendResponse(resp);
        }
        if (type === MSG_ABORT_REQUEST) {
            const controller = abortRequestMap.get(data.abortId);
            controller?.abort();
        }
        if (type === MSG_OPEN_LOGIN) {
            const popupWidth = 800;
            const popupHeight = 720;
            const {
                action = 'login',
                redirect = '/',
                windowScreenLeft = 0,
                windowScreenTop = 0,
                windowWidth = tabWindow.width,
                windowHeight = tabWindow.height
            } = data;

            const leftOffset = windowWidth ? Math.round(windowWidth / 2 - popupWidth / 2 + windowScreenLeft) : 0;
            const topOffset = windowHeight ? Math.round(windowHeight / 2 - popupHeight / 2 + windowScreenTop) : 0;

            const search = queryString.stringify({
                redirect,
                appId: Browser.runtime.id,
                tabId: tabWindow?.id,
                platform: 'extension'
            });

            const _loginUrl = await getLoginUrl();
            const targetUrl = action === 'login' ? _loginUrl : PREFECT_CORP_INFO_URL;
            const currWin = currWindowObj[action];

            let isWinExist = false;
            try {
                if (currWin) {
                    await Browser.windows.get(currWin?.id as number);
                    isWinExist = true;
                }
            } catch {}
            if (isWinExist) {
                // 展示已有窗口方案
                // await Browser.windows.update(currWin?.id as number, { focused: true });
                // return;
                await Browser.windows.remove(currWin?.id as number);
            }

            currWindowObj[action] = await Browser.windows.create({
                url: `${targetUrl}?${search}`,
                type: 'popup',
                width: popupWidth,
                height: popupHeight,
                left: leftOffset,
                top: topOffset
            });
        }
        if (type === MSG_REQUEST_STREAM_PAUSE) {
            cancelSseFun?.();
        }

        switch (type) {
            case MSG_FETCH:
                fetchData(data.input, data.opts)
                    .then((res) => {
                        sendResponse({ success: true, data: res });
                    })
                    .catch((error) => {
                        sendResponse({ error: error.message });
                    });
                break;
            case MSG_FETCH_LIMIT:
                fetchPool.update(data.interval, data.limit);
                sendResponse({ success: true, data: 'ok' });
                break;
            case MSG_FETCH_CLEAR:
                fetchPool.clear();
                sendResponse({ success: true, data: 'ok' });
                break;
            default:
                sendResponse({ error: `message action is unavailable: ${type}` });
        }
    });
    return true;
});

Browser.runtime.onMessageExternal.addListener((message, sender) => {
    const { type, data = {} } = message;
    if (type === MSG_FORM_LOGIN) {
        const { sourceTabId, redirect, appId } = data;
        if (sourceTabId && appId === Browser.runtime.id) {
            Browser.tabs
                .sendMessage(Number(sourceTabId), {
                    type: MSG_LOGIN_SUCCESS,
                    data: {
                        redirect
                    }
                })
                .then(() => {
                    Browser.tabs.remove(Number(sender.tab?.id));
                    Browser.tabs.update(Number(sourceTabId), {
                        active: true,
                        highlighted: true
                    });
                });
        }
    }
});

Browser.runtime.onConnect.addListener(async (port) => {
    port.onMessage.addListener(async ({ url, data }: { url: string; data: any }) => {
        try {
            const { runSseRequest, cancelSseRequest } = __sseRequest(url, {
                onSuccess: (res) => {
                    port?.postMessage(res);
                },
                extensionTabId: port?.sender?.tab?.id as any
            });
            runSseRequest(data);
            cancelSseFun = cancelSseRequest;
        } catch (err: any) {
            console.error('打印报错信息', err);
            port.postMessage({ error: err.message });
        }
    });
});

Browser.windows.onRemoved.addListener((windowId) => {
    const removeActionKey = Object.entries(currWindowObj).find((i) => i[1]?.id === windowId)?.[0];
    if (removeActionKey) {
        currWindowObj[removeActionKey] = null;
    }
});
