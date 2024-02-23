import { request } from '@/utils';
import {
    DeleteBotConvMsgKeyRequest,
    GetBotConvUploadConfigRequest,
    PostBotConvUploadExistsRequest
} from '@/ytt-type/conversation';
import { PostBotTemplateKeyParamsRequest } from '@/ytt-type/robot';

export async function addParams(data: PostBotTemplateKeyParamsRequest) {
    const { key, ...rest } = data;
    return request(`/bot/template/${key}/params`, {
        method: 'post',
        data: rest,
        _fe_show_message_error: false
    });
}
// 删除模版会话的消息
export async function delTemplateConv(data: DeleteBotConvMsgKeyRequest) {
    const { key, ...params } = data;
    return request(`/bot/conv/msg/${key}`, {
        method: 'delete',
        params
    });
}
// 获取上传配置
export async function getUploadConfig(params: GetBotConvUploadConfigRequest) {
    return request('/bot/conv/upload/config', {
        method: 'GET',
        params
    });
}
// 判断上传的文件是否存在
export async function getUploadExists(data: PostBotConvUploadExistsRequest, callback?: () => string) {
    const abortId = callback ? callback() : undefined;
    return request(`/bot/conv/upload/exists`, {
        abortId,
        method: 'post',
        data,
        _fe_show_message_error: false
    });
}
