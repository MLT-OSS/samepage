// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from 'react';
import { getPageTextConfig } from '@/utils';
import { READ_PAGE_TEXT, GET_READ_PAGE_CONFIG } from '@/constants';

export function App() {
    useEffect(() => {
        console.log('app mounted');
        const onMessage = async (event: MessageEvent) => {
            const { type, data } = event?.data || {};
            if (type === READ_PAGE_TEXT) {
                const { url, domInnerHtml } = data || {};
                const doc = new DOMParser().parseFromString(domInnerHtml, 'text/html');
                const config = await getPageTextConfig(url, doc);
                window.parent.postMessage({ type: GET_READ_PAGE_CONFIG, data: config }, event.origin);
            }
        };
        window.addEventListener('message', onMessage);
        return () => {
            console.log('app unmounted');
            window.removeEventListener('message', onMessage);
        };
    }, []);
    return <div id="__xm_async_scripts__">异步加载scripts</div>;
}

export default App;
