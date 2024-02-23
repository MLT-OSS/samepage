/**
 * 模型使用 hooks
 */
import { useLocation, useNavigate } from 'react-router-dom';
import { useConversationContext } from '@xm/context';
import { useLang } from './use-lang';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CONV } from '@/types';
import { useForceUpdate } from './use-force-update';

export const useConv = (type: string, model: string) => {
    const location = useLocation();
    const { dispatch, conversationState } = useConversationContext();
    const { redirectConvInfo } = conversationState;
    const [lang, setLang] = useLang();
    const forceUpdate = useForceUpdate();

    const [chatConversationInfo, setChatConversationInfo] = useState<{
        key: string;
        options?: CONV.IConversationOptions;
    }>({ key: `_${+new Date()}` });
    const [statelessConvInfo, setStatelessConvInfo] = useState<{
        key: string;
        options?: CONV.IStatelessConvOptions;
    }>({ key: `_${+new Date()}` });

    const newChatConv = useCallback(
        (options?: CONV.IConversationOptions) => {
            // 1. 设置会话组件 key&options
            setChatConversationInfo({
                key: `${model}_${+new Date()}`,
                options
            });
        },
        [model, setChatConversationInfo]
    );
    const newStatelessConv = useCallback(
        (options?: CONV.IStatelessConvOptions) => {
            // 1. 设置会话组件 key&options
            setStatelessConvInfo({
                key: `${model}_${+new Date()}`,
                options
            });
        },
        [model, setStatelessConvInfo]
    );

    const langOptions = useMemo(() => ({ lang, setLang }), [lang, setLang]);

    const navigate = useNavigate();
    useEffect(() => {
        // 挂载的时候判断 redirectConvInfo
        if (redirectConvInfo?.path) {
            navigate(redirectConvInfo?.path, {
                state: {
                    options: redirectConvInfo?.options || {}
                }
            });
            dispatch({ type: 'clean_redirect_conv' });
        }
    }, [redirectConvInfo]);

    const currModel = useRef<string>('');
    useEffect(() => {
        if (model && type) {
            if (['chat', 'assistant_chat'].includes(type)) {
                newChatConv(location?.state?.options);
            }
            if (type === 'stateless_chat') {
                newStatelessConv(location?.state?.options);
            }

            currModel.current = model;
            forceUpdate();
        }
        // FIXME: 添加的 model 可能影响新会话
    }, [location?.pathname, location?.state, model]);

    return {
        currModel,
        langOptions,
        chatConversationInfo,
        newChatConv,
        statelessConvInfo,
        newStatelessConv
    };
};
