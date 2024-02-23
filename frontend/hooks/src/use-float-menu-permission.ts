import { useConversationContext } from '@xm/context';

export const useFloatMenuPermission = () => {
    const {
        conversationState: { robotDict }
    } = useConversationContext();

    const { immersive_translation: immersiveTranslationPermission = false } = (robotDict?.floatMenuFeature || {}) as {
        [k: string]: boolean;
    };

    return {
        immersiveTranslationPermission
    };
};
