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

const mockUrl_0_0_0_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_0_0_0_0 = '' as any;
const prodUrl_0_0_0_0 = '' as any;
const dataKey_0_0_0_0 = 'data' as any;

/**
 * 接口 [废弃-原提示词查询接口↗](/interface/api/55726) 的 **请求类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `弃用`
 * @请求头 `GET /prompts`
 * @更新时间 `2023-12-08 16:27:22`
 */
export interface GetPromptsRequest {
    /**
     * 非必填, 不分页时返回结果data直接是list
     */
    pageNo?: string;
    pageSize?: string;
    /**
     * 提示词类型列表(多个传数组), user_custom-用户自定义提示词,official-官方提示词,quick_action-快捷指令提示词。根据当前的页签传指定的枚举值
     */
    types: string;
    /**
     * 搜索关键字
     */
    keyword?: string;
}

/**
 * 接口 [废弃-原提示词查询接口↗](/interface/api/55726) 的 **返回类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `弃用`
 * @请求头 `GET /prompts`
 * @更新时间 `2023-12-08 16:27:22`
 */
export interface GetPromptsResponse {
    /**
     * 当前页码
     */
    pageNo?: number;
    /**
     * 页面的详细内容
     */
    records?: {
        id?: number;
        /**
         * 名称
         */
        name?: string;
        /**
         * 描述
         */
        desc?: string;
        /**
         * 图标
         */
        icon?: string;
        /**
         * prompt具体内容
         */
        content?: string;
        /**
         * 提示词类型, user_custom-用户自定义提示词,official-官方提示词,quick_action-快捷指令提示词
         */
        type?: string;
        /**
         * 是否公开
         */
        isPublic?: boolean;
        /**
         * 分类
         */
        category?: string;
        /**
         * 创建者
         */
        creator?: number;
    }[];
    /**
     * 当前页的详细总数
     */
    size?: number;
    /**
     * 总数
     */
    total?: number;
}

/**
 * 接口 [废弃-原提示词查询接口↗](/interface/api/55726) 的 **请求配置的类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `弃用`
 * @请求头 `GET /prompts`
 * @更新时间 `2023-12-08 16:27:22`
 */
type GetPromptsRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/prompts',
        'data',
        string,
        'pageNo' | 'pageSize' | 'types' | 'keyword',
        false
    >
>;

/**
 * 接口 [废弃-原提示词查询接口↗](/interface/api/55726) 的 **请求配置**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `弃用`
 * @请求头 `GET /prompts`
 * @更新时间 `2023-12-08 16:27:22`
 */
