import { request } from '@/utils';

// 获取列表
export async function getList(params: any) {
    return request('/bots', {
        method: 'GET',
        params
    });
}

// 获取支持该类型的模型列表
export async function getDictModel() {
    return request('/dict/model', {
        method: 'GET'
    });
}

// 获取机器人的基本信息
export async function getBot(params: any, type: string) {
    return request(`/bot/${type}`, {
        method: 'GET',
        params
    });
}

// 添加Bot
export async function addBot(data: any, type: string) {
    return request(`/bot/${type}`, {
        method: 'POST',
        data
    });
}

// 添加Bot
export async function upBot(data: any, type: string) {
    return request(`/bot/${type}`, {
        method: 'PUT',
        data
    });
}

// 删除机器人
export async function delBot(id: string) {
    return request(`/bot/${id}`, {
        method: 'DELETE'
    });
}
