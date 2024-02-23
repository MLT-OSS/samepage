/**
 * 发送消息给 background
 */
export const sendMsg = async (action: string, args?: any) => {
    const Browser = await import('webextension-polyfill');
    return Browser?.runtime?.sendMessage({ type: action, data: args });
};
