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

const mockUrl_5_0_0_0 = 'mock/858' as any;
const devUrl_5_0_0_0 = '' as any;
const prodUrl_5_0_0_0 = '' as any;
const dataKey_5_0_0_0 = 'data' as any;

/**
 * 接口 [发送消息生成图像↗](/interface/api/58000) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message`
 * @更新时间 `2023-08-08 17:23:52`
 */
export interface PostImagineMessageRequest {
    /**
     * 用户输入
     */
    msg: string;
    /**
     * 图片Key或url（key: 通过获取预签名上传url接口返回的key）
     */
    image?: string;
    /**
     * 图像权重
     */
    imageWeight?: number;
}

/**
 * 接口 [发送消息生成图像↗](/interface/api/58000) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message`
 * @更新时间 `2023-08-08 17:23:52`
 */
export interface PostImagineMessageResponse {
    messageId: string;
}

/**
 * 接口 [发送消息生成图像↗](/interface/api/58000) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message`
 * @更新时间 `2023-08-08 17:23:52`
 */
type PostImagineMessageRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/imagine/message', 'data', string, string, false>
>;

/**
 * 接口 [发送消息生成图像↗](/interface/api/58000) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message`
 * @更新时间 `2023-08-08 17:23:52`
 */
const postImagineMessageRequestConfig: PostImagineMessageRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/message',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postImagineMessage',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [发送消息生成图像↗](/interface/api/58000) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message`
 * @更新时间 `2023-08-08 17:23:52`
 */
export const postImagineMessage = /*#__PURE__*/ (
    requestData: PostImagineMessageRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostImagineMessageResponse>(prepare(postImagineMessageRequestConfig, requestData), ...args);
};

postImagineMessage.requestConfig = postImagineMessageRequestConfig;

/**
 * 接口 [获取结果↗](/interface/api/58002) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/{messageId}/result`
 * @更新时间 `2023-08-21 18:11:03`
 */
export interface GetImagineMessageIdResultRequest {
    /**
     * 发送提示生成图像返回的mid
     */
    messageId: string;
}

/**
 * 接口 [获取结果↗](/interface/api/58002) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/{messageId}/result`
 * @更新时间 `2023-08-21 18:11:03`
 */
export interface GetImagineMessageIdResultResponse {
    /**
     * 状态：NOT_START（未开始）,SUBMITTED（已提交）,IN_PROGRESS（处理中）,FAILURE（失败）,SUCCESS（成功）
     */
    status: string;
    /**
     * 百分比进度
     */
    progress: number;
    /**
     * 图片地址
     */
    imageUrl: string;
    /**
     * 缩略图
     */
    thumbnailUrl?: string;
    prompt?: string;
    refImageUrl?: string;
    /**
     * 操作：UPSCALE（放大），VARIATION（变体）, REROLL（重新生成）
     */
    action?: string;
    /**
     * 序号(1~4)
     */
    position?: string;
    /**
     * 图片选项数量
     */
    options: 1 | 4;
}

/**
 * 接口 [获取结果↗](/interface/api/58002) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/{messageId}/result`
 * @更新时间 `2023-08-21 18:11:03`
 */
type GetImagineMessageIdResultRequestConfig = Readonly<
    RequestConfig<
        'mock/858',
        '',
        '',
        '/imagine/{messageId}/result',
        'data',
        'messageId',
        string,
        false
    >
>;

/**
 * 接口 [获取结果↗](/interface/api/58002) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/{messageId}/result`
 * @更新时间 `2023-08-21 18:11:03`
 */
const getImagineMessageIdResultRequestConfig: GetImagineMessageIdResultRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/{messageId}/result',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: ['messageId'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getImagineMessageIdResult',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取结果↗](/interface/api/58002) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/{messageId}/result`
 * @更新时间 `2023-08-21 18:11:03`
 */
export const getImagineMessageIdResult = /*#__PURE__*/ (
    requestData: GetImagineMessageIdResultRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetImagineMessageIdResultResponse>(
        prepare(getImagineMessageIdResultRequestConfig, requestData),
        ...args
    );
};

getImagineMessageIdResult.requestConfig = getImagineMessageIdResultRequestConfig;

/**
 * 接口 [变换图像↗](/interface/api/58004) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message/change`
 * @更新时间 `2023-08-10 15:06:09`
 */
