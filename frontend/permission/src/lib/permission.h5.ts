/**
 * h5-会话
 *
 * 功能权限
 */
import { PERMISSION, ModelType } from '@/types';

const CHAT_PERMISSION: PERMISSION.IChatConv = {
    welcome: true,
    guide: true,
    prompt: { add: false },
    readDoc: false
};

const ASSISTANT_CHAT_PERMISSION: PERMISSION.IChatConv = {
    welcome: true,
    guide: true
};

const DRAW_PERMISSION: PERMISSION.IDrawConv = {};

const STATELESS_CHAT_PERMISSION: PERMISSION.IStatelessChatConv = {};

const H5_CONV_PERMISSION: Record<ModelType, any> = {
    chat: CHAT_PERMISSION,
    assistant_chat: ASSISTANT_CHAT_PERMISSION,
    draw: DRAW_PERMISSION,
    stateless_chat: STATELESS_CHAT_PERMISSION
};

export default H5_CONV_PERMISSION;
