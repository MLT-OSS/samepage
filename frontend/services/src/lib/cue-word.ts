import { request } from '@/utils';
import { PostPromptsRequest, PostPromptsTypeSearchRequest } from '@/ytt-type/prompt';

// 提示词数量统计
export async function getPromptsCount() {
    return request('/prompts/count', {
        method: 'get'
    });
}
// 查询提示词列表
export async function getPrompts(data: PostPromptsTypeSearchRequest) {
    const { type, ...rest } = data;
    return request(`/prompts/${type}/search`, {
        method: 'post',
        data: rest
    });
}
// 新增修改提示词
export async function postPrompts(data: PostPromptsRequest) {
    return request('/prompts', {
        method: 'post',
        data
    });
}
// 删除提示词
export async function deletePrompts(id: any) {
    return request(`/prompts/${id}`, {
        method: 'delete'
    });
}