export interface PostImagineMessageChangeRequest {
    /**
     * 图片生成接口返回的ID
     */
    messageId: string;
    /**
     * 图片索引【1-4】，action为UPSCALE,VARIATION时必传
     */
    position?: number;
    /**
     * 操作：UPSCALE（放大），VARIATION（变体）, REROLL（重新生成）
     */
    action: 'UPSCALE' | 'VARIATION' | 'REROLL';
}

/**
 * 接口 [变换图像↗](/interface/api/58004) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message/change`
 * @更新时间 `2023-08-10 15:06:09`
 */
export interface PostImagineMessageChangeResponse {
    /**
     * 消息id
     */
    messageId: string;
    /**
     * 原始输入
     */
    originInput: string;
    /**
     * 状态
     */
    status: string;
    /**
     * 对应的操作指令
     */
    action: string;
}

/**
 * 接口 [变换图像↗](/interface/api/58004) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message/change`
 * @更新时间 `2023-08-10 15:06:09`
 */
type PostImagineMessageChangeRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/imagine/message/change', 'data', string, string, false>
>;

/**
 * 接口 [变换图像↗](/interface/api/58004) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message/change`
 * @更新时间 `2023-08-10 15:06:09`
 */
const postImagineMessageChangeRequestConfig: PostImagineMessageChangeRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/message/change',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postImagineMessageChange',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [变换图像↗](/interface/api/58004) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/message/change`
 * @更新时间 `2023-08-10 15:06:09`
 */
export const postImagineMessageChange = /*#__PURE__*/ (
    requestData: PostImagineMessageChangeRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostImagineMessageChangeResponse>(
        prepare(postImagineMessageChangeRequestConfig, requestData),
        ...args
    );
};

postImagineMessageChange.requestConfig = postImagineMessageChangeRequestConfig;

/**
 * 接口 [获取历史作图消息↗](/interface/api/58006) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/message/history`
 * @更新时间 `2023-08-21 18:10:39`
 */
export interface GetImagineMessageHistoryRequest {
    pageNo: string;
    pageSize: string;
}

/**
 * 接口 [获取历史作图消息↗](/interface/api/58006) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/message/history`
 * @更新时间 `2023-08-21 18:10:39`
 */
export interface GetImagineMessageHistoryResponse {
    total: number;
    records: {
        /**
         * 消息id
         */
        messageId: string;
        /**
         * 图片url
         */
        imageUrl: string;
        /**
         * 缩略图url
         */
        thumbnailUrl: string;
        /**
         * prompt
         */
        prompt: string;
        originInput: string;
        /**
         * 操作类型
         */
        action: string;
        /**
         * 状态
         */
        status: string;
        /**
         * 参考图片url
         */
        refImageUrl: string;
        /**
         * 参考图片key
         */
        refImageKey: string;
        /**
         * 图片选项数量
         */
        options: 1 | 4;
        /**
         * 失败原因
         */
        failReason: string;
        /**
         * 参数配置
         */
        paramConfig: {
            imageWeight: number;
            chaos: number;
            stylize: number;
            negative: string;
            seed: string;
        };
    };
    size: number;
}

/**
 * 接口 [获取历史作图消息↗](/interface/api/58006) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/message/history`
 * @更新时间 `2023-08-21 18:10:39`
 */
type GetImagineMessageHistoryRequestConfig = Readonly<
    RequestConfig<
        'mock/858',
        '',
        '',
        '/imagine/message/history',
        'data',
        string,
        'pageNo' | 'pageSize',
        false
    >
>;

/**
 * 接口 [获取历史作图消息↗](/interface/api/58006) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/message/history`
 * @更新时间 `2023-08-21 18:10:39`
 */
const getImagineMessageHistoryRequestConfig: GetImagineMessageHistoryRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/message/history',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: ['pageNo', 'pageSize'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getImagineMessageHistory',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取历史作图消息↗](/interface/api/58006) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/message/history`
 * @更新时间 `2023-08-21 18:10:39`
 */
export const getImagineMessageHistory = /*#__PURE__*/ (
    requestData: GetImagineMessageHistoryRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetImagineMessageHistoryResponse>(
        prepare(getImagineMessageHistoryRequestConfig, requestData),
        ...args
    );
};

getImagineMessageHistory.requestConfig = getImagineMessageHistoryRequestConfig;

/**
 * 接口 [保存绘图设置项↗](/interface/api/58008) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/setting`
 * @更新时间 `2023-08-17 14:03:36`
 */
