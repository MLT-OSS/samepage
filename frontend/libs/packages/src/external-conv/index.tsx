/**
 * 外链会话
 */
import { useModelPermission } from '@xm/hooks';
import { useConversationContext } from '@xm/context';
import { EventType, eventEmitter, getValidUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { EXTERNAL_MSG } from 'types/external-msg';
import { EVENT_RESPONSE_ERROR_MESSAGE } from '@/constants';
import { IResponseErrorEventData } from '@/types';

export const ExternalConv = () => {
    const navigate = useNavigate();
    const { externalLinkPermission } = useModelPermission();
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const iframeElm = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            // 确保消息来自指定的 iframe
            if (event.source === iframeElm?.current?.contentWindow) {
                // 处理接收到的消息
                const data: EXTERNAL_MSG.IData = event.data;
                if (data.type === 'request-error') {
                    const error: IResponseErrorEventData = {
                        code: data?.data?.code,
                        message: data?.data?.message,
                        showType: 'message'
                    };
                    eventEmitter.dispatch(EventType.RESPONSE_ERROR, EVENT_RESPONSE_ERROR_MESSAGE, error);
                }
            }
        };
        window.addEventListener('message', messageHandler);
        return () => {
            window.removeEventListener('message', messageHandler);
        };
    }, []);

    const [isValid, url] = getValidUrl(externalLinkPermission?.externalLink);
    if (!isValid) {
        navigate('/404');
        return null;
    }
    return (
        <iframe
            ref={iframeElm}
            title={modelInfo?.name}
            src={url?.href}
            style={{ height: '100%', width: '100%', border: 'none' }}
        />
    );
};
