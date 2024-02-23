/**
 * 模型权限(多类型模型共用权限)
 */
import { useConversationContext } from '@xm/context';
import { PERMISSION } from '@/types';
import { useMemo } from 'react';

export const useModelPermission = () => {
    const { conversationState } = useConversationContext();
    const { modelInfo } = conversationState;
    const {
        input_check: inputCheckPermission = false,
        'message:redirect': messageRedirectPermission = false,
        text_input: textInputPermission = false,
        image_input: imageInputPermission = false,
        video_input: videoInputPermission = false,
        template_input: templateInputPermission = false,
        web_search: webSearchPermission = false,
        external_link: externalLinkPermission = false,
        future_supported: futureSupported = false,
        edit_question: editQuestionPermission = false,
        change_answer: changeAnswerPermission = false
    } = (modelInfo?.feFeature || {}) as any;
    const langPermission = !!modelInfo?.lang?.length;
    const langOptions = useMemo(() => {
        return (modelInfo?.lang || []).map(({ key, name }: { key: string; name: string }) => ({
            label: name,
            value: key
        }));
    }, [modelInfo?.lang]);

    return {
        langPermission,
        langOptions,
        inputCheckPermission,
        messageRedirectPermission,
        textInputPermission,
        imageInputPermission,
        videoInputPermission,
        templateInputPermission,
        webSearchPermission,
        externalLinkPermission,
        editQuestionPermission,
        changeAnswerPermission,
        futureSupported
    };
};
