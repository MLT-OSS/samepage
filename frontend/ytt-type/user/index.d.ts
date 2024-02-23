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

const mockUrl_2_0_0_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_2_0_0_0 = '' as any;
const prodUrl_2_0_0_0 = '' as any;
const dataKey_2_0_0_0 = 'data' as any;

/**
 * 接口 [获取用户信息↗](/interface/api/55803) 的 **请求类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.1.0`, `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile`
 * @更新时间 `2023-12-05 17:46:27`
 */
export interface GetUserProfileRequest {}

/**
 * 接口 [获取用户信息↗](/interface/api/55803) 的 **返回类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.1.0`, `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile`
 * @更新时间 `2023-12-05 17:46:27`
 */
export interface GetUserProfileResponse {
    /**
     * 过期时间
     */
    expireTime?: string;
    /**
     * 头像
     */
    headUrl?: string;
    /**
     * 邮件
     */
    mail?: string;
    /**
     * 手机号码
     */
    mobile?: string;
    /**
     * 姓名
     */
    name?: string;
    /**
     * 用户id
     */
    userId?: number;
    /**
     * 是否过期
     */
    expire: boolean;
    /**
     * 租户id，
     */
    tenantId?: number;
    /**
     * 租户名字
     */
    tenantName?: string;
    /**
     * 待审批数量-v1.3.5
     */
    pendingAuditNum: number;
    /**
     * 菜单权限-v1.3.5
     */
    permissions: (
        | 'corp_manage'
        | 'corp_prompt_mange'
        | 'approval_manage:member'
        | 'approval_manage:corp_prompt'
        | 'approval_manage:approval_item'
        | 'common'
    )[];
    roleType: 'PERSONAL_USER' | 'ENTERPRISE_ADMIN' | 'ENTERPRISE_USER';
    /**
     * 审批状态，如果不处于审核状态为null
     */
    approvalStatus?: 'PENDING';
    /**
     * 用户的类型
     */
    type: 'PERSONAL' | 'ENTERPRISE';
    /**
     * 部门id
     */
    departId?: string;
    /**
     * 部门名称
     */
    departName?: string;
}

/**
 * 接口 [获取用户信息↗](/interface/api/55803) 的 **请求配置的类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.1.0`, `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile`
 * @更新时间 `2023-12-05 17:46:27`
 */
type GetUserProfileRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/user/profile', 'data', string, string, true>
>;

/**
 * 接口 [获取用户信息↗](/interface/api/55803) 的 **请求配置**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.1.0`, `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile`
 * @更新时间 `2023-12-05 17:46:27`
 */
const getUserProfileRequestConfig: GetUserProfileRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_0_0,
    devUrl: devUrl_2_0_0_0,
    prodUrl: prodUrl_2_0_0_0,
    path: '/user/profile',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getUserProfile',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取用户信息↗](/interface/api/55803) 的 **请求函数**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.1.0`, `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile`
 * @更新时间 `2023-12-05 17:46:27`
 */
export const getUserProfile = /*#__PURE__*/ (requestData?: GetUserProfileRequest, ...args: UserRequestRestArgs) => {
    return request<GetUserProfileResponse>(prepare(getUserProfileRequestConfig, requestData), ...args);
};

getUserProfile.requestConfig = getUserProfileRequestConfig;

/**
 * 接口 [获取用户设置项↗](/interface/api/57094) 的 **请求类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile/settings`
 * @更新时间 `2023-12-05 17:47:22`
 */
export interface GetUserProfileSettingsRequest {}

/**
 * 接口 [获取用户设置项↗](/interface/api/57094) 的 **返回类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile/settings`
 * @更新时间 `2023-12-05 17:47:22`
 */
