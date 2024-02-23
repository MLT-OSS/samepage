import { request } from '@/utils';
import { GetBotFixedKeyRequest } from '@/ytt-type/robot';

// 获取钉在侧边的机器人列表
export async function getSidebarList() {
    return request('/bot/sidebar', {
        method: 'get'
    });
}

// 全部机器人字典，包含分类及列表
export async function getRobotDict() {
    return request('/dict/bot', {
        method: 'get'
    });
}

// 机器人是否固定在侧边栏
export async function handleFixed(params: GetBotFixedKeyRequest) {
    const { key, ...rest } = params;
    return request(`/bot/fixed/${params.key}`, {
        method: 'get',
        params: rest
    });
}
// 对照翻译字典
export async function getTranslatorDict() {
    return request('/dict/translation', {
        method: 'get'
    });
}
