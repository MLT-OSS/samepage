import { request } from '@/utils';
import { PostBotKeyCheckRequest } from '@/ytt-type/conversation';

// 校验超额
export async function checkToken(data: PostBotKeyCheckRequest) {
    const { key, ...rest } = data;
    return request(`/bot/${key}/check`, {
        method: 'post',
        data: rest,
        _fe_show_message_error: false
    });
}