export interface GetUserProfileSettingsResponse {
    /**
     * 是否扩展阅读全文的图标
     */
    expandReadAll?: boolean;
    /**
     * 机器人配置信息
     */
    botVersion: string;
    /**
     * 是否需要更新客户端
     */
    isUpdateClient: boolean;
    /**
     * 失效时间
     */
    expireTime: string;
    /**
     * 是否过期
     */
    expire: boolean;
    /**
     * 租户id
     */
    tenantId?: string;
    /**
     * 租户名字
     */
    tenantName?: string;
    /**
     * 用户的账号
     */
    mail: string;
    /**
     * 待审核数量- v1.3.5
     */
    pendingAuditNum: number;
    type: 'PERSONAL' | 'ENTERPRISE';
    /**
     * 用户的菜单权限-v1.3.5
     */
    permissions: (
        | 'corp_manage'
        | 'corp_prompt_mange'
        | 'approval_manage:member'
        | 'approval_manage:corp_prompt'
        | 'approval_manage:approval_item'
        | 'common'
    )[];
    /**
     * 审批状态，如果不处于审核状态为null
     */
    approvalStatus?: 'PENDING';
    /**
     * 用户类型
     */
    roleType: 'PERSONAL_USER' | 'ENTERPRISE_ADMIN' | 'ENTERPRISE_USER';
    /**
     * 部门id
     */
    departId?: string;
    /**
     * 部门名称
     */
    departName?: string;
}

/**
 * 接口 [获取用户设置项↗](/interface/api/57094) 的 **请求配置的类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile/settings`
 * @更新时间 `2023-12-05 17:47:22`
 */
type GetUserProfileSettingsRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/user/profile/settings', 'data', string, string, true>
>;

/**
 * 接口 [获取用户设置项↗](/interface/api/57094) 的 **请求配置**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile/settings`
 * @更新时间 `2023-12-05 17:47:22`
 */
const getUserProfileSettingsRequestConfig: GetUserProfileSettingsRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_0_0,
    devUrl: devUrl_2_0_0_0,
    prodUrl: prodUrl_2_0_0_0,
    path: '/user/profile/settings',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getUserProfileSettings',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取用户设置项↗](/interface/api/57094) 的 **请求函数**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `用户相关接口`, `v1.3.5`
 * @请求头 `GET /user/profile/settings`
 * @更新时间 `2023-12-05 17:47:22`
 */
export const getUserProfileSettings = /*#__PURE__*/ (
    requestData?: GetUserProfileSettingsRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetUserProfileSettingsResponse>(prepare(getUserProfileSettingsRequestConfig, requestData), ...args);
};

getUserProfileSettings.requestConfig = getUserProfileSettingsRequestConfig;

/**
 * 接口 [更新用户对照翻译设置↗](/interface/api/65863) 的 **请求类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `POST /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:12`
 */
export interface PostUserTranslateSettingRequest {
    url?: string;
    /**
     * 来源语言
     */
    sourceLanguage?: string;
    /**
     * 目标语言
     */
    targetLanguage?: string;
    /**
     * 自动翻译：0 关闭；1开启
     */
    autoTranslate?: number;
}

/**
 * 接口 [更新用户对照翻译设置↗](/interface/api/65863) 的 **返回类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `POST /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:12`
 */
export type PostUserTranslateSettingResponse = boolean;

/**
 * 接口 [更新用户对照翻译设置↗](/interface/api/65863) 的 **请求配置的类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `POST /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:12`
 */
type PostUserTranslateSettingRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/user/translateSetting', 'data', string, string, false>
>;

/**
 * 接口 [更新用户对照翻译设置↗](/interface/api/65863) 的 **请求配置**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `POST /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:12`
 */
const postUserTranslateSettingRequestConfig: PostUserTranslateSettingRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_0_0,
    devUrl: devUrl_2_0_0_0,
    prodUrl: prodUrl_2_0_0_0,
    path: '/user/translateSetting',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postUserTranslateSetting',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [更新用户对照翻译设置↗](/interface/api/65863) 的 **请求函数**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `POST /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:12`
 */
export const postUserTranslateSetting = /*#__PURE__*/ (
    requestData: PostUserTranslateSettingRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostUserTranslateSettingResponse>(
        prepare(postUserTranslateSettingRequestConfig, requestData),
        ...args
    );
};

postUserTranslateSetting.requestConfig = postUserTranslateSettingRequestConfig;

/**
 * 接口 [获取用户对照翻译设置↗](/interface/api/65870) 的 **请求类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `GET /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:26`
 */
export interface GetUserTranslateSettingRequest {
    url: string;
}

