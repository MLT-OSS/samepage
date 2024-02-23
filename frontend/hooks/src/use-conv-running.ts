import { useConversationContext } from '@xm/context';
import services from '@xm/services';
import { GetBotConvKeyConvIdMsgMsgIdResponse } from '@/ytt-type/conversation';
import useRequest from '@ahooksjs/use-request';
import { useEffect, useRef } from 'react';

export const useConvRunning = (
    isRunning: boolean,
    convId: string,
    msgId: string,
    successCb: (msg: GetBotConvKeyConvIdMsgMsgIdResponse) => void
    // eslint-disable-next-line max-params
) => {
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const model = modelInfo?.key;
    const getMessageInfoLoading = useRef<boolean>(false);

    const { run: getMessageInfo, cancel: cancelMessageInfo } = useRequest(services.conversation.getMessageInfo, {
        manual: true,
        pollingInterval: 1000,
        throwOnError: true,
        onSuccess: (res: GetBotConvKeyConvIdMsgMsgIdResponse) => {
            successCb(res);
            if (res.status !== 'RUNNING') {
                stopGetMessageInfo();
            }
        },
        onError: () => {
            stopGetMessageInfo();
        }
    });
    const stopGetMessageInfo = () => {
        cancelMessageInfo();
        getMessageInfoLoading.current = false;
    };

    useEffect(() => {
        if (isRunning && !getMessageInfoLoading.current) {
            getMessageInfoLoading.current = true;
            getMessageInfo({
                key: model as string,
                convId,
                msgId
            });
        }
    }, [isRunning, getMessageInfoLoading, model, convId, msgId]);

    useEffect(() => {
        return () => {
            stopGetMessageInfo();
        };
    }, []);
};
