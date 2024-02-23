import services from '@xm/services';
import useRequest from '@ahooksjs/use-request';
import { debounce } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { useModelPermission } from './use-model-permission';
import { useConversationContext } from '@xm/context';

export const useChatTokenCheck = (text: string) => {
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const model = modelInfo?.key;
    const { inputCheckPermission } = useModelPermission();

    const { data, run: checkToken } = useRequest(services.chatConversation.checkToken, {
        manual: true
    });

    const check = useCallback(
        debounce((value: string) => {
            checkToken({
                key: model as string,
                msg: [{ type: 'text', value: value }]
            });
        }, 300),
        [checkToken]
    );

    useEffect(() => {
        if (inputCheckPermission) {
            check(text);
        }
    }, [inputCheckPermission, text]);

    return { isExceed: !!data?.exceed };
};