/**
 * 接口 [获取用户对照翻译设置↗](/interface/api/65870) 的 **返回类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `GET /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:26`
 */
export interface GetUserTranslateSettingResponse {
    /**
     * 来源语言
     */
    sourceLanguage?: string;
    /**
     * 目标语言
     */
    targetLanguage?: string;
    /**
     * 自动翻译
     */
    autoTranslate?: number;
}

/**
 * 接口 [获取用户对照翻译设置↗](/interface/api/65870) 的 **请求配置的类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `GET /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:26`
 */
type GetUserTranslateSettingRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/user/translateSetting', 'data', string, 'url', false>
>;

/**
 * 接口 [获取用户对照翻译设置↗](/interface/api/65870) 的 **请求配置**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `GET /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:26`
 */
const getUserTranslateSettingRequestConfig: GetUserTranslateSettingRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_0_0,
    devUrl: devUrl_2_0_0_0,
    prodUrl: prodUrl_2_0_0_0,
    path: '/user/translateSetting',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_0_0,
    paramNames: [],
    queryNames: ['url'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getUserTranslateSetting',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取用户对照翻译设置↗](/interface/api/65870) 的 **请求函数**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`, `弃用`
 * @请求头 `GET /user/translateSetting`
 * @更新时间 `2023-10-18 18:26:26`
 */
export const getUserTranslateSetting = /*#__PURE__*/ (
    requestData: GetUserTranslateSettingRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetUserTranslateSettingResponse>(
        prepare(getUserTranslateSettingRequestConfig, requestData),
        ...args
    );
};

getUserTranslateSetting.requestConfig = getUserTranslateSettingRequestConfig;

/**
 * 接口 [退出租户↗](/interface/api/66997) 的 **请求类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /user/tenant/{tenantId}`
 * @更新时间 `2023-10-30 15:26:02`
 */
export interface DeleteUserTenantTenantIdRequest {
    /**
     * 租户id
     */
    tenantId: string;
}

/**
 * 接口 [退出租户↗](/interface/api/66997) 的 **返回类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /user/tenant/{tenantId}`
 * @更新时间 `2023-10-30 15:26:02`
 */
export interface DeleteUserTenantTenantIdResponse {
    /**
     * 失效时间
     */
    expireTime: string;
    /**
     * 是否失效
     */
    expire: boolean;
    /**
     * 邮箱
     */
    mail: string;
    tenantId?: string;
    tenantName?: string;
}

/**
 * 接口 [退出租户↗](/interface/api/66997) 的 **请求配置的类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /user/tenant/{tenantId}`
 * @更新时间 `2023-10-30 15:26:02`
 */
type DeleteUserTenantTenantIdRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/user/tenant/{tenantId}',
        'data',
        'tenantId',
        string,
        false
    >
>;

/**
 * 接口 [退出租户↗](/interface/api/66997) 的 **请求配置**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /user/tenant/{tenantId}`
 * @更新时间 `2023-10-30 15:26:02`
 */
const deleteUserTenantTenantIdRequestConfig: DeleteUserTenantTenantIdRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_0_0,
    devUrl: devUrl_2_0_0_0,
    prodUrl: prodUrl_2_0_0_0,
    path: '/user/tenant/{tenantId}',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.form,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_0_0,
    paramNames: ['tenantId'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deleteUserTenantTenantId',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [退出租户↗](/interface/api/66997) 的 **请求函数**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /user/tenant/{tenantId}`
 * @更新时间 `2023-10-30 15:26:02`
 */
export const deleteUserTenantTenantId = /*#__PURE__*/ (
    requestData: DeleteUserTenantTenantIdRequest,
    ...args: UserRequestRestArgs
) => {
    return request<DeleteUserTenantTenantIdResponse>(
        prepare(deleteUserTenantTenantIdRequestConfig, requestData),
        ...args
    );
};

deleteUserTenantTenantId.requestConfig = deleteUserTenantTenantIdRequestConfig;

/**
 * 接口 [获取用户的加入租户的状态↗](/interface/api/68940) 的 **请求类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.5`, `用户相关接口`
 * @请求头 `GET /user/audit/tenant`
 * @更新时间 `2023-12-12 11:12:42`
 */
export interface GetUserAuditTenantRequest {}

/**
 * 接口 [获取用户的加入租户的状态↗](/interface/api/68940) 的 **返回类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.5`, `用户相关接口`
 * @请求头 `GET /user/audit/tenant`
 * @更新时间 `2023-12-12 11:12:42`
 */
export interface GetUserAuditTenantResponse {
    /**
     * 状态
     */
    status: 'APPROVED' | 'PENDING';
    /**
     * 企业租户id
     */
    tenantId: string;
    /**
     * 企业租户的名字
     */
    tenantName: string;
}

/**
 * 接口 [获取用户的加入租户的状态↗](/interface/api/68940) 的 **请求配置的类型**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.5`, `用户相关接口`
 * @请求头 `GET /user/audit/tenant`
 * @更新时间 `2023-12-12 11:12:42`
 */
type GetUserAuditTenantRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/user/audit/tenant', 'data', string, string, true>
>;

/**
 * 接口 [获取用户的加入租户的状态↗](/interface/api/68940) 的 **请求配置**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.5`, `用户相关接口`
 * @请求头 `GET /user/audit/tenant`
 * @更新时间 `2023-12-12 11:12:42`
 */
const getUserAuditTenantRequestConfig: GetUserAuditTenantRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_0_0,
    devUrl: devUrl_2_0_0_0,
    prodUrl: prodUrl_2_0_0_0,
    path: '/user/audit/tenant',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getUserAuditTenant',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取用户的加入租户的状态↗](/interface/api/68940) 的 **请求函数**
 *
 * @分类 [用户相关接口↗](/interface/api/cat_10380)
 * @标签 `v1.3.5`, `用户相关接口`
 * @请求头 `GET /user/audit/tenant`
 * @更新时间 `2023-12-12 11:12:42`
 */
export const getUserAuditTenant = /*#__PURE__*/ (
    requestData?: GetUserAuditTenantRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetUserAuditTenantResponse>(prepare(getUserAuditTenantRequestConfig, requestData), ...args);
};

getUserAuditTenant.requestConfig = getUserAuditTenantRequestConfig;

const mockUrl_2_0_1_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_2_0_1_0 = '' as any;
const prodUrl_2_0_1_0 = '' as any;
const dataKey_2_0_1_0 = 'data' as any;

/**
 * 接口 [获取某个企业下面的部门列表↗](/interface/api/58402) 的 **请求类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /corp/department`
 * @更新时间 `2023-08-08 13:53:15`
 */
export interface GetCorpDepartmentRequest {
    /**
     * 企业id
     */
    corpId: string;
}

/**
 * 接口 [获取某个企业下面的部门列表↗](/interface/api/58402) 的 **返回类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /corp/department`
 * @更新时间 `2023-08-08 13:53:15`
 */
export type GetCorpDepartmentResponse = {
    /**
     * 企业的id
     */
    corpId?: string;
    /**
     * 部门的id
     */
    departId?: string;
    /**
     * 部门的名字
     */
    departName?: string;
}[];

/**
 * 接口 [获取某个企业下面的部门列表↗](/interface/api/58402) 的 **请求配置的类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /corp/department`
 * @更新时间 `2023-08-08 13:53:15`
 */
type GetCorpDepartmentRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/corp/department', 'data', string, 'corpId', false>
>;

/**
 * 接口 [获取某个企业下面的部门列表↗](/interface/api/58402) 的 **请求配置**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /corp/department`
 * @更新时间 `2023-08-08 13:53:15`
 */
const getCorpDepartmentRequestConfig: GetCorpDepartmentRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_1_0,
    devUrl: devUrl_2_0_1_0,
    prodUrl: prodUrl_2_0_1_0,
    path: '/corp/department',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_1_0,
    paramNames: [],
    queryNames: ['corpId'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getCorpDepartment',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取某个企业下面的部门列表↗](/interface/api/58402) 的 **请求函数**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /corp/department`
 * @更新时间 `2023-08-08 13:53:15`
 */
export const getCorpDepartment = /*#__PURE__*/ (
    requestData: GetCorpDepartmentRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetCorpDepartmentResponse>(prepare(getCorpDepartmentRequestConfig, requestData), ...args);
};

getCorpDepartment.requestConfig = getCorpDepartmentRequestConfig;

/**
 * 接口 [添加用户的企业信息↗](/interface/api/58410) 的 **请求类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `POST /corp/user`
 * @更新时间 `2023-08-08 13:54:41`
 */
export interface PostCorpUserRequest {
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
 * 接口 [添加用户的企业信息↗](/interface/api/58410) 的 **返回类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `POST /corp/user`
 * @更新时间 `2023-08-08 13:54:41`
 */
export type PostCorpUserResponse = boolean;

/**
 * 接口 [添加用户的企业信息↗](/interface/api/58410) 的 **请求配置的类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `POST /corp/user`
 * @更新时间 `2023-08-08 13:54:41`
 */
type PostCorpUserRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/corp/user', 'data', string, string, false>
>;

/**
 * 接口 [添加用户的企业信息↗](/interface/api/58410) 的 **请求配置**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `POST /corp/user`
 * @更新时间 `2023-08-08 13:54:41`
 */
const postCorpUserRequestConfig: PostCorpUserRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_1_0,
    devUrl: devUrl_2_0_1_0,
    prodUrl: prodUrl_2_0_1_0,
    path: '/corp/user',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_1_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postCorpUser',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [添加用户的企业信息↗](/interface/api/58410) 的 **请求函数**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `POST /corp/user`
 * @更新时间 `2023-08-08 13:54:41`
 */
export const postCorpUser = /*#__PURE__*/ (requestData: PostCorpUserRequest, ...args: UserRequestRestArgs) => {
    return request<PostCorpUserResponse>(prepare(postCorpUserRequestConfig, requestData), ...args);
};

postCorpUser.requestConfig = postCorpUserRequestConfig;

/**
 * 接口 [服务更新列表↗](/interface/api/58663) 的 **请求类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /service/changelog/{type}`
 * @更新时间 `2023-08-21 15:44:22`
 */
export interface GetServiceChangelogTypeRequest {
    /**
     * extension: 插件 web: 网站
     */
    type: string;
}

/**
 * 接口 [服务更新列表↗](/interface/api/58663) 的 **返回类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /service/changelog/{type}`
 * @更新时间 `2023-08-21 15:44:22`
 */
export interface GetServiceChangelogTypeResponse {
    /**
     * 最新版本
     */
    version: string;
    changeList: {
        /**
         * 版本
         */
        version: string;
        /**
         * 更新时间，YYYY-MM-DD
         */
        updateTime: string;
        /**
         * 更新列表
         */
        change: string[];
    }[];
}

/**
 * 接口 [服务更新列表↗](/interface/api/58663) 的 **请求配置的类型**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /service/changelog/{type}`
 * @更新时间 `2023-08-21 15:44:22`
 */
type GetServiceChangelogTypeRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/service/changelog/{type}', 'data', 'type', string, false>
>;

/**
 * 接口 [服务更新列表↗](/interface/api/58663) 的 **请求配置**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /service/changelog/{type}`
 * @更新时间 `2023-08-21 15:44:22`
 */
const getServiceChangelogTypeRequestConfig: GetServiceChangelogTypeRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_2_0_1_0,
    devUrl: devUrl_2_0_1_0,
    prodUrl: prodUrl_2_0_1_0,
    path: '/service/changelog/{type}',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_2_0_1_0,
    paramNames: ['type'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getServiceChangelogType',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [服务更新列表↗](/interface/api/58663) 的 **请求函数**
 *
 * @分类 [公共分类↗](/interface/api/cat_10119)
 * @标签 `v1.1.0`
 * @请求头 `GET /service/changelog/{type}`
 * @更新时间 `2023-08-21 15:44:22`
 */
export const getServiceChangelogType = /*#__PURE__*/ (
    requestData: GetServiceChangelogTypeRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetServiceChangelogTypeResponse>(
        prepare(getServiceChangelogTypeRequestConfig, requestData),
        ...args
    );
};

getServiceChangelogType.requestConfig = getServiceChangelogTypeRequestConfig;

/* prettier-ignore-end */
