export enum LoginPanelType {
    LOGIN = 1,
    REGISTER = 2,
    BIND_WX = 3,
    BIND_MOBILE = 4,
    UPDATE_PWD = 5
}

export const loginType = {
    password: 'LOGIN_FROM_PASSWORD',
    sms: 'LOGIN_FROM_SMS',
    wx: 'LOGIN_FROM_WECHAT'
};

export enum WxBindType {
    UNBIND = 1, // 未绑定
    BIND = 2, // 绑定
    REMOVEBIND = 3 // 解除绑定
}

export const wxLoginQrType = {
    official: 'WECHAT_OFFICIAL_ACCOUNT',
    minipro: 'WECHAT_MINIPROGRAM'
};

export const qrCodeLoginStatus = {
    APPROVE: 'APPROVE', // 扫码登录同意授权
    EXPIRED: 'EXPIRED', // 二维码过期
    PENDING: 'PENDING', // 扫码成功
    WAITING: 'WAITING' // 扫码成功
};

export interface QrInfoItem {
    qrImgUrl: string;
    label: string;
}