export interface PostImagineSettingRequest {
    /**
     * 图像权重，取值范围【0-2】
     */
    imageWeight?: number;
    /**
     * 混乱值，取值范围【0-100】
     */
    chaos?: number;
    /**
     * 风格化，取值范围【0–1000】
     */
    stylize?: number;
    /**
     * 负面提示
     */
    negative?: string;
    /**
     * 负面提示原始文本
     */
    negativeOriginal?: string;
    /**
     * 随机种子，取值范围【0–4294967295】
     */
    seed?: number;
}

/**
 * 接口 [保存绘图设置项↗](/interface/api/58008) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/setting`
 * @更新时间 `2023-08-17 14:03:36`
 */
export interface PostImagineSettingResponse {}

/**
 * 接口 [保存绘图设置项↗](/interface/api/58008) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/setting`
 * @更新时间 `2023-08-17 14:03:36`
 */
type PostImagineSettingRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/imagine/setting', 'data', string, string, false>
>;

/**
 * 接口 [保存绘图设置项↗](/interface/api/58008) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/setting`
 * @更新时间 `2023-08-17 14:03:36`
 */
const postImagineSettingRequestConfig: PostImagineSettingRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/setting',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postImagineSetting',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [保存绘图设置项↗](/interface/api/58008) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/setting`
 * @更新时间 `2023-08-17 14:03:36`
 */
export const postImagineSetting = /*#__PURE__*/ (
    requestData: PostImagineSettingRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostImagineSettingResponse>(prepare(postImagineSettingRequestConfig, requestData), ...args);
};

postImagineSetting.requestConfig = postImagineSettingRequestConfig;

/**
 * 接口 [获取绘图设置项↗](/interface/api/58010) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/setting`
 * @更新时间 `2023-08-17 14:04:02`
 */
export interface GetImagineSettingRequest {}

/**
 * 接口 [获取绘图设置项↗](/interface/api/58010) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/setting`
 * @更新时间 `2023-08-17 14:04:02`
 */
export interface GetImagineSettingResponse {
    imageWeight: number;
    chaos: number;
    stylize: number;
    negative: string;
    /**
     * 负面提示原始文本
     */
    negativeOriginal: string;
    seed: string;
}

/**
 * 接口 [获取绘图设置项↗](/interface/api/58010) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/setting`
 * @更新时间 `2023-08-17 14:04:02`
 */
type GetImagineSettingRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/imagine/setting', 'data', string, string, true>
>;

/**
 * 接口 [获取绘图设置项↗](/interface/api/58010) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/setting`
 * @更新时间 `2023-08-17 14:04:02`
 */
const getImagineSettingRequestConfig: GetImagineSettingRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/setting',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getImagineSetting',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取绘图设置项↗](/interface/api/58010) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `GET /imagine/setting`
 * @更新时间 `2023-08-17 14:04:02`
 */
export const getImagineSetting = /*#__PURE__*/ (
    requestData?: GetImagineSettingRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetImagineSettingResponse>(prepare(getImagineSettingRequestConfig, requestData), ...args);
};

getImagineSetting.requestConfig = getImagineSettingRequestConfig;

/**
 * 接口 [webhook回调↗](/interface/api/58016) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/callback`
 * @更新时间 `2023-07-26 14:10:01`
 */
export interface PostImagineCallbackRequest {}

/**
 * 接口 [webhook回调↗](/interface/api/58016) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/callback`
 * @更新时间 `2023-07-26 14:10:01`
 */
export interface PostImagineCallbackResponse {}

/**
 * 接口 [webhook回调↗](/interface/api/58016) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/callback`
 * @更新时间 `2023-07-26 14:10:01`
 */
type PostImagineCallbackRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/imagine/callback', 'data', string, string, true>
>;

/**
 * 接口 [webhook回调↗](/interface/api/58016) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/callback`
 * @更新时间 `2023-07-26 14:10:01`
 */
