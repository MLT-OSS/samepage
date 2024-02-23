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

const mockUrl_8_0_0_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_8_0_0_0 = '' as any;
const prodUrl_8_0_0_0 = '' as any;
const dataKey_8_0_0_0 = 'data' as any;

/**
 * 接口 [发送手机验证码↗](/interface/api/68424) 的 **请求类型**
 *
 * @分类 [信息发送↗](/interface/api/cat_11385)
 * @标签 `v1.3.5`, `信息发送`
 * @请求头 `GET /sms/send/{type}`
 * @更新时间 `2023-12-08 10:20:10`
 */
export interface GetSmsSendTypeRequest {
    /**
     * 页面的类型，uuid 由前端生成
     */
    version: string;
    /**
     * 手机号
     */
    phone: string;
    /**
     * 企业租户的名字
     */
    tenantName: string;
    /**
     * 验证码的类型
     */
    type: string;
}

/**
 * 接口 [发送手机验证码↗](/interface/api/68424) 的 **返回类型**
 *
 * @分类 [信息发送↗](/interface/api/cat_11385)
 * @标签 `v1.3.5`, `信息发送`
 * @请求头 `GET /sms/send/{type}`
 * @更新时间 `2023-12-08 10:20:10`
 */
export type GetSmsSendTypeResponse = boolean;

/**
 * 接口 [发送手机验证码↗](/interface/api/68424) 的 **请求配置的类型**
 *
 * @分类 [信息发送↗](/interface/api/cat_11385)
 * @标签 `v1.3.5`, `信息发送`
 * @请求头 `GET /sms/send/{type}`
 * @更新时间 `2023-12-08 10:20:10`
 */
type GetSmsSendTypeRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/sms/send/{type}',
        'data',
        'type',
        'version' | 'phone' | 'tenantName',
        false
    >
>;

/**
 * 接口 [发送手机验证码↗](/interface/api/68424) 的 **请求配置**
 *
 * @分类 [信息发送↗](/interface/api/cat_11385)
 * @标签 `v1.3.5`, `信息发送`
 * @请求头 `GET /sms/send/{type}`
 * @更新时间 `2023-12-08 10:20:10`
 */
const getSmsSendTypeRequestConfig: GetSmsSendTypeRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_8_0_0_0,
    devUrl: devUrl_8_0_0_0,
    prodUrl: prodUrl_8_0_0_0,
    path: '/sms/send/{type}',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_8_0_0_0,
    paramNames: ['type'],
    queryNames: ['version', 'phone', 'tenantName'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getSmsSendType',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [发送手机验证码↗](/interface/api/68424) 的 **请求函数**
 *
 * @分类 [信息发送↗](/interface/api/cat_11385)
 * @标签 `v1.3.5`, `信息发送`
 * @请求头 `GET /sms/send/{type}`
 * @更新时间 `2023-12-08 10:20:10`
 */
export const getSmsSendType = /*#__PURE__*/ (requestData: GetSmsSendTypeRequest, ...args: UserRequestRestArgs) => {
    return request<GetSmsSendTypeResponse>(prepare(getSmsSendTypeRequestConfig, requestData), ...args);
};

getSmsSendType.requestConfig = getSmsSendTypeRequestConfig;

/* prettier-ignore-end */
