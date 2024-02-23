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

const mockUrl_7_0_0_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_7_0_0_0 = '' as any;
const prodUrl_7_0_0_0 = '' as any;
const dataKey_7_0_0_0 = 'data' as any;

/**
 * 接口 [添加临时租户↗](/interface/api/68415) 的 **请求类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/register`
 * @更新时间 `2023-12-01 10:13:42`
 */
export interface PostTenantRegisterRequest {
    /**
     * 验证码
     */
    code: string;
    /**
     * 企业联系人的姓名
     */
    contactName: string;
    /**
     * 企业联系人的电话
     */
    contactPhone: string;
    /**
     * 企业租户名字
     */
    tenantName: string;
    /**
     * 联系人的验证码,和发送验证码的时候保持一致
     */
    version: string;
    /**
     * 认证类型
     */
    type: 'phone' | 'mail';
}

/**
 * 接口 [添加临时租户↗](/interface/api/68415) 的 **返回类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/register`
 * @更新时间 `2023-12-01 10:13:42`
 */
export interface PostTenantRegisterResponse {
    /**
     * 租户id
     */
    tenantId: string;
    /**
     * 租户名字
     */
    tenantName: string;
}

/**
 * 接口 [添加临时租户↗](/interface/api/68415) 的 **请求配置的类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/register`
 * @更新时间 `2023-12-01 10:13:42`
 */
type PostTenantRegisterRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/tenant/register', 'data', string, string, false>
>;

/**
 * 接口 [添加临时租户↗](/interface/api/68415) 的 **请求配置**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/register`
 * @更新时间 `2023-12-01 10:13:42`
 */
const postTenantRegisterRequestConfig: PostTenantRegisterRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_7_0_0_0,
    devUrl: devUrl_7_0_0_0,
    prodUrl: prodUrl_7_0_0_0,
    path: '/tenant/register',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_7_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postTenantRegister',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [添加临时租户↗](/interface/api/68415) 的 **请求函数**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/register`
 * @更新时间 `2023-12-01 10:13:42`
 */
export const postTenantRegister = /*#__PURE__*/ (
    requestData: PostTenantRegisterRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostTenantRegisterResponse>(prepare(postTenantRegisterRequestConfig, requestData), ...args);
};

postTenantRegister.requestConfig = postTenantRegisterRequestConfig;

/**
 * 接口 [获取验证码的企业租户及部门列表↗](/interface/api/68433) 的 **请求类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `GET /tenant/department/code`
 * @更新时间 `2023-12-20 15:29:04`
 */
export interface GetTenantDepartmentCodeRequest {
    /**
     * 邀请码
     */
    code?: string;
    /**
     * 邀请链接 key
     */
    key?: string;
}

/**
 * 接口 [获取验证码的企业租户及部门列表↗](/interface/api/68433) 的 **返回类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `GET /tenant/department/code`
 * @更新时间 `2023-12-20 15:29:04`
 */
export type GetTenantDepartmentCodeResponse = {
    /**
     * 企业的id
     */
    tenantId: string;
    /**
     * 企业租户的名字
     */
    tenantName?: string;
    /**
     * 部门的id
     */
    departId?: string;
    /**
     * 部门的名字
     */
    departName?: string;
    /**
     * 父级部门
     */
    parentId?: string;
}[];

/**
 * 接口 [获取验证码的企业租户及部门列表↗](/interface/api/68433) 的 **请求配置的类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `GET /tenant/department/code`
 * @更新时间 `2023-12-20 15:29:04`
 */
type GetTenantDepartmentCodeRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/tenant/department/code',
        'data',
        string,
        'code' | 'key',
        false
    >
>;

/**
 * 接口 [获取验证码的企业租户及部门列表↗](/interface/api/68433) 的 **请求配置**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `GET /tenant/department/code`
 * @更新时间 `2023-12-20 15:29:04`
 */
