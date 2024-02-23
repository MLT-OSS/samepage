import Browser from 'webextension-polyfill';

export const _loadSrc = (uri: string) => {
    return Browser.runtime.getURL(uri);
};
