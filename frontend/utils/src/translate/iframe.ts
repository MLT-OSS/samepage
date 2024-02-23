export const sendIframeMsg = (action: any, args: any) => {
    document.querySelectorAll('iframe').forEach((iframe) => {
        iframe?.contentWindow?.postMessage?.({ type: action, data: args }, '*');
    });
};
