import { request } from '@/utils';
import {
    DeleteBotConvKeyConvIdRequest,
    GetBotConvKeyConvIdMsgMsgIdRequest,
    GetBotConvKeyListRequest,
    GetBotConvKeyRequest,
    PostBotConvKeyFeedbackRequest,
    PostBotConvKeyInfoRequest,
    PostBotConvKeyMsgRequest,
    PostBotConvKeyStopRequest,
    PostDocUploadConfigRequest
} from '@/ytt-type/conversation';
import { GetBotKeyWelcomeRequest } from '@/ytt-type/robot';
import { GetTaskCancelRequest, GetTaskInfoRequest, PostTaskCreateRequest } from '@/ytt-type/task';

export async function getWelcome(params: GetBotKeyWelcomeRequest) {
    const { key, ...rest } = params;
    return request(`/bot/${key}/welcome`, {
        method: 'get',
        params: rest
    });
}

// 获取上传配置
export async function getUploadConfig(data: PostDocUploadConfigRequest) {
    return request('/doc/upload-config', {
        method: 'post',
        data,
        _fe_show_message_error: false
    });
}

// 提交任务
// for: 阅读全文、PDF 阅读
export async function createTask(data: PostTaskCreateRequest, callback?: () => string) {
    const abortId = callback ? callback() : undefined;
    return request('/task/create', {
        abortId,
        method: 'post',
        data,
        _fe_show_message_error: false
    });
}

// 获取任务信息
// for: 阅读全文、PDF 阅读
export async function getTaskInfo(params: GetTaskInfoRequest, callback?: () => string) {
    const abortId = callback ? callback() : undefined;
    return request('/task/info', {
        abortId,
        method: 'get',
        params,
        _fe_show_message_error: false
    });
}

// 取消任务
// 插件版用不到，没有取消入口
export async function cancelTask(params: GetTaskCancelRequest) {
    return request('/task/cancel', {
        method: 'get',
        params,
        skipErrorHandler: true
    });
}

// 获取历史记录列表
export async function getHistory(params: GetBotConvKeyListRequest) {
    const { key, ...rest } = params;
    return request(`/bot/conv/${key}/list`, {
        method: 'get',
        params: rest
    });
}

// 会话反馈信息
export async function feedback(data: PostBotConvKeyFeedbackRequest) {
    const { key, ...rest } = data;
    return request(`/bot/conv/${key}/feedback`, {
        method: 'post',
        data: rest
    });
}

// 获取当前会话 message list
export async function getConversationInfo(params: GetBotConvKeyRequest) {
    const { key, ...rest } = params;
    return request(`/bot/conv/${key}`, {
        method: 'get',
        params: rest
    });
}

// 删除指定会话
export async function delConv(data: DeleteBotConvKeyConvIdRequest) {
    const { key, convId } = data;
    return request(`/bot/conv/${key}/${convId}`, {
        method: 'delete'
    });
}

// 获取  message info
export async function getMessageInfo(params: GetBotConvKeyConvIdMsgMsgIdRequest, callback?: () => string) {
    const abortId = callback ? callback() : undefined;
    const { key, convId, msgId } = params;
    return request(`/bot/conv/${key}/${convId}/msg/${msgId}`, {
        abortId,
        method: 'get'
    });
}

// 修改会话信息
export async function updateConvInfo(data: PostBotConvKeyInfoRequest) {
    const { key, ...rest } = data;
    return request(`/bot/conv/${key}/info`, {
        method: 'post',
        data: rest
    });
}

// 非流失发送消息
export async function sendMessage(data: PostBotConvKeyMsgRequest) {
    const { key, ...rest } = data;
    return request(`/bot/conv/${key}/msg`, {
        method: 'post',
        data: rest
    });
}

// 停止响应
export async function stopMessage(data: PostBotConvKeyStopRequest) {
    const { key, ...rest } = data;
    return request(`/bot/conv/${key}/stop`, {
        method: 'post',
        data: rest,
        _fe_show_message_error: false
    });
}
