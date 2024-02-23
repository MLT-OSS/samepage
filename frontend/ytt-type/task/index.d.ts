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

const mockUrl_4_0_0_0 = 'mock/858' as any;
const devUrl_4_0_0_0 = '' as any;
const prodUrl_4_0_0_0 = '' as any;
const dataKey_4_0_0_0 = 'data' as any;

/**
 * 接口 [获取任务进度↗](/interface/api/58042) 的 **请求类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/info`
 * @更新时间 `2023-08-21 14:02:52`
 */
export interface GetTaskInfoRequest {
    /**
     * taskId
     */
    taskId: string;
}

/**
 * 接口 [获取任务进度↗](/interface/api/58042) 的 **返回类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/info`
 * @更新时间 `2023-08-21 14:02:52`
 */
export interface GetTaskInfoResponse {
    /**
     * 是否完成，当是true时，直接调创建会话接口
     */
    complete: boolean;
    createId?: number;
    createTime?: string;
    /**
     * 文档的id,全局唯一
     */
    docId: string;
    /**
     * 文档类型
     */
    docType: string;
    language?: 'Chinese' | 'English';
    md5?: string;
    /**
     * 文档名称
     */
    name: string;
    /**
     * 在某个阶段的进度信息
     */
    progress: number;
    /**
     * 文档大小
     */
    size?: number;
    /**
     * 执行阶段
     */
    stage: string;
    /**
     * 任务的id
     */
    taskId: string;
    /**
     * 总进度
     */
    totalProgress: string;
}

/**
 * 接口 [获取任务进度↗](/interface/api/58042) 的 **请求配置的类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/info`
 * @更新时间 `2023-08-21 14:02:52`
 */
type GetTaskInfoRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/task/info', 'data', string, 'taskId', false>
>;

/**
 * 接口 [获取任务进度↗](/interface/api/58042) 的 **请求配置**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/info`
 * @更新时间 `2023-08-21 14:02:52`
 */
const getTaskInfoRequestConfig: GetTaskInfoRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_4_0_0_0,
    devUrl: devUrl_4_0_0_0,
    prodUrl: prodUrl_4_0_0_0,
    path: '/task/info',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_4_0_0_0,
    paramNames: [],
    queryNames: ['taskId'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getTaskInfo',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取任务进度↗](/interface/api/58042) 的 **请求函数**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/info`
 * @更新时间 `2023-08-21 14:02:52`
 */
export const getTaskInfo = /*#__PURE__*/ (requestData: GetTaskInfoRequest, ...args: UserRequestRestArgs) => {
    return request<GetTaskInfoResponse>(prepare(getTaskInfoRequestConfig, requestData), ...args);
};

getTaskInfo.requestConfig = getTaskInfoRequestConfig;

/**
 * 接口 [提交任务↗](/interface/api/58044) 的 **请求类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `POST /task/create`
 * @更新时间 `2023-07-31 09:53:36`
 */
export interface PostTaskCreateRequest {
    /**
     * 文档id
     */
    docId?: string;
    /**
     * 任务返回的语言信息
     */
    language?: 'Chinese' | 'English';
    /**
     * 全文内容
     */
    text?: string;
}

/**
 * 接口 [提交任务↗](/interface/api/58044) 的 **返回类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `POST /task/create`
 * @更新时间 `2023-07-31 09:53:36`
 */
export interface PostTaskCreateResponse {
    createId?: number;
    createTime?: string;
    /**
     * 文档的id,全局唯一
     */
    docId: string;
    /**
     * 文档类型
     */
    docType: string;
    language?: 'Chinese' | 'English';
    md5?: string;
    /**
     * 文档名称
     */
    name: string;
    /**
     * 文档大小
     */
    size?: number;
    /**
     * 任务的id
     */
    taskId?: string;
    /**
     * 是否完成，当是true时，直接调创建会话接口
     */
    complete: boolean;
}

/**
 * 接口 [提交任务↗](/interface/api/58044) 的 **请求配置的类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `POST /task/create`
 * @更新时间 `2023-07-31 09:53:36`
 */
type PostTaskCreateRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/task/create', 'data', string, string, false>
>;

/**
 * 接口 [提交任务↗](/interface/api/58044) 的 **请求配置**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `POST /task/create`
 * @更新时间 `2023-07-31 09:53:36`
 */
const postTaskCreateRequestConfig: PostTaskCreateRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_4_0_0_0,
    devUrl: devUrl_4_0_0_0,
    prodUrl: prodUrl_4_0_0_0,
    path: '/task/create',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_4_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postTaskCreate',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [提交任务↗](/interface/api/58044) 的 **请求函数**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `POST /task/create`
 * @更新时间 `2023-07-31 09:53:36`
 */
export const postTaskCreate = /*#__PURE__*/ (requestData: PostTaskCreateRequest, ...args: UserRequestRestArgs) => {
    return request<PostTaskCreateResponse>(prepare(postTaskCreateRequestConfig, requestData), ...args);
};

postTaskCreate.requestConfig = postTaskCreateRequestConfig;

/**
 * 接口 [取消任务↗](/interface/api/58046) 的 **请求类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/cancel`
 * @更新时间 `2023-07-27 14:49:36`
 */
export interface GetTaskCancelRequest {
    /**
     * taskId
     */
    taskId: string;
}

/**
 * 接口 [取消任务↗](/interface/api/58046) 的 **返回类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/cancel`
 * @更新时间 `2023-07-27 14:49:36`
 */
export type GetTaskCancelResponse = boolean;

/**
 * 接口 [取消任务↗](/interface/api/58046) 的 **请求配置的类型**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/cancel`
 * @更新时间 `2023-07-27 14:49:36`
 */
type GetTaskCancelRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/task/cancel', 'data', string, 'taskId', false>
>;

/**
 * 接口 [取消任务↗](/interface/api/58046) 的 **请求配置**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/cancel`
 * @更新时间 `2023-07-27 14:49:36`
 */
const getTaskCancelRequestConfig: GetTaskCancelRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_4_0_0_0,
    devUrl: devUrl_4_0_0_0,
    prodUrl: prodUrl_4_0_0_0,
    path: '/task/cancel',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_4_0_0_0,
    paramNames: [],
    queryNames: ['taskId'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getTaskCancel',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [取消任务↗](/interface/api/58046) 的 **请求函数**
 *
 * @分类 [任务管理↗](/interface/api/cat_10843)
 * @标签 `任务管理`
 * @请求头 `GET /task/cancel`
 * @更新时间 `2023-07-27 14:49:36`
 */
export const getTaskCancel = /*#__PURE__*/ (requestData: GetTaskCancelRequest, ...args: UserRequestRestArgs) => {
    return request<GetTaskCancelResponse>(prepare(getTaskCancelRequestConfig, requestData), ...args);
};

getTaskCancel.requestConfig = getTaskCancelRequestConfig;

/* prettier-ignore-end */
