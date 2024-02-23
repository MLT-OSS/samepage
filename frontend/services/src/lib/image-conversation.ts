import { request } from '@/utils';
import type { IMAGE_CONVERSATION } from '@/types';
import { PostImagineUploadRequest } from '@/ytt-type/imagine';

// 获取结果
export async function result(params: IMAGE_CONVERSATION.IImageReq) {
    return request(`/imagine/${params.messageId}/result`, {
        method: 'GET'
    });
}

// 获取历史作图消息
export async function history(params: IMAGE_CONVERSATION.IImageHistoryReq) {
    const { _fe_show_message_error = true, ...others } = params;
    return request('/imagine/message/history', {
        method: 'GET',
        params: others,
        _fe_show_message_error: _fe_show_message_error
    });
}

// 删除
export async function del(data: IMAGE_CONVERSATION.IImageReq) {
    return request(`/imagine/message/${data.messageId}`, {
        method: 'DELETE'
    });
}

// 获取默认设置
export async function defaultSetting() {
    return request('/imagine/config', {
        method: 'GET'
    });
}

// 获取设置
export async function setting() {
    return request('/imagine/setting', {
        method: 'GET'
    });
}

// 修改设置
export async function updateSetting(data: IMAGE_CONVERSATION.IUpdateSettingReq) {
    return request('/imagine/setting', {
        method: 'POST',
        data
    });
}

// 创建图片任务
export async function add(data: IMAGE_CONVERSATION.IImageAddReq) {
    return request('/imagine/message', {
        method: 'POST',
        data
    });
}

// 获取上传配置
export async function getUploadConfig(data: PostImagineUploadRequest) {
    return request('/imagine/upload', {
        method: 'POST',
        data
    });
}

// 变换图像
export async function change(data: IMAGE_CONVERSATION.IImageChangeReq) {
    return request('/imagine/message/change', {
        method: 'POST',
        data
    });
}
