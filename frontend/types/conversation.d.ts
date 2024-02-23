import { CHAT_BUBBLE } from './chat-bubble';

export declare namespace CONV {
    interface IUploadDocInfo {
        docId?: string;
        docName?: string;
        taskId?: string; // for: doc-chat 上传成功后打开会话场景
    }
    interface IConversationOptions {
        readArticle?: boolean;
        readDoc?: IUploadDocInfo;
        conversationId?: string;
        conversationType?: HISTORY_LOG.Item['conversationType'];
        onReferClick?: (data: CHAT_BUBBLE.IRefer['reference']['0']) => void;
    }

    interface IStatelessConvOptions {
        conversationId?: string;
    }
}