const getPromptsRequestConfig: GetPromptsRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_0_0_0_0,
    devUrl: devUrl_0_0_0_0,
    prodUrl: prodUrl_0_0_0_0,
    path: '/prompts',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_0_0_0_0,
    paramNames: [],
    queryNames: ['pageNo', 'pageSize', 'types', 'keyword'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getPrompts',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [废弃-原提示词查询接口↗](/interface/api/55726) 的 **请求函数**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `弃用`
 * @请求头 `GET /prompts`
 * @更新时间 `2023-12-08 16:27:22`
 */
export const getPrompts = /*#__PURE__*/ (requestData: GetPromptsRequest, ...args: UserRequestRestArgs) => {
    return request<GetPromptsResponse>(prepare(getPromptsRequestConfig, requestData), ...args);
};

getPrompts.requestConfig = getPromptsRequestConfig;

/**
 * 接口 [新增\/修改提示词↗](/interface/api/55733) 的 **请求类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `POST /prompts`
 * @更新时间 `2023-12-20 15:42:39`
 */
export interface PostPromptsRequest {
    /**
     * 提示词id, 修改必填
     */
    id?: string;
    /**
     * 名称
     */
    name: string;
    /**
     * 描述
     */
    desc?: string;
    /**
     * prompt具体内容
     */
    content: string;
}

/**
 * 接口 [新增\/修改提示词↗](/interface/api/55733) 的 **返回类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `POST /prompts`
 * @更新时间 `2023-12-20 15:42:39`
 */
export interface PostPromptsResponse {
    id?: number;
    /**
     * 名称
     */
    name?: string;
    /**
     * 描述
     */
    desc?: string;
    /**
     * prompt具体内容
     */
    content?: string;
    /**
     * 提示词类型, user_custom-用户自定义提示词,official-官方提示词,quick_action-快捷指令提示词
     */
    type?: string;
    /**
     * 是否公开
     */
    isPublic?: boolean;
    /**
     * 分类
     */
    category?: string;
    /**
     * 创建者
     */
    creator?: number;
}

/**
 * 接口 [新增\/修改提示词↗](/interface/api/55733) 的 **请求配置的类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `POST /prompts`
 * @更新时间 `2023-12-20 15:42:39`
 */
type PostPromptsRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/prompts', 'data', string, string, false>
>;

/**
 * 接口 [新增\/修改提示词↗](/interface/api/55733) 的 **请求配置**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `POST /prompts`
 * @更新时间 `2023-12-20 15:42:39`
 */
const postPromptsRequestConfig: PostPromptsRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_0_0_0_0,
    devUrl: devUrl_0_0_0_0,
    prodUrl: prodUrl_0_0_0_0,
    path: '/prompts',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_0_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postPrompts',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [新增\/修改提示词↗](/interface/api/55733) 的 **请求函数**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `POST /prompts`
 * @更新时间 `2023-12-20 15:42:39`
 */
export const postPrompts = /*#__PURE__*/ (requestData: PostPromptsRequest, ...args: UserRequestRestArgs) => {
    return request<PostPromptsResponse>(prepare(postPromptsRequestConfig, requestData), ...args);
};

postPrompts.requestConfig = postPromptsRequestConfig;

/**
 * 接口 [删除提示词↗](/interface/api/55740) 的 **请求类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `DELETE /prompts/{id}`
 * @更新时间 `2023-07-06 19:44:08`
 */
export interface DeletePromptsIdRequest {
    id: string;
}

/**
 * 接口 [删除提示词↗](/interface/api/55740) 的 **返回类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `DELETE /prompts/{id}`
 * @更新时间 `2023-07-06 19:44:08`
 */
export type DeletePromptsIdResponse = boolean;

/**
 * 接口 [删除提示词↗](/interface/api/55740) 的 **请求配置的类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `DELETE /prompts/{id}`
 * @更新时间 `2023-07-06 19:44:08`
 */
type DeletePromptsIdRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/prompts/{id}', 'data', 'id', string, false>
>;

/**
 * 接口 [删除提示词↗](/interface/api/55740) 的 **请求配置**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `DELETE /prompts/{id}`
 * @更新时间 `2023-07-06 19:44:08`
 */
const deletePromptsIdRequestConfig: DeletePromptsIdRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_0_0_0_0,
    devUrl: devUrl_0_0_0_0,
    prodUrl: prodUrl_0_0_0_0,
    path: '/prompts/{id}',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.form,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_0_0_0_0,
    paramNames: ['id'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deletePromptsId',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [删除提示词↗](/interface/api/55740) 的 **请求函数**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @请求头 `DELETE /prompts/{id}`
 * @更新时间 `2023-07-06 19:44:08`
 */
export const deletePromptsId = /*#__PURE__*/ (requestData: DeletePromptsIdRequest, ...args: UserRequestRestArgs) => {
    return request<DeletePromptsIdResponse>(prepare(deletePromptsIdRequestConfig, requestData), ...args);
};

deletePromptsId.requestConfig = deletePromptsIdRequestConfig;

/**
 * 接口 [新增企业提示词↗](/interface/api/68181) 的 **请求类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/increase`
 * @更新时间 `2023-11-29 15:41:24`
 */
export interface PostPromptsEnterpriseIncreaseRequest {
    /**
     * 提示词标题
     */
    name: string;
    /**
     * 提示词内容
     */
    content: string;
}

/**
 * 接口 [新增企业提示词↗](/interface/api/68181) 的 **返回类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/increase`
 * @更新时间 `2023-11-29 15:41:24`
 */
export interface PostPromptsEnterpriseIncreaseResponse {
    /**
     * 提示词主键id
     */
    id: number;
    /**
     * 提示词名称(标题)
     */
    name: string;
    /**
     * 描述
     */
    desc: string;
    /**
     * 图标
     */
    icon: string;
    /**
     * 提示词内容
     */
    content: string;
    /**
     * 提示词类型，此接口都是企业提示词
     */
    type: string;
    /**
     * 是否公开
     */
    isPublic: boolean;
    /**
     * 分类
     */
    category: string;
    /**
     * 提示词创建者id
     */
    creator: string;
    /**
     * 提示词所属租户id
     */
    tenantId: string;
    /**
     * 提示词创建者昵称
     */
    userName: string;
    /**
     * 提示词创建者邮箱
     */
    mail: string;
}

/**
 * 接口 [新增企业提示词↗](/interface/api/68181) 的 **请求配置的类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/increase`
 * @更新时间 `2023-11-29 15:41:24`
 */
type PostPromptsEnterpriseIncreaseRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/prompts/enterprise/increase',
        'data',
        string,
        string,
        false
    >
>;

/**
 * 接口 [新增企业提示词↗](/interface/api/68181) 的 **请求配置**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/increase`
 * @更新时间 `2023-11-29 15:41:24`
 */
const postPromptsEnterpriseIncreaseRequestConfig: PostPromptsEnterpriseIncreaseRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_0_0_0_0,
    devUrl: devUrl_0_0_0_0,
    prodUrl: prodUrl_0_0_0_0,
    path: '/prompts/enterprise/increase',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_0_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postPromptsEnterpriseIncrease',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [新增企业提示词↗](/interface/api/68181) 的 **请求函数**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/increase`
 * @更新时间 `2023-11-29 15:41:24`
 */
export const postPromptsEnterpriseIncrease = /*#__PURE__*/ (
    requestData: PostPromptsEnterpriseIncreaseRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostPromptsEnterpriseIncreaseResponse>(
        prepare(postPromptsEnterpriseIncreaseRequestConfig, requestData),
        ...args
    );
};

postPromptsEnterpriseIncrease.requestConfig = postPromptsEnterpriseIncreaseRequestConfig;

/**
 * 接口 [修改企业提示词↗](/interface/api/68190) 的 **请求类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/update`
 * @更新时间 `2023-11-29 15:41:34`
 */
export interface PostPromptsEnterpriseUpdateRequest {
    /**
     * 要修改的提示词id
     */
    id: number;
    /**
     * 提示词标题
     */
    name: string;
    /**
     * 提示词内容
     */
    content: string;
}

/**
 * 接口 [修改企业提示词↗](/interface/api/68190) 的 **返回类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/update`
 * @更新时间 `2023-11-29 15:41:34`
 */
export interface PostPromptsEnterpriseUpdateResponse {
    /**
     * 提示词主键id
     */
    id: number;
    /**
     * 提示词名称(标题)
     */
    name: string;
    /**
     * 描述
     */
    desc: string;
    /**
     * 图标
     */
    icon: string;
    /**
     * 提示词内容
     */
    content: string;
    /**
     * 提示词类型，此接口都是企业提示词
     */
    type: string;
    /**
     * 是否公开
     */
    isPublic: boolean;
    /**
     * 分类
     */
    category: string;
    /**
     * 提示词创建者id
     */
    creator: string;
    /**
     * 提示词所属租户id
     */
    tenantId: string;
    /**
     * 提示词创建者昵称
     */
    userName: string;
    /**
     * 提示词创建者邮箱
     */
    mail: string;
}

/**
 * 接口 [修改企业提示词↗](/interface/api/68190) 的 **请求配置的类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/update`
 * @更新时间 `2023-11-29 15:41:34`
 */
type PostPromptsEnterpriseUpdateRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/prompts/enterprise/update', 'data', string, string, false>
>;

/**
 * 接口 [修改企业提示词↗](/interface/api/68190) 的 **请求配置**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/update`
 * @更新时间 `2023-11-29 15:41:34`
 */
const postPromptsEnterpriseUpdateRequestConfig: PostPromptsEnterpriseUpdateRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_0_0_0_0,
    devUrl: devUrl_0_0_0_0,
    prodUrl: prodUrl_0_0_0_0,
    path: '/prompts/enterprise/update',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_0_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postPromptsEnterpriseUpdate',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [修改企业提示词↗](/interface/api/68190) 的 **请求函数**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/enterprise/update`
 * @更新时间 `2023-11-29 15:41:34`
 */
export const postPromptsEnterpriseUpdate = /*#__PURE__*/ (
    requestData: PostPromptsEnterpriseUpdateRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostPromptsEnterpriseUpdateResponse>(
        prepare(postPromptsEnterpriseUpdateRequestConfig, requestData),
        ...args
    );
};

postPromptsEnterpriseUpdate.requestConfig = postPromptsEnterpriseUpdateRequestConfig;

/**
 * 接口 [删除企业提示词↗](/interface/api/68199) 的 **请求类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `DELETE /prompts/enterprise/delete/{id}`
 * @更新时间 `2023-11-29 15:41:44`
 */
export interface DeletePromptsEnterpriseDeleteIdRequest {
    /**
     * 企业提示词id
     */
    id: string;
}

/**
 * 接口 [删除企业提示词↗](/interface/api/68199) 的 **返回类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `DELETE /prompts/enterprise/delete/{id}`
 * @更新时间 `2023-11-29 15:41:44`
 */
export type DeletePromptsEnterpriseDeleteIdResponse = boolean;

/**
 * 接口 [删除企业提示词↗](/interface/api/68199) 的 **请求配置的类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `DELETE /prompts/enterprise/delete/{id}`
 * @更新时间 `2023-11-29 15:41:44`
 */
type DeletePromptsEnterpriseDeleteIdRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/prompts/enterprise/delete/{id}',
        'data',
        'id',
        string,
        false
    >
>;

/**
 * 接口 [删除企业提示词↗](/interface/api/68199) 的 **请求配置**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `DELETE /prompts/enterprise/delete/{id}`
 * @更新时间 `2023-11-29 15:41:44`
 */
const deletePromptsEnterpriseDeleteIdRequestConfig: DeletePromptsEnterpriseDeleteIdRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_0_0_0_0,
    devUrl: devUrl_0_0_0_0,
    prodUrl: prodUrl_0_0_0_0,
    path: '/prompts/enterprise/delete/{id}',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.form,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_0_0_0_0,
    paramNames: ['id'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deletePromptsEnterpriseDeleteId',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [删除企业提示词↗](/interface/api/68199) 的 **请求函数**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `DELETE /prompts/enterprise/delete/{id}`
 * @更新时间 `2023-11-29 15:41:44`
 */
export const deletePromptsEnterpriseDeleteId = /*#__PURE__*/ (
    requestData: DeletePromptsEnterpriseDeleteIdRequest,
    ...args: UserRequestRestArgs
) => {
    return request<DeletePromptsEnterpriseDeleteIdResponse>(
        prepare(deletePromptsEnterpriseDeleteIdRequestConfig, requestData),
        ...args
    );
};

deletePromptsEnterpriseDeleteId.requestConfig = deletePromptsEnterpriseDeleteIdRequestConfig;

/**
 * 接口 [查询提示词-除企业提示词外，兼容其他所有提示词↗](/interface/api/68208) 的 **请求类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/{type}/search`
 * @更新时间 `2023-12-01 10:46:29`
 */
export interface PostPromptsTypeSearchRequest {
    /**
     * 提示词标题，用于检索
     */
    name?: string;
    /**
     * 实际页数
     */
    pageNo: number;
    /**
     * 每页数据量
     */
    pageSize: number;
    /**
     * user_custom-用户自定义提示词,official-官方提示词,quick_action-快捷指令提示词,enterprise-企业提示词
     */
    type: string;
}

/**
 * 接口 [查询提示词-除企业提示词外，兼容其他所有提示词↗](/interface/api/68208) 的 **返回类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/{type}/search`
 * @更新时间 `2023-12-01 10:46:29`
 */
export interface PostPromptsTypeSearchResponse {
    /**
     * 总数据量
     */
    total: string;
    /**
     * 每页数据量
     */
    size: string;
    /**
     * 当前页码
     */
    current: string;
    /**
     * 详细数据内容
     */
    records: {
        /**
         * 提示词主键id
         */
        id: number;
        /**
         * 提示词名称(标题)
         */
        name: string;
        /**
         * 描述
         */
        desc: string;
        /**
         * 图标
         */
        icon: string;
        /**
         * 提示词内容
         */
        content: string;
        /**
         * 提示词类型，此接口都是企业提示词
         */
        type: string;
        /**
         * 是否公开
         */
        isPublic: boolean;
        /**
         * 分类
         */
        category: string;
        /**
         * 提示词创建者id
         */
        creator: string;
        /**
         * 提示词所属租户id
         */
        tenantId: string;
        /**
         * 提示词创建者昵称
         */
        userName: string;
        /**
         * 提示词创建者邮箱
         */
        mail: string;
        /**
         * 创建日期
         */
        createTime: string;
    }[];
}

/**
 * 接口 [查询提示词-除企业提示词外，兼容其他所有提示词↗](/interface/api/68208) 的 **请求配置的类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/{type}/search`
 * @更新时间 `2023-12-01 10:46:29`
 */
type PostPromptsTypeSearchRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/prompts/{type}/search', 'data', 'type', string, false>
>;

/**
 * 接口 [查询提示词-除企业提示词外，兼容其他所有提示词↗](/interface/api/68208) 的 **请求配置**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/{type}/search`
 * @更新时间 `2023-12-01 10:46:29`
 */
const postPromptsTypeSearchRequestConfig: PostPromptsTypeSearchRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_0_0_0_0,
    devUrl: devUrl_0_0_0_0,
    prodUrl: prodUrl_0_0_0_0,
    path: '/prompts/{type}/search',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_0_0_0_0,
    paramNames: ['type'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postPromptsTypeSearch',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [查询提示词-除企业提示词外，兼容其他所有提示词↗](/interface/api/68208) 的 **请求函数**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `POST /prompts/{type}/search`
 * @更新时间 `2023-12-01 10:46:29`
 */
export const postPromptsTypeSearch = /*#__PURE__*/ (
    requestData: PostPromptsTypeSearchRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostPromptsTypeSearchResponse>(prepare(postPromptsTypeSearchRequestConfig, requestData), ...args);
};

postPromptsTypeSearch.requestConfig = postPromptsTypeSearchRequestConfig;

/**
 * 接口 [提示词数量统计↗](/interface/api/68478) 的 **请求类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `GET /prompts/count`
 * @更新时间 `2023-12-08 15:24:40`
 */
export interface GetPromptsCountRequest {}

/**
 * 接口 [提示词数量统计↗](/interface/api/68478) 的 **返回类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `GET /prompts/count`
 * @更新时间 `2023-12-08 15:24:40`
 */
export interface GetPromptsCountResponse {
    /**
     * 个人提示词数量
     */
    userCustom: number;
    /**
     * 系统提示词数量
     */
    official: number;
    /**
     * 快捷提示词数量
     */
    quickAction: number;
    /**
     * 企业提示词数量
     */
    enterprise: number;
}

/**
 * 接口 [提示词数量统计↗](/interface/api/68478) 的 **请求配置的类型**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `GET /prompts/count`
 * @更新时间 `2023-12-08 15:24:40`
 */
type GetPromptsCountRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/prompts/count', 'data', string, string, true>
>;

/**
 * 接口 [提示词数量统计↗](/interface/api/68478) 的 **请求配置**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `GET /prompts/count`
 * @更新时间 `2023-12-08 15:24:40`
 */
const getPromptsCountRequestConfig: GetPromptsCountRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_0_0_0_0,
    devUrl: devUrl_0_0_0_0,
    prodUrl: prodUrl_0_0_0_0,
    path: '/prompts/count',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_0_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getPromptsCount',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [提示词数量统计↗](/interface/api/68478) 的 **请求函数**
 *
 * @分类 [提示词↗](/interface/api/cat_10353)
 * @标签 `v1.3.5`
 * @请求头 `GET /prompts/count`
 * @更新时间 `2023-12-08 15:24:40`
 */
export const getPromptsCount = /*#__PURE__*/ (requestData?: GetPromptsCountRequest, ...args: UserRequestRestArgs) => {
    return request<GetPromptsCountResponse>(prepare(getPromptsCountRequestConfig, requestData), ...args);
};

getPromptsCount.requestConfig = getPromptsCountRequestConfig;

/* prettier-ignore-end */
