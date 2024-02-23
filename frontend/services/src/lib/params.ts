import { request } from '@/utils';
import {
    DeleteBotTemplateKeyParamsIdRequest,
    GetBotTemplateKeyParamsRequest,
    PostBotTemplateKeyCheckRequest
} from '@/ytt-type/robot';

// 机器人模版历史参数
export async function getParamsHistory(params: GetBotTemplateKeyParamsRequest) {
    return request(`/bot/template/${params.key}/params`, {
        method: 'get',
        params
    });
}

// 删除模版参数
export async function delParams(params: DeleteBotTemplateKeyParamsIdRequest) {
    return request(`/bot/template/${params.key}/params/${params.id}`, {
        method: 'delete'
    });
}

// 增加参数，参数提交接口
export async function submitParams(data: any) {
    const { key, ...rest } = data;
    return request(`/bot/template/${key}/conv`, {
        method: 'post',
        data: rest
    });
}