const postImagineCallbackRequestConfig: PostImagineCallbackRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/callback',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.raw,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postImagineCallback',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [webhook回调↗](/interface/api/58016) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /imagine/callback`
 * @更新时间 `2023-07-26 14:10:01`
 */
export const postImagineCallback = /*#__PURE__*/ (
    requestData?: PostImagineCallbackRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostImagineCallbackResponse>(prepare(postImagineCallbackRequestConfig, requestData), ...args);
};

postImagineCallback.requestConfig = postImagineCallbackRequestConfig;

/**
 * 接口 [提示词翻译↗](/interface/api/58018) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /translate`
 * @更新时间 `2023-07-26 14:10:01`
 */
export interface PostTranslateRequest {
    /**
     * 需要翻译的文本
     */
    text: string;
    /**
     * 文本语种，默认为 auto
     */
    source?: string;
    /**
     * 翻译结果, 默认为 en
     */
    target?: string;
}

/**
 * 接口 [提示词翻译↗](/interface/api/58018) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /translate`
 * @更新时间 `2023-07-26 14:10:01`
 */
export interface PostTranslateResponse {
    /**
     * 翻译的文本
     */
    text: string;
    /**
     * 文本语种
     */
    source: string;
    /**
     * 翻译语种
     */
    target: string;
    /**
     * 翻译结果
     */
    dst: string;
}

/**
 * 接口 [提示词翻译↗](/interface/api/58018) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /translate`
 * @更新时间 `2023-07-26 14:10:01`
 */
type PostTranslateRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/translate', 'data', string, string, false>
>;

/**
 * 接口 [提示词翻译↗](/interface/api/58018) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /translate`
 * @更新时间 `2023-07-26 14:10:01`
 */
const postTranslateRequestConfig: PostTranslateRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/translate',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postTranslate',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [提示词翻译↗](/interface/api/58018) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @标签 `图像生成`
 * @请求头 `POST /translate`
 * @更新时间 `2023-07-26 14:10:01`
 */
export const postTranslate = /*#__PURE__*/ (requestData: PostTranslateRequest, ...args: UserRequestRestArgs) => {
    return request<PostTranslateResponse>(prepare(postTranslateRequestConfig, requestData), ...args);
};

postTranslate.requestConfig = postTranslateRequestConfig;

/**
 * 接口 [获取默认值配置↗](/interface/api/58028) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/config`
 * @更新时间 `2023-07-26 16:54:42`
 */
export interface GetImagineConfigRequest {}

/**
 * 接口 [获取默认值配置↗](/interface/api/58028) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/config`
 * @更新时间 `2023-07-26 16:54:42`
 */
export interface GetImagineConfigResponse {
    imageWeight: number;
    chaos: number;
    stylize: number;
    negative: string;
    seed: string;
}

/**
 * 接口 [获取默认值配置↗](/interface/api/58028) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/config`
 * @更新时间 `2023-07-26 16:54:42`
 */
type GetImagineConfigRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/imagine/config', 'data', string, string, true>
>;

/**
 * 接口 [获取默认值配置↗](/interface/api/58028) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/config`
 * @更新时间 `2023-07-26 16:54:42`
 */
