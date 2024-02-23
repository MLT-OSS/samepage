import { useConversationContext } from '@xm/context';

import { useChat } from './use-chat';
import { useChatPool } from './use-chat-pool';
import { useChatPoolStream } from './use-chat-pool-stream';
import { IChatModelSSERequest, IMessage, IPoolRequest } from '@/types';
import { TLanguage } from './use-lang';
type ISSERequest = IChatModelSSERequest | IPoolRequest;
interface UseChatParams {
    finishCb?: (message: IMessage, req: ISSERequest) => any;
    onMessageCb?: (message: IMessage, req: ISSERequest) => any;
    lang: TLanguage;
}
export const useConvChat = (params: UseChatParams) => {
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const { isStream, type } = modelInfo || {};
    const streamData = useChat(params);
    const streamlessData = useChatPool(params);
    const poolStreamData = useChatPoolStream(params);
    if (type && ['assistant_chat'].includes(type)) {
        return poolStreamData;
    }
    return isStream ? streamData : streamlessData;
};
