// 创建一个返回Promise的函数
export const sendMessage = (iframe: HTMLIFrameElement, message: any) => {
    return new Promise((resolve, reject) => {
        if (!(iframe.contentWindow?.postMessage && typeof iframe.contentWindow?.postMessage === 'function'))
            reject('sendMessage Error: iframe.contentWindow.postMessage is not a function');
        // 向子窗口发送消息
        iframe?.contentWindow?.postMessage(message, '*');

        // 设置一个监听器来接收子窗口的回应
        window.addEventListener(
            'message',
            (event) => {
                // 在这里检查event.origin和event.source来确保这个消息是从你期望的窗口发送来的
                resolve(event.data);
            },
            { once: true }
        ); // 设置once为true，监听器接收到消息后会自动移除
    });
};
