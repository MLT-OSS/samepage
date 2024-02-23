/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

// @ts-ignore
// prettier-ignore
import { QueryStringArrayFormat, Method, RequestBodyType, ResponseBodyType, FileData, prepare } from 'yapi-to-typescript'
// @ts-ignore
// prettier-ignore
import type { RequestConfig, RequestFunctionRestArgs } from 'yapi-to-typescript'
// @ts-ignore
import request from './request.d';

type UserRequestRestArgs = RequestFunctionRestArgs<typeof request>;

// Request: 目前 React Hooks 功能有用到
export type Request<
    TRequestData,
    TRequestConfig extends RequestConfig,
    TRequestResult
> = (TRequestConfig['requestDataOptional'] extends true
    ? (requestData?: TRequestData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult
    : (requestData: TRequestData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult) & {
    requestConfig: TRequestConfig;
};

const mockUrl_1_0_0_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_1_0_0_0 = '' as any;
const prodUrl_1_0_0_0 = '' as any;
const dataKey_1_0_0_0 = 'data' as any;

/**
 * 接口 [发送验证码↗](/interface/api/55754) 的 **请求类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /code/sms/account`
 * @更新时间 `2023-07-06 16:21:53`
 */
export interface PostCodeSmsAccountRequest {
    /**
     * 手机号码/账号
     */
    account: string;
    /**
     * 短信类型：1-登录注册（默认），2-找回密码
     */
    smsType: number;
}

/**
 * 接口 [发送验证码↗](/interface/api/55754) 的 **返回类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /code/sms/account`
 * @更新时间 `2023-07-06 16:21:53`
 */
export interface PostCodeSmsAccountResponse {}

/**
 * 接口 [发送验证码↗](/interface/api/55754) 的 **请求配置的类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /code/sms/account`
 * @更新时间 `2023-07-06 16:21:53`
 */
type PostCodeSmsAccountRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/code/sms/account', 'data', string, string, false>
>;

/**
 * 接口 [发送验证码↗](/interface/api/55754) 的 **请求配置**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /code/sms/account`
 * @更新时间 `2023-07-06 16:21:53`
 */
const postCodeSmsAccountRequestConfig: PostCodeSmsAccountRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_1_0_0_0,
    devUrl: devUrl_1_0_0_0,
    prodUrl: prodUrl_1_0_0_0,
    path: '/code/sms/account',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_1_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postCodeSmsAccount',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [发送验证码↗](/interface/api/55754) 的 **请求函数**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /code/sms/account`
 * @更新时间 `2023-07-06 16:21:53`
 */
export const postCodeSmsAccount = /*#__PURE__*/ (
    requestData: PostCodeSmsAccountRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostCodeSmsAccountResponse>(prepare(postCodeSmsAccountRequestConfig, requestData), ...args);
};

postCodeSmsAccount.requestConfig = postCodeSmsAccountRequestConfig;

/**
 * 接口 [个人注册\/企业预注册↗](/interface/api/55761) 的 **请求类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`
 * @请求头 `POST /signup`
 * @更新时间 `2023-08-10 14:23:36`
 */
export interface PostSignupRequest {
    /**
     * 手机号码
     */
    account?: string;
    /**
     * 手机短信验证码
     */
    code?: string;
    /**
     * 密码
     */
    password?: string;
    /**
     * 是否注册,默认值是true
     */
    signup?: boolean;
    /**
     * 用户名
     */
    username?: string;
}

/**
 * 接口 [个人注册\/企业预注册↗](/interface/api/55761) 的 **返回类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`
 * @请求头 `POST /signup`
 * @更新时间 `2023-08-10 14:23:36`
 */
export type PostSignupResponse = string;

/**
 * 接口 [个人注册\/企业预注册↗](/interface/api/55761) 的 **请求配置的类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`
 * @请求头 `POST /signup`
 * @更新时间 `2023-08-10 14:23:36`
 */
type PostSignupRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/signup', 'data', string, string, false>
>;

/**
 * 接口 [个人注册\/企业预注册↗](/interface/api/55761) 的 **请求配置**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`
 * @请求头 `POST /signup`
 * @更新时间 `2023-08-10 14:23:36`
 */
const postSignupRequestConfig: PostSignupRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_1_0_0_0,
    devUrl: devUrl_1_0_0_0,
    prodUrl: prodUrl_1_0_0_0,
    path: '/signup',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_1_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postSignup',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [个人注册\/企业预注册↗](/interface/api/55761) 的 **请求函数**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`
 * @请求头 `POST /signup`
 * @更新时间 `2023-08-10 14:23:36`
 */
export const postSignup = /*#__PURE__*/ (requestData: PostSignupRequest, ...args: UserRequestRestArgs) => {
    return request<PostSignupResponse>(prepare(postSignupRequestConfig, requestData), ...args);
};

postSignup.requestConfig = postSignupRequestConfig;

/**
 * 接口 [登录接口↗](/interface/api/55768) 的 **请求类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /login`
 * @更新时间 `2023-06-30 19:38:45`
 */
export interface PostLoginRequest {
    /**
     * 手机号码/账号
     */
    account: string;
    /**
     * 密码
     */
    password: string;
}

/**
 * 接口 [登录接口↗](/interface/api/55768) 的 **返回类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /login`
 * @更新时间 `2023-06-30 19:38:45`
 */
export interface PostLoginResponse {
    /**
     * refreshToken，默认有效期：2天
     */
    refreshToken?: string;
    /**
     * token，默认有效期：2个小时
     */
    token?: string;
}

/**
 * 接口 [登录接口↗](/interface/api/55768) 的 **请求配置的类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /login`
 * @更新时间 `2023-06-30 19:38:45`
 */
type PostLoginRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/login', 'data', string, string, false>
>;

/**
 * 接口 [登录接口↗](/interface/api/55768) 的 **请求配置**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /login`
 * @更新时间 `2023-06-30 19:38:45`
 */
const postLoginRequestConfig: PostLoginRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_1_0_0_0,
    devUrl: devUrl_1_0_0_0,
    prodUrl: prodUrl_1_0_0_0,
    path: '/login',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_1_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postLogin',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [登录接口↗](/interface/api/55768) 的 **请求函数**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /login`
 * @更新时间 `2023-06-30 19:38:45`
 */
export const postLogin = /*#__PURE__*/ (requestData: PostLoginRequest, ...args: UserRequestRestArgs) => {
    return request<PostLoginResponse>(prepare(postLoginRequestConfig, requestData), ...args);
};

postLogin.requestConfig = postLoginRequestConfig;

/**
 * 接口 [检查账号是否注册↗](/interface/api/55775) 的 **请求类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `GET /check/account`
 * @更新时间 `2023-08-09 14:33:31`
 */
export interface GetCheckAccountRequest {
    /**
     * 手机号
     */
    account: string;
}

/**
 * 接口 [检查账号是否注册↗](/interface/api/55775) 的 **返回类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `GET /check/account`
 * @更新时间 `2023-08-09 14:33:31`
 */
export type GetCheckAccountResponse = string;

/**
 * 接口 [检查账号是否注册↗](/interface/api/55775) 的 **请求配置的类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `GET /check/account`
 * @更新时间 `2023-08-09 14:33:31`
 */
type GetCheckAccountRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/check/account', 'data', string, 'account', false>
>;

/**
 * 接口 [检查账号是否注册↗](/interface/api/55775) 的 **请求配置**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `GET /check/account`
 * @更新时间 `2023-08-09 14:33:31`
 */
const getCheckAccountRequestConfig: GetCheckAccountRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_1_0_0_0,
    devUrl: devUrl_1_0_0_0,
    prodUrl: prodUrl_1_0_0_0,
    path: '/check/account',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_1_0_0_0,
    paramNames: [],
    queryNames: ['account'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getCheckAccount',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [检查账号是否注册↗](/interface/api/55775) 的 **请求函数**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `GET /check/account`
 * @更新时间 `2023-08-09 14:33:31`
 */
export const getCheckAccount = /*#__PURE__*/ (requestData: GetCheckAccountRequest, ...args: UserRequestRestArgs) => {
    return request<GetCheckAccountResponse>(prepare(getCheckAccountRequestConfig, requestData), ...args);
};

getCheckAccount.requestConfig = getCheckAccountRequestConfig;

/**
 * 接口 [登出\/退出登录↗](/interface/api/55782) 的 **请求类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /logout`
 * @更新时间 `2023-12-07 15:35:32`
 */
export interface PostLogoutRequest {
    /**
     * refreshToken
     */
    refreshToken?: string;
}

/**
 * 接口 [登出\/退出登录↗](/interface/api/55782) 的 **返回类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /logout`
 * @更新时间 `2023-12-07 15:35:32`
 */
export interface PostLogoutResponse {}

/**
 * 接口 [登出\/退出登录↗](/interface/api/55782) 的 **请求配置的类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /logout`
 * @更新时间 `2023-12-07 15:35:32`
 */
type PostLogoutRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/logout', 'data', string, string, false>
>;

/**
 * 接口 [登出\/退出登录↗](/interface/api/55782) 的 **请求配置**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /logout`
 * @更新时间 `2023-12-07 15:35:32`
 */
const postLogoutRequestConfig: PostLogoutRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_1_0_0_0,
    devUrl: devUrl_1_0_0_0,
    prodUrl: prodUrl_1_0_0_0,
    path: '/logout',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_1_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postLogout',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [登出\/退出登录↗](/interface/api/55782) 的 **请求函数**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /logout`
 * @更新时间 `2023-12-07 15:35:32`
 */
export const postLogout = /*#__PURE__*/ (requestData: PostLogoutRequest, ...args: UserRequestRestArgs) => {
    return request<PostLogoutResponse>(prepare(postLogoutRequestConfig, requestData), ...args);
};

postLogout.requestConfig = postLogoutRequestConfig;

/**
 * 接口 [忘记密码↗](/interface/api/55789) 的 **请求类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /reset-password`
 * @更新时间 `2023-07-04 15:36:51`
 */
export interface PostResetPasswordRequest {
    /**
     * 验证码
     */
    code: string;
    /**
     * 账号
     */
    account: string;
    /**
     * 密码
     */
    password: string;
}

/**
 * 接口 [忘记密码↗](/interface/api/55789) 的 **返回类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /reset-password`
 * @更新时间 `2023-07-04 15:36:51`
 */
export interface PostResetPasswordResponse {}

/**
 * 接口 [忘记密码↗](/interface/api/55789) 的 **请求配置的类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /reset-password`
 * @更新时间 `2023-07-04 15:36:51`
 */
type PostResetPasswordRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/reset-password', 'data', string, string, false>
>;

/**
 * 接口 [忘记密码↗](/interface/api/55789) 的 **请求配置**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /reset-password`
 * @更新时间 `2023-07-04 15:36:51`
 */
const postResetPasswordRequestConfig: PostResetPasswordRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_1_0_0_0,
    devUrl: devUrl_1_0_0_0,
    prodUrl: prodUrl_1_0_0_0,
    path: '/reset-password',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_1_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postResetPassword',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [忘记密码↗](/interface/api/55789) 的 **请求函数**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /reset-password`
 * @更新时间 `2023-07-04 15:36:51`
 */
export const postResetPassword = /*#__PURE__*/ (
    requestData: PostResetPasswordRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostResetPasswordResponse>(prepare(postResetPasswordRequestConfig, requestData), ...args);
};

postResetPassword.requestConfig = postResetPasswordRequestConfig;

/**
 * 接口 [使用刷新令牌换取新令牌↗](/interface/api/55796) 的 **请求类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /user/token`
 * @更新时间 `2023-06-30 19:46:03`
 */
export interface PostUserTokenRequest {
    /**
     * 授权类型：refresh_token
     */
    grantType: string;
    /**
     * refreshToken
     */
    refreshToken: string;
}

/**
 * 接口 [使用刷新令牌换取新令牌↗](/interface/api/55796) 的 **返回类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /user/token`
 * @更新时间 `2023-06-30 19:46:03`
 */
export interface PostUserTokenResponse {
    /**
     * refreshToken，默认有效期：2天
     */
    refreshToken?: string;
    /**
     * token，默认有效期：2个小时
     */
    token?: string;
}

/**
 * 接口 [使用刷新令牌换取新令牌↗](/interface/api/55796) 的 **请求配置的类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /user/token`
 * @更新时间 `2023-06-30 19:46:03`
 */
type PostUserTokenRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/user/token', 'data', string, string, false>
>;

/**
 * 接口 [使用刷新令牌换取新令牌↗](/interface/api/55796) 的 **请求配置**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /user/token`
 * @更新时间 `2023-06-30 19:46:03`
 */
const postUserTokenRequestConfig: PostUserTokenRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_1_0_0_0,
    devUrl: devUrl_1_0_0_0,
    prodUrl: prodUrl_1_0_0_0,
    path: '/user/token',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_1_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postUserToken',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [使用刷新令牌换取新令牌↗](/interface/api/55796) 的 **请求函数**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `登录及注册相关接口`
 * @请求头 `POST /user/token`
 * @更新时间 `2023-06-30 19:46:03`
 */
export const postUserToken = /*#__PURE__*/ (requestData: PostUserTokenRequest, ...args: UserRequestRestArgs) => {
    return request<PostUserTokenResponse>(prepare(postUserTokenRequestConfig, requestData), ...args);
};

postUserToken.requestConfig = postUserTokenRequestConfig;

/**
 * 接口 [企业注册接口↗](/interface/api/58418) 的 **请求类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`, `弃用`
 * @请求头 `POST /corp/signup`
 * @更新时间 `2023-11-29 13:54:55`
 */
export interface PostCorpSignupRequest {
    /**
     * 企业id
     */
    corpId: string;
    /**
     * 部门id
     */
    departmentId: string;
    /**
     * 内测码
     */
    internalCode?: string;
    /**
     * 用户id
     */
    userId?: string;
}

/**
 * 接口 [企业注册接口↗](/interface/api/58418) 的 **返回类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`, `弃用`
 * @请求头 `POST /corp/signup`
 * @更新时间 `2023-11-29 13:54:55`
 */
export type PostCorpSignupResponse = boolean;

/**
 * 接口 [企业注册接口↗](/interface/api/58418) 的 **请求配置的类型**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`, `弃用`
 * @请求头 `POST /corp/signup`
 * @更新时间 `2023-11-29 13:54:55`
 */
type PostCorpSignupRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/corp/signup', 'data', string, string, false>
>;

/**
 * 接口 [企业注册接口↗](/interface/api/58418) 的 **请求配置**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`, `弃用`
 * @请求头 `POST /corp/signup`
 * @更新时间 `2023-11-29 13:54:55`
 */
const postCorpSignupRequestConfig: PostCorpSignupRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_1_0_0_0,
    devUrl: devUrl_1_0_0_0,
    prodUrl: prodUrl_1_0_0_0,
    path: '/corp/signup',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_1_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postCorpSignup',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [企业注册接口↗](/interface/api/58418) 的 **请求函数**
 *
 * @分类 [登录及注册相关接口↗](/interface/api/cat_10371)
 * @标签 `v1.1.0`, `登录及注册相关接口`, `弃用`
 * @请求头 `POST /corp/signup`
 * @更新时间 `2023-11-29 13:54:55`
 */
export const postCorpSignup = /*#__PURE__*/ (requestData: PostCorpSignupRequest, ...args: UserRequestRestArgs) => {
    return request<PostCorpSignupResponse>(prepare(postCorpSignupRequestConfig, requestData), ...args);
};

postCorpSignup.requestConfig = postCorpSignupRequestConfig;

/* prettier-ignore-end */
