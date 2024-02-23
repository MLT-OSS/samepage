import services from '@xm/services';
import useRequest from '@ahooksjs/use-request';
import { debounce } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { useModelPermission } from './use-model-permission';
import { useConversationContext } from '@xm/context';
import { safeStringify } from '@/utils';

export const useMingJingTokenCheck = (text: string, files: []) => {
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const model = modelInfo?.key;
    const { inputCheckPermission } = useModelPermission();

    const { data, run: checkToken } = useRequest(services.chatConversation.checkToken, {
        manual: true
    });

    const check = useCallback(
        debounce((value: string, files: any) => {
            checkToken({
                key: model as string,
                msg: [{ type: 'text', value: value }, ...getMjFiles(files)]
            });
        }, 300),
        [checkToken]
    );
    // 生成明敬消息
    const getMjFiles = (files: []) => {
        const _files = files.map((i: any) => {
            const { type, value } = i;
            return { type, value: safeStringify(value) };
        });
        return _files;
    };

    useEffect(() => {
        if (inputCheckPermission) {
            check(text, files);
        }
    }, [inputCheckPermission, text, files]);

    return { isExceed: !!data?.exceed };
};
