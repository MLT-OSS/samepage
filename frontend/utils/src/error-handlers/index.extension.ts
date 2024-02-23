import Browser from 'webextension-polyfill';
import type { Tabs } from 'webextension-polyfill';

export const _sendMessage: Tabs.Static['sendMessage'] = (id, message, options) => {
    return Browser.tabs.sendMessage(id, message, options);
};
