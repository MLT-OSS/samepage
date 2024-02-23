import { request } from '@/utils';
import { DeleteUserTenantTenantIdRequest, GetServiceChangelogTypeRequest, PostCorpUserRequest } from '@/ytt-type/user';
import {
    GetLink2cCheckWhiteRequest,
    GetTenantCheckRequest,
    GetTenantDepartmentCodeRequest,
    PostTenantRegisterRequest,
    PostTenantUserChangeRequest,
    PostTenantUserRegisterRequest
} from '@/ytt-type/corp';
import { GetSmsSendTypeRequest } from '@/ytt-type/common';

export async function getUserInfo(showMessageError = true) {
    return request('/user/profile', {
        method: 'get',
        _fe_show_message_error: showMessageError
    });
}

export async function getSettings() {
    return request('/user/profile/settings', {
        method: 'get',
        _fe_show_message_error: false
    });
}

// 完善用户的企业信息
export async function fillCorpInfo(data: PostCorpUserRequest) {
    return request('/corp/user', {
        method: 'post',
        data
    });
}

// 获取应用版本信息
export async function getVersionList(params: GetServiceChangelogTypeRequest) {
    return request(`/service/changelog/${params.type}`, {
        method: 'get'
    });
}

// 退出租户
export async function tentantExit(params: DeleteUserTenantTenantIdRequest) {
    return request(`/user/tenant/${params.tenantId}`, {
        method: 'delete'
    });
}

// 根据内测码获取企业部门列表
export async function getDepartment(params: GetTenantDepartmentCodeRequest) {
    return request('/tenant/department/code', {
        method: 'get',
        params,
        _fe_show_message_error: false
    });
}

// 添加临时租户
export async function registerCorp(data: PostTenantRegisterRequest) {
    return request('/tenant/register', {
        method: 'post',
        data
    });
}

// 企业名是否重复
export async function corpNameCheck(params: GetTenantCheckRequest) {
    return request('/tenant/check', {
        method: 'get',
        params,
        _fe_show_message_error: false
    });
}

// 发送验证码
export async function sendVerifyCode(_params: GetSmsSendTypeRequest) {
    const { type, ...params } = _params;
    return request(`/sms/send/${type}`, {
        method: 'get',
        params,
        _fe_show_message_error: false
    });
}

// 加入租户
export async function joinCorp(data: PostTenantUserRegisterRequest) {
    return request('/tenant/user/register', {
        method: 'post',
        data,
        _fe_show_message_error: false
    });
}

// 退出原租户，加入新租户
export async function changeCorp(data: PostTenantUserChangeRequest) {
    return request('/tenant/user/change', {
        method: 'post',
        data,
        _fe_show_message_error: false
    });
}

// 链接注册获取信息
export async function getInviteKeyInfo(params: GetLink2cCheckWhiteRequest) {
    return request('/link2c/check/white', {
        method: 'get',
        params,
        _fe_show_message_error: false
    });
}

// 获取用户的加入租户的状态
export async function getApproveStatus() {
    return request('/user/audit/tenant', {
        method: 'get',
        _fe_show_message_error: false
    });
}
