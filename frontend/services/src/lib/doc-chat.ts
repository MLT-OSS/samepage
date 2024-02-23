import { DeleteDocDocIdRequest, GetDocInfoRequest } from '@/ytt-type/conversation';
import { request } from '@/utils';

// 文件列表
export async function getFileList() {
    return request('/doc/list', {
        method: 'get'
    });
}

// 删除文件
export async function deleteFile(data: DeleteDocDocIdRequest) {
    return request(`/doc/${data.docId}`, {
        method: 'delete'
    });
}

// 获取文件信息 /doc/info
export async function getFileInfo(params: GetDocInfoRequest) {
    return request('/doc/info', {
        method: 'get',
        params
    });
}