const getTenantDepartmentCodeRequestConfig: GetTenantDepartmentCodeRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_7_0_0_0,
    devUrl: devUrl_7_0_0_0,
    prodUrl: prodUrl_7_0_0_0,
    path: '/tenant/department/code',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_7_0_0_0,
    paramNames: [],
    queryNames: ['code', 'key'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getTenantDepartmentCode',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取验证码的企业租户及部门列表↗](/interface/api/68433) 的 **请求函数**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `GET /tenant/department/code`
 * @更新时间 `2023-12-20 15:29:04`
 */
export const getTenantDepartmentCode = /*#__PURE__*/ (
    requestData: GetTenantDepartmentCodeRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetTenantDepartmentCodeResponse>(
        prepare(getTenantDepartmentCodeRequestConfig, requestData),
        ...args
    );
};

getTenantDepartmentCode.requestConfig = getTenantDepartmentCodeRequestConfig;

/**
 * 接口 [加入租户↗](/interface/api/68442) 的 **请求类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/user/register`
 * @更新时间 `2023-12-11 16:49:34`
 */
export interface PostTenantUserRegisterRequest {
    /**
     * 内测码
     */
    code?: string;
    /**
     * 部门id
     */
    departId?: string;
    /**
     * 邀请链接的参数信息
     */
    key?: string;
}

/**
 * 接口 [加入租户↗](/interface/api/68442) 的 **返回类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/user/register`
 * @更新时间 `2023-12-11 16:49:34`
 */
export interface PostTenantUserRegisterResponse {
    /**
     * 加入的企业ID
     */
    inviteTenantId?: string;
    /**
     * 加入的企业名称
     */
    inviteTenantName?: string;
    /**
     * 邀请人
     */
    inviteUserName?: string;
    /**
     * 目前的企业
     */
    tenantId?: string;
    /**
     * 目前的企业名称
     */
    tenantName?: string;
    /**
     * 结果
     */
    result?: 'PENDING' | 'APPROVED';
}

/**
 * 接口 [加入租户↗](/interface/api/68442) 的 **请求配置的类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/user/register`
 * @更新时间 `2023-12-11 16:49:34`
 */
type PostTenantUserRegisterRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/tenant/user/register', 'data', string, string, false>
>;

/**
 * 接口 [加入租户↗](/interface/api/68442) 的 **请求配置**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/user/register`
 * @更新时间 `2023-12-11 16:49:34`
 */
const postTenantUserRegisterRequestConfig: PostTenantUserRegisterRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_7_0_0_0,
    devUrl: devUrl_7_0_0_0,
    prodUrl: prodUrl_7_0_0_0,
    path: '/tenant/user/register',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_7_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postTenantUserRegister',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [加入租户↗](/interface/api/68442) 的 **请求函数**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`, `企业管理`
 * @请求头 `POST /tenant/user/register`
 * @更新时间 `2023-12-11 16:49:34`
 */
export const postTenantUserRegister = /*#__PURE__*/ (
    requestData: PostTenantUserRegisterRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostTenantUserRegisterResponse>(prepare(postTenantUserRegisterRequestConfig, requestData), ...args);
};

postTenantUserRegister.requestConfig = postTenantUserRegisterRequestConfig;

/**
 * 接口 [校验租户的名字是否存在↗](/interface/api/68604) 的 **请求类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `GET /tenant/check`
 * @更新时间 `2023-11-30 16:43:29`
 */
export interface GetTenantCheckRequest {
    /**
     * 租户的名字
     */
    tenantName: string;
}

/**
 * 接口 [校验租户的名字是否存在↗](/interface/api/68604) 的 **返回类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `GET /tenant/check`
 * @更新时间 `2023-11-30 16:43:29`
 */
export type GetTenantCheckResponse = boolean;

/**
 * 接口 [校验租户的名字是否存在↗](/interface/api/68604) 的 **请求配置的类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `GET /tenant/check`
 * @更新时间 `2023-11-30 16:43:29`
 */
type GetTenantCheckRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/tenant/check', 'data', string, 'tenantName', false>
>;

/**
 * 接口 [校验租户的名字是否存在↗](/interface/api/68604) 的 **请求配置**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `GET /tenant/check`
 * @更新时间 `2023-11-30 16:43:29`
 */
const getTenantCheckRequestConfig: GetTenantCheckRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_7_0_0_0,
    devUrl: devUrl_7_0_0_0,
    prodUrl: prodUrl_7_0_0_0,
    path: '/tenant/check',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_7_0_0_0,
    paramNames: [],
    queryNames: ['tenantName'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getTenantCheck',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [校验租户的名字是否存在↗](/interface/api/68604) 的 **请求函数**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `GET /tenant/check`
 * @更新时间 `2023-11-30 16:43:29`
 */
export const getTenantCheck = /*#__PURE__*/ (requestData: GetTenantCheckRequest, ...args: UserRequestRestArgs) => {
    return request<GetTenantCheckResponse>(prepare(getTenantCheckRequestConfig, requestData), ...args);
};

getTenantCheck.requestConfig = getTenantCheckRequestConfig;

/**
 * 接口 [退出原租户 申请新租户↗](/interface/api/68664) 的 **请求类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `POST /tenant/user/change`
 * @更新时间 `2023-12-11 16:52:53`
 */
export interface PostTenantUserChangeRequest {
    /**
     * 邀请链接的参数
     */
    key?: string;
    /**
     * 原租户id
     */
    tenantId: string;
    /**
     * 内测码
     */
    code?: string;
    /**
     * 部门id
     */
    departId?: string;
}

/**
 * 接口 [退出原租户 申请新租户↗](/interface/api/68664) 的 **返回类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `POST /tenant/user/change`
 * @更新时间 `2023-12-11 16:52:53`
 */
export interface PostTenantUserChangeResponse {
    /**
     * 加入的企业ID
     */
    inviteTenantId?: string;
    /**
     * 加入的企业名称
     */
    inviteTenantName?: string;
    /**
     * 邀请人
     */
    inviteUserName?: string;
    /**
     * 目前的企业
     */
    tenantId?: string;
    /**
     * 目前的企业名称
     */
    tenantName?: string;
    /**
     * 最后的加入结果
     */
    result?: 'PENDING' | 'APPROVED';
}

/**
 * 接口 [退出原租户 申请新租户↗](/interface/api/68664) 的 **请求配置的类型**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `POST /tenant/user/change`
 * @更新时间 `2023-12-11 16:52:53`
 */
type PostTenantUserChangeRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/tenant/user/change', 'data', string, string, false>
>;

/**
 * 接口 [退出原租户 申请新租户↗](/interface/api/68664) 的 **请求配置**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `POST /tenant/user/change`
 * @更新时间 `2023-12-11 16:52:53`
 */
const postTenantUserChangeRequestConfig: PostTenantUserChangeRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_7_0_0_0,
    devUrl: devUrl_7_0_0_0,
    prodUrl: prodUrl_7_0_0_0,
    path: '/tenant/user/change',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_7_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postTenantUserChange',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [退出原租户 申请新租户↗](/interface/api/68664) 的 **请求函数**
 *
 * @分类 [企业管理↗](/interface/api/cat_11376)
 * @标签 `v1.3.5`
 * @请求头 `POST /tenant/user/change`
 * @更新时间 `2023-12-11 16:52:53`
 */
export const postTenantUserChange = /*#__PURE__*/ (
    requestData: PostTenantUserChangeRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostTenantUserChangeResponse>(prepare(postTenantUserChangeRequestConfig, requestData), ...args);
};

postTenantUserChange.requestConfig = postTenantUserChangeRequestConfig;

const mockUrl_7_0_1_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_7_0_1_0 = '' as any;
const prodUrl_7_0_1_0 = '' as any;
const dataKey_7_0_1_0 = 'data' as any;

/**
 * 接口 [生成邀请链接↗](/interface/api/68325) 的 **请求类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/link`
 * @更新时间 `2023-12-19 19:46:00`
 */
export interface PostInternalInviteLinkRequest {
    /**
     * yyyy-MM-dd HH:mm:ss
     */
    expireDate: string;
    /**
     * 审核
     */
    isApprove: boolean;
}

/**
 * 接口 [生成邀请链接↗](/interface/api/68325) 的 **返回类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/link`
 * @更新时间 `2023-12-19 19:46:00`
 */
export type PostInternalInviteLinkResponse = string;

/**
 * 接口 [生成邀请链接↗](/interface/api/68325) 的 **请求配置的类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/link`
 * @更新时间 `2023-12-19 19:46:00`
 */
type PostInternalInviteLinkRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/internal/invite/link', 'data', string, string, false>
>;

/**
 * 接口 [生成邀请链接↗](/interface/api/68325) 的 **请求配置**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/link`
 * @更新时间 `2023-12-19 19:46:00`
 */
const postInternalInviteLinkRequestConfig: PostInternalInviteLinkRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_7_0_1_0,
    devUrl: devUrl_7_0_1_0,
    prodUrl: prodUrl_7_0_1_0,
    path: '/internal/invite/link',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_7_0_1_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postInternalInviteLink',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [生成邀请链接↗](/interface/api/68325) 的 **请求函数**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/link`
 * @更新时间 `2023-12-19 19:46:00`
 */
export const postInternalInviteLink = /*#__PURE__*/ (
    requestData: PostInternalInviteLinkRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostInternalInviteLinkResponse>(prepare(postInternalInviteLinkRequestConfig, requestData), ...args);
};

postInternalInviteLink.requestConfig = postInternalInviteLinkRequestConfig;

/**
 * 接口 [邀请码邀请↗](/interface/api/68343) 的 **请求类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/code`
 * @更新时间 `2023-11-29 15:45:55`
 */
export interface PostInternalInviteCodeRequest {
    /**
     * 文件
     */
    file: FileData;
    /**
     * 是否审核
     */
    isApprove: string;
}

/**
 * 接口 [邀请码邀请↗](/interface/api/68343) 的 **返回类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/code`
 * @更新时间 `2023-11-29 15:45:55`
 */
export type PostInternalInviteCodeResponse = boolean;

/**
 * 接口 [邀请码邀请↗](/interface/api/68343) 的 **请求配置的类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/code`
 * @更新时间 `2023-11-29 15:45:55`
 */
type PostInternalInviteCodeRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/internal/invite/code', 'data', string, string, false>
>;

/**
 * 接口 [邀请码邀请↗](/interface/api/68343) 的 **请求配置**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/code`
 * @更新时间 `2023-11-29 15:45:55`
 */
const postInternalInviteCodeRequestConfig: PostInternalInviteCodeRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_7_0_1_0,
    devUrl: devUrl_7_0_1_0,
    prodUrl: prodUrl_7_0_1_0,
    path: '/internal/invite/code',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.form,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_7_0_1_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postInternalInviteCode',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [邀请码邀请↗](/interface/api/68343) 的 **请求函数**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `POST /internal/invite/code`
 * @更新时间 `2023-11-29 15:45:55`
 */
export const postInternalInviteCode = /*#__PURE__*/ (
    requestData: PostInternalInviteCodeRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostInternalInviteCodeResponse>(prepare(postInternalInviteCodeRequestConfig, requestData), ...args);
};

postInternalInviteCode.requestConfig = postInternalInviteCodeRequestConfig;

/**
 * 接口 [邀请链接有效校验，白名单↗](/interface/api/68496) 的 **请求类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `GET /link2c/check/white`
 * @更新时间 `2023-12-01 13:14:42`
 */
export interface GetLink2cCheckWhiteRequest {
    param: string;
    /**
     * 有的时候传
     */
    userId: string;
}

/**
 * 接口 [邀请链接有效校验，白名单↗](/interface/api/68496) 的 **返回类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `GET /link2c/check/white`
 * @更新时间 `2023-12-01 13:14:42`
 */
export interface GetLink2cCheckWhiteResponse {
    /**
     * 邀请人
     */
    inviteUserName: string;
    /**
     * 邀请加入的企业名称
     */
    inviteTenantName: string;
    /**
     * 邀请加入的企业id
     */
    inviteTenantId: string;
    /**
     * 目前的企业ID，
     */
    tenantId?: string;
    /**
     * 目前的企业名称
     */
    tenantName?: string;
}

/**
 * 接口 [邀请链接有效校验，白名单↗](/interface/api/68496) 的 **请求配置的类型**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `GET /link2c/check/white`
 * @更新时间 `2023-12-01 13:14:42`
 */
type GetLink2cCheckWhiteRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/link2c/check/white',
        'data',
        string,
        'param' | 'userId',
        false
    >
>;

/**
 * 接口 [邀请链接有效校验，白名单↗](/interface/api/68496) 的 **请求配置**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `GET /link2c/check/white`
 * @更新时间 `2023-12-01 13:14:42`
 */
const getLink2cCheckWhiteRequestConfig: GetLink2cCheckWhiteRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_7_0_1_0,
    devUrl: devUrl_7_0_1_0,
    prodUrl: prodUrl_7_0_1_0,
    path: '/link2c/check/white',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_7_0_1_0,
    paramNames: [],
    queryNames: ['param', 'userId'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getLink2cCheckWhite',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [邀请链接有效校验，白名单↗](/interface/api/68496) 的 **请求函数**
 *
 * @分类 [企业租户管理后台 - 邀请成员↗](/interface/api/cat_11322)
 * @标签 `v1.3.5`
 * @请求头 `GET /link2c/check/white`
 * @更新时间 `2023-12-01 13:14:42`
 */
export const getLink2cCheckWhite = /*#__PURE__*/ (
    requestData: GetLink2cCheckWhiteRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetLink2cCheckWhiteResponse>(prepare(getLink2cCheckWhiteRequestConfig, requestData), ...args);
};

getLink2cCheckWhite.requestConfig = getLink2cCheckWhiteRequestConfig;

/* prettier-ignore-end */
