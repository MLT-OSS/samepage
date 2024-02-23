/**
 * 文档阅读 会话
 *
 * 功能权限
 */
import { PERMISSION, ModelType } from '@/types';

const CHAT_PERMISSION: PERMISSION.IChatConv = {
    modelCard: false,
    readDoc: {
        entry: false,
        docLink: { show: false },
        summaryGuide: false
    }
};

const DOC_CHAT_CONV_PERMISSION: Partial<Record<ModelType, any>> = {
    chat: CHAT_PERMISSION
};

export default DOC_CHAT_CONV_PERMISSION;
