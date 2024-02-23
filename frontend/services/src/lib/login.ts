import { request } from '@/utils';

import {
    GetCheckAccountRequest,
    PostCodeSmsAccountRequest,
    PostLoginRequest,
    PostLogoutResponse,
    PostResetPasswordRequest,
    PostSignupRequest
} from '@/ytt-type/login';
// 登录
export async function login(data: PostLoginRequest) {
    return request('/login', {
        method: 'post',
        data
    });
}

// 检查账号是否注册
export async function checkAccount(params: GetCheckAccountRequest) {
    return request('/check/account', {
        method: 'get',
        params,
        _fe_show_message_error: false
    });
}

// 发送验证码
export async function CodeSmsAccount(data: PostCodeSmsAccountRequest) {
    return request('/code/sms/account', {
        method: 'post',
        data
    });
}

// 注册
export async function Signup(data: PostSignupRequest) {
    return request('/signup', {
        method: 'post',
        data
    });
}

// 登出/退出登录
export async function Logout(data: PostLogoutResponse) {
    return request('/logout', {
        method: 'post',
        data
    });
}
// 重置密码
export async function ResetPassword(data: PostResetPasswordRequest) {
    return request('/reset-password', {
        method: 'post',
        data
    });
}