const getImagineConfigRequestConfig: GetImagineConfigRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/config',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getImagineConfig',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取默认值配置↗](/interface/api/58028) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/config`
 * @更新时间 `2023-07-26 16:54:42`
 */
export const getImagineConfig = /*#__PURE__*/ (requestData?: GetImagineConfigRequest, ...args: UserRequestRestArgs) => {
    return request<GetImagineConfigResponse>(prepare(getImagineConfigRequestConfig, requestData), ...args);
};

getImagineConfig.requestConfig = getImagineConfigRequestConfig;

/**
 * 接口 [删除消息↗](/interface/api/58030) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `DELETE /imagine/message/{messageId}`
 * @更新时间 `2023-07-26 17:54:45`
 */
export interface DeleteImagineMessageMessageIdRequest {
    /**
     * 消息id
     */
    messageId: string;
}

/**
 * 接口 [删除消息↗](/interface/api/58030) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `DELETE /imagine/message/{messageId}`
 * @更新时间 `2023-07-26 17:54:45`
 */
export interface DeleteImagineMessageMessageIdResponse {}

/**
 * 接口 [删除消息↗](/interface/api/58030) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `DELETE /imagine/message/{messageId}`
 * @更新时间 `2023-07-26 17:54:45`
 */
type DeleteImagineMessageMessageIdRequestConfig = Readonly<
    RequestConfig<
        'mock/858',
        '',
        '',
        '/imagine/message/{messageId}',
        'data',
        'messageId',
        string,
        false
    >
>;

/**
 * 接口 [删除消息↗](/interface/api/58030) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `DELETE /imagine/message/{messageId}`
 * @更新时间 `2023-07-26 17:54:45`
 */
const deleteImagineMessageMessageIdRequestConfig: DeleteImagineMessageMessageIdRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/message/{messageId}',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.form,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: ['messageId'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deleteImagineMessageMessageId',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [删除消息↗](/interface/api/58030) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `DELETE /imagine/message/{messageId}`
 * @更新时间 `2023-07-26 17:54:45`
 */
export const deleteImagineMessageMessageId = /*#__PURE__*/ (
    requestData: DeleteImagineMessageMessageIdRequest,
    ...args: UserRequestRestArgs
) => {
    return request<DeleteImagineMessageMessageIdResponse>(
        prepare(deleteImagineMessageMessageIdRequestConfig, requestData),
        ...args
    );
};

deleteImagineMessageMessageId.requestConfig = deleteImagineMessageMessageIdRequestConfig;

/**
 * 接口 [获取预签名上传url↗](/interface/api/58265) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `POST /imagine/upload`
 * @更新时间 `2023-08-04 10:10:08`
 */
export interface PostImagineUploadRequest {
    /**
     * 图片名称包含扩展名
     */
    filename: string;
}

/**
 * 接口 [获取预签名上传url↗](/interface/api/58265) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `POST /imagine/upload`
 * @更新时间 `2023-08-04 10:10:08`
 */
export interface PostImagineUploadResponse {
    /**
     * 上传图片key
     */
    key: string;
    /**
     * 预签名上传url
     */
    preSignUrl: string;
}

/**
 * 接口 [获取预签名上传url↗](/interface/api/58265) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `POST /imagine/upload`
 * @更新时间 `2023-08-04 10:10:08`
 */
type PostImagineUploadRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/imagine/upload', 'data', string, string, false>
>;

/**
 * 接口 [获取预签名上传url↗](/interface/api/58265) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `POST /imagine/upload`
 * @更新时间 `2023-08-04 10:10:08`
 */
const postImagineUploadRequestConfig: PostImagineUploadRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/upload',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postImagineUpload',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取预签名上传url↗](/interface/api/58265) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `POST /imagine/upload`
 * @更新时间 `2023-08-04 10:10:08`
 */
export const postImagineUpload = /*#__PURE__*/ (
    requestData: PostImagineUploadRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostImagineUploadResponse>(prepare(postImagineUploadRequestConfig, requestData), ...args);
};

postImagineUpload.requestConfig = postImagineUploadRequestConfig;

/**
 * 接口 [获取图片↗](/interface/api/58610) 的 **请求类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/download`
 * @更新时间 `2023-08-16 14:34:31`
 */
export interface GetImagineDownloadRequest {
    key: string;
}

/**
 * 接口 [获取图片↗](/interface/api/58610) 的 **返回类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/download`
 * @更新时间 `2023-08-16 14:34:31`
 */
export interface GetImagineDownloadResponse {}

/**
 * 接口 [获取图片↗](/interface/api/58610) 的 **请求配置的类型**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/download`
 * @更新时间 `2023-08-16 14:34:31`
 */
type GetImagineDownloadRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/imagine/download', 'data', string, 'key', false>
>;

/**
 * 接口 [获取图片↗](/interface/api/58610) 的 **请求配置**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/download`
 * @更新时间 `2023-08-16 14:34:31`
 */
const getImagineDownloadRequestConfig: GetImagineDownloadRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_5_0_0_0,
    devUrl: devUrl_5_0_0_0,
    prodUrl: prodUrl_5_0_0_0,
    path: '/imagine/download',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_5_0_0_0,
    paramNames: [],
    queryNames: ['key'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getImagineDownload',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取图片↗](/interface/api/58610) 的 **请求函数**
 *
 * @分类 [图像生成↗](/interface/api/cat_10819)
 * @请求头 `GET /imagine/download`
 * @更新时间 `2023-08-16 14:34:31`
 */
export const getImagineDownload = /*#__PURE__*/ (
    requestData: GetImagineDownloadRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetImagineDownloadResponse>(prepare(getImagineDownloadRequestConfig, requestData), ...args);
};

getImagineDownload.requestConfig = getImagineDownloadRequestConfig;

/* prettier-ignore-end */
