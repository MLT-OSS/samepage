/**
 * 聊天模型 permission
 */
import { useConversationContext } from '@xm/context';
import { PERMISSION } from '@/types';
import { getPromptObjectPermission, getReadDocObjectPermission } from '@xm/permission';

export const useChatPermission = () => {
    const { conversationState } = useConversationContext();
    const { modelInfo } = conversationState;
    const {
        welcome: welcomePermission = false,
        guide: guidePermission = false,
        readArticle: readArticlePermission = false,
        readDoc: _readDocPermission,
        selection: selectionPermission = false,
        prompt: _promptPermission,
        modelCard: modelCardPermission = true
    } = (modelInfo?.feFeature || {}) as PERMISSION.IChatConv;
    const readDocPermission = getReadDocObjectPermission(_readDocPermission);
    const promptPermission = getPromptObjectPermission(_promptPermission);

    return {
        welcomePermission,
        guidePermission,
        readArticlePermission,
        readDocPermission,
        selectionPermission,
        promptPermission,
        modelCardPermission
    };
};
