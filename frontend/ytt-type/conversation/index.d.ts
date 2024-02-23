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

const mockUrl_3_0_0_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_3_0_0_0 = '' as any;
const prodUrl_3_0_0_0 = '' as any;
const dataKey_3_0_0_0 = 'data' as any;

/**
 * 接口 [获取文件的基本信息↗](/interface/api/58038) 的 **请求类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/info`
 * @更新时间 `2023-08-04 12:53:26`
 */
export interface GetDocInfoRequest {
    /**
     * docId
     */
    docId: string;
}

/**
 * 接口 [获取文件的基本信息↗](/interface/api/58038) 的 **返回类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/info`
 * @更新时间 `2023-08-04 12:53:26`
 */
export interface GetDocInfoResponse {
    createTime?: string;
    /**
     * 文档的id,全局唯一
     */
    docId: string;
    /**
     * 文档类型
     */
    docType: string;
    /**
     * 文档名称
     */
    name: string;
    /**
     * 文件查看地址
     */
    objUrl?: string;
    /**
     * 文档大小
     */
    size?: number;
    /**
     * 最近的会话id
     */
    recentConversationId?: string;
}

/**
 * 接口 [获取文件的基本信息↗](/interface/api/58038) 的 **请求配置的类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/info`
 * @更新时间 `2023-08-04 12:53:26`
 */
type GetDocInfoRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/doc/info', 'data', string, 'docId', false>
>;

/**
 * 接口 [获取文件的基本信息↗](/interface/api/58038) 的 **请求配置**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/info`
 * @更新时间 `2023-08-04 12:53:26`
 */
const getDocInfoRequestConfig: GetDocInfoRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_0_0,
    devUrl: devUrl_3_0_0_0,
    prodUrl: prodUrl_3_0_0_0,
    path: '/doc/info',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_0_0,
    paramNames: [],
    queryNames: ['docId'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getDocInfo',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取文件的基本信息↗](/interface/api/58038) 的 **请求函数**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/info`
 * @更新时间 `2023-08-04 12:53:26`
 */
export const getDocInfo = /*#__PURE__*/ (requestData: GetDocInfoRequest, ...args: UserRequestRestArgs) => {
    return request<GetDocInfoResponse>(prepare(getDocInfoRequestConfig, requestData), ...args);
};

getDocInfo.requestConfig = getDocInfoRequestConfig;

/**
 * 接口 [获取文件列表↗](/interface/api/58040) 的 **请求类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/list`
 * @更新时间 `2023-08-03 18:54:44`
 */
export interface GetDocListRequest {}

/**
 * 接口 [获取文件列表↗](/interface/api/58040) 的 **返回类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/list`
 * @更新时间 `2023-08-03 18:54:44`
 */
export type GetDocListResponse = {
    createDate?: string;
    /**
     * 文档的id,全局唯一
     */
    docId: string;
    /**
     * 文档类型
     */
    docType: string;
    /**
     * 文档名称
     */
    name: string;
    /**
     * 文档大小
     */
    size?: number;
    /**
     * 会话id
     */
    recentConversationId?: string;
}[];

/**
 * 接口 [获取文件列表↗](/interface/api/58040) 的 **请求配置的类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/list`
 * @更新时间 `2023-08-03 18:54:44`
 */
type GetDocListRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/doc/list', 'data', string, string, true>
>;

/**
 * 接口 [获取文件列表↗](/interface/api/58040) 的 **请求配置**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/list`
 * @更新时间 `2023-08-03 18:54:44`
 */
const getDocListRequestConfig: GetDocListRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_0_0,
    devUrl: devUrl_3_0_0_0,
    prodUrl: prodUrl_3_0_0_0,
    path: '/doc/list',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getDocList',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取文件列表↗](/interface/api/58040) 的 **请求函数**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `GET /doc/list`
 * @更新时间 `2023-08-03 18:54:44`
 */
export const getDocList = /*#__PURE__*/ (requestData?: GetDocListRequest, ...args: UserRequestRestArgs) => {
    return request<GetDocListResponse>(prepare(getDocListRequestConfig, requestData), ...args);
};

getDocList.requestConfig = getDocListRequestConfig;

/**
 * 接口 [删除文档及其相关联的会话信息↗](/interface/api/58052) 的 **请求类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `DELETE /doc/{docId}`
 * @更新时间 `2023-07-27 14:58:19`
 */
export interface DeleteDocDocIdRequest {
    /**
     * docId
     */
    docId: string;
}

/**
 * 接口 [删除文档及其相关联的会话信息↗](/interface/api/58052) 的 **返回类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `DELETE /doc/{docId}`
 * @更新时间 `2023-07-27 14:58:19`
 */
export type DeleteDocDocIdResponse = boolean;

/**
 * 接口 [删除文档及其相关联的会话信息↗](/interface/api/58052) 的 **请求配置的类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `DELETE /doc/{docId}`
 * @更新时间 `2023-07-27 14:58:19`
 */
type DeleteDocDocIdRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/doc/{docId}', 'data', 'docId', string, false>
>;

/**
 * 接口 [删除文档及其相关联的会话信息↗](/interface/api/58052) 的 **请求配置**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `DELETE /doc/{docId}`
 * @更新时间 `2023-07-27 14:58:19`
 */
const deleteDocDocIdRequestConfig: DeleteDocDocIdRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_0_0,
    devUrl: devUrl_3_0_0_0,
    prodUrl: prodUrl_3_0_0_0,
    path: '/doc/{docId}',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.raw,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_0_0,
    paramNames: ['docId'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deleteDocDocId',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [删除文档及其相关联的会话信息↗](/interface/api/58052) 的 **请求函数**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `DELETE /doc/{docId}`
 * @更新时间 `2023-07-27 14:58:19`
 */
export const deleteDocDocId = /*#__PURE__*/ (requestData: DeleteDocDocIdRequest, ...args: UserRequestRestArgs) => {
    return request<DeleteDocDocIdResponse>(prepare(deleteDocDocIdRequestConfig, requestData), ...args);
};

deleteDocDocId.requestConfig = deleteDocDocIdRequestConfig;

/**
 * 接口 [获取上传的信息↗](/interface/api/58066) 的 **请求类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `POST /doc/upload-config`
 * @更新时间 `2023-07-31 09:51:11`
 */
export interface PostDocUploadConfigRequest {
    /**
     * 文件名
     */
    fileName: string;
    /**
     * 文件的md5
     */
    md5: string;
    /**
     * 文件的大小
     */
    size: number;
}

/**
 * 接口 [获取上传的信息↗](/interface/api/58066) 的 **返回类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `POST /doc/upload-config`
 * @更新时间 `2023-07-31 09:51:11`
 */
export interface PostDocUploadConfigResponse {
    /**
     * 创建时间
     */
    createId?: string;
    /**
     * 文档id
     */
    docId: string;
    /**
     * 文件名称
     */
    fileName?: string;
    /**
     * 文档的md5
     */
    md5: string;
    /**
     * 文件的上传地址，如果为空则不需要上传
     */
    uploadUrl?: string;
}

/**
 * 接口 [获取上传的信息↗](/interface/api/58066) 的 **请求配置的类型**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `POST /doc/upload-config`
 * @更新时间 `2023-07-31 09:51:11`
 */
type PostDocUploadConfigRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/doc/upload-config', 'data', string, string, false>
>;

/**
 * 接口 [获取上传的信息↗](/interface/api/58066) 的 **请求配置**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `POST /doc/upload-config`
 * @更新时间 `2023-07-31 09:51:11`
 */
const postDocUploadConfigRequestConfig: PostDocUploadConfigRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_0_0,
    devUrl: devUrl_3_0_0_0,
    prodUrl: prodUrl_3_0_0_0,
    path: '/doc/upload-config',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postDocUploadConfig',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取上传的信息↗](/interface/api/58066) 的 **请求函数**
 *
 * @分类 [文件接口↗](/interface/api/cat_10835)
 * @标签 `文件接口`
 * @请求头 `POST /doc/upload-config`
 * @更新时间 `2023-07-31 09:51:11`
 */
export const postDocUploadConfig = /*#__PURE__*/ (
    requestData: PostDocUploadConfigRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostDocUploadConfigResponse>(prepare(postDocUploadConfigRequestConfig, requestData), ...args);
};

postDocUploadConfig.requestConfig = postDocUploadConfigRequestConfig;

const mockUrl_3_0_1_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_3_0_1_0 = '' as any;
const prodUrl_3_0_1_0 = '' as any;
const dataKey_3_0_1_0 = 'data' as any;

/**
 * 接口 [输入消息↗](/interface/api/63954) 的 **请求类型**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/conv`
 * @更新时间 `2023-12-05 15:26:00`
 */
export interface PostBotChatKeyConvRequest {
    /**
     * 会话id
     */
    conversationId?: string;
    /**
     * 语言
     */
    language?: 'Auto' | 'Chinese' | 'English';
    /**
     * 消息的格式
     */
    messages?: {
        /**
         * 内容信息，包含markdown格式
         */
        content: string;
        /**
         * 内容的类型，整体上分为三类：文本，快捷操作，阅读全文,摘要及可能问到的问题,带有来源的信息
         */
        contentType:
            | 'text'
            | 'intent'
            | 'read_article'
            | 'reply_summary'
            | 'reply_source'
            | 'welcome'
            | 'read_doc'
            | 'doc_link'
            | 'reply_doc_source'
            | 'template_params'
            | 'template_post'
            | 'template_text'
            | 'virtual_root';
        /**
         * 会话的唯一标识
         */
        conversationId?: string;
        /**
         * 创建时间
         */
        createTime?: string;
        /**
         * 文档id
         */
        docId?: string;
        /**
         * 快捷操作的id，即选中文本的id,一个快捷操作有相同id，当contentType为快捷操作时才会有值
         */
        intentId?: string;
        /**
         * message的唯一标识，前端产生的由前端产生，可以使用uuid,保证会话唯一
         */
        messageId?: string;
        /**
         * 父的messageId
         */
        parentMessageId?: string;
        /**
         * 角色信息
         */
        role?: 'assistant' | 'system' | 'user';
        /**
         * 任务id
         */
        taskId?: string;
        /**
         * message的类型,即文本或者图文
         */
        type: 'text';
    }[];
    /**
     * model
     */
    model?: 'GPT_3_5' | 'GPT_3_5_16K' | 'GPT_3_5_4K' | 'GPT_4';
    /**
     * 父的消息id,这里在再次回答的时候才有值
     */
    parentMessageId?: string;
    /**
     * 文章标题
     */
    title?: string;
    /**
     * web url
     */
    webUrl?: string;
    /**
     * key
     */
    key: string;
}

/**
 * 接口 [输入消息↗](/interface/api/63954) 的 **返回类型**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/conv`
 * @更新时间 `2023-12-05 15:26:00`
 */
export interface PostBotChatKeyConvResponse {
    timeout?: number;
}

/**
 * 接口 [输入消息↗](/interface/api/63954) 的 **请求配置的类型**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/conv`
 * @更新时间 `2023-12-05 15:26:00`
 */
type PostBotChatKeyConvRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/chat/{key}/conv', 'data', 'key', string, false>
>;

/**
 * 接口 [输入消息↗](/interface/api/63954) 的 **请求配置**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/conv`
 * @更新时间 `2023-12-05 15:26:00`
 */
const postBotChatKeyConvRequestConfig: PostBotChatKeyConvRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_1_0,
    devUrl: devUrl_3_0_1_0,
    prodUrl: prodUrl_3_0_1_0,
    path: '/bot/chat/{key}/conv',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_1_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotChatKeyConv',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [输入消息↗](/interface/api/63954) 的 **请求函数**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/conv`
 * @更新时间 `2023-12-05 15:26:00`
 */
export const postBotChatKeyConv = /*#__PURE__*/ (
    requestData: PostBotChatKeyConvRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotChatKeyConvResponse>(prepare(postBotChatKeyConvRequestConfig, requestData), ...args);
};

postBotChatKeyConv.requestConfig = postBotChatKeyConvRequestConfig;

/**
 * 接口 [校验输入是否超出↗](/interface/api/64026) 的 **请求类型**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/check/text`
 * @更新时间 `2023-09-18 12:35:35`
 */
export interface PostBotChatKeyCheckTextRequest {
    /**
     * 输入的内容信息
     */
    text?: string;
    key: string;
}

/**
 * 接口 [校验输入是否超出↗](/interface/api/64026) 的 **返回类型**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/check/text`
 * @更新时间 `2023-09-18 12:35:35`
 */
export interface PostBotChatKeyCheckTextResponse {
    /**
     * 是否超出限制
     */
    exceed: boolean;
}

/**
 * 接口 [校验输入是否超出↗](/interface/api/64026) 的 **请求配置的类型**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/check/text`
 * @更新时间 `2023-09-18 12:35:35`
 */
type PostBotChatKeyCheckTextRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/chat/{key}/check/text', 'data', 'key', string, false>
>;

/**
 * 接口 [校验输入是否超出↗](/interface/api/64026) 的 **请求配置**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/check/text`
 * @更新时间 `2023-09-18 12:35:35`
 */
const postBotChatKeyCheckTextRequestConfig: PostBotChatKeyCheckTextRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_1_0,
    devUrl: devUrl_3_0_1_0,
    prodUrl: prodUrl_3_0_1_0,
    path: '/bot/chat/{key}/check/text',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_1_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotChatKeyCheckText',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [校验输入是否超出↗](/interface/api/64026) 的 **请求函数**
 *
 * @分类 [聊天机器人管理相关接口↗](/interface/api/cat_11059)
 * @标签 `v1.2.0`, `聊天机器人管理相关接口`
 * @请求头 `POST /bot/chat/{key}/check/text`
 * @更新时间 `2023-09-18 12:35:35`
 */
export const postBotChatKeyCheckText = /*#__PURE__*/ (
    requestData: PostBotChatKeyCheckTextRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotChatKeyCheckTextResponse>(
        prepare(postBotChatKeyCheckTextRequestConfig, requestData),
        ...args
    );
};

postBotChatKeyCheckText.requestConfig = postBotChatKeyCheckTextRequestConfig;

const mockUrl_3_0_2_0 = 'https://yapi.mlamp.cn/mock/858' as any;
const devUrl_3_0_2_0 = '' as any;
const prodUrl_3_0_2_0 = '' as any;
const dataKey_3_0_2_0 = 'data' as any;

/**
 * 接口 [获取历史会话记录↗](/interface/api/64332) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/list`
 * @更新时间 `2023-09-08 14:28:10`
 */
export interface GetBotConvKeyListRequest {
    /**
     * currentId
     */
    currentId?: string;
    /**
     * docId
     */
    docId?: string;
    /**
     * 标题检索的关键词
     */
    keyword?: string;
    /**
     * 页码
     */
    pageNo: string;
    /**
     * 每页的数量
     */
    pageSize: string;
    /**
     * 机器人唯一标识
     */
    key: string;
}

/**
 * 接口 [获取历史会话记录↗](/interface/api/64332) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/list`
 * @更新时间 `2023-09-08 14:28:10`
 */
export interface GetBotConvKeyListResponse {
    /**
     * 额外的总数
     */
    otherTotal?: number;
    /**
     * 当前页码
     */
    pageNo?: number;
    /**
     * 页面的详细内容
     */
    records?: {
        /**
         * 会话的唯一标识
         */
        conversationId: string;
        /**
         * 会话的类型
         */
        conversationType: 'CHAT_INDEX' | 'COMMON' | 'DOC';
        /**
         * 创建者的id
         */
        createId: string;
        /**
         * 创建时间
         */
        createTime: string;
        /**
         * 会话描述，指的是最后一个回复
         */
        description: string;
        /**
         * 文件id
         */
        docId?: string;
        /**
         * 文件类型
         */
        docType?: string;
        /**
         * 与现在的时间的间隔
         */
        intervalMinute: string;
        /**
         * 会话消息的最近修改时间
         */
        lastMessageTime: string;
        /**
         * 会话使用的模型
         */
        model: string;
        /**
         * 文件名字
         */
        name?: string;
        /**
         * 标题
         */
        title: string;
        /**
         * 更新时间
         */
        updateTime: string;
        /**
         * 来源的网页的url
         */
        webUrl?: string;
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
 * 接口 [获取历史会话记录↗](/interface/api/64332) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/list`
 * @更新时间 `2023-09-08 14:28:10`
 */
type GetBotConvKeyListRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/bot/conv/{key}/list',
        'data',
        'key',
        'currentId' | 'docId' | 'keyword' | 'pageNo' | 'pageSize',
        false
    >
>;

/**
 * 接口 [获取历史会话记录↗](/interface/api/64332) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/list`
 * @更新时间 `2023-09-08 14:28:10`
 */
const getBotConvKeyListRequestConfig: GetBotConvKeyListRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/{key}/list',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: ['currentId', 'docId', 'keyword', 'pageNo', 'pageSize'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getBotConvKeyList',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取历史会话记录↗](/interface/api/64332) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/list`
 * @更新时间 `2023-09-08 14:28:10`
 */
export const getBotConvKeyList = /*#__PURE__*/ (
    requestData: GetBotConvKeyListRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetBotConvKeyListResponse>(prepare(getBotConvKeyListRequestConfig, requestData), ...args);
};

getBotConvKeyList.requestConfig = getBotConvKeyListRequestConfig;

/**
 * 接口 [会话的反馈信息↗](/interface/api/64350) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/feedback`
 * @更新时间 `2023-09-08 14:29:09`
 */
export interface PostBotConvKeyFeedbackRequest {
    /**
     * 会话id
     */
    conversationId?: string;
    /**
     * true-赞, false-踩
     */
    like?: boolean;
    /**
     * 消息id
     */
    messageId?: string;
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [会话的反馈信息↗](/interface/api/64350) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/feedback`
 * @更新时间 `2023-09-08 14:29:09`
 */
export type PostBotConvKeyFeedbackResponse = any;

/**
 * 接口 [会话的反馈信息↗](/interface/api/64350) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/feedback`
 * @更新时间 `2023-09-08 14:29:09`
 */
type PostBotConvKeyFeedbackRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/conv/{key}/feedback', 'data', 'key', string, false>
>;

/**
 * 接口 [会话的反馈信息↗](/interface/api/64350) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/feedback`
 * @更新时间 `2023-09-08 14:29:09`
 */
const postBotConvKeyFeedbackRequestConfig: PostBotConvKeyFeedbackRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/{key}/feedback',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.raw,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotConvKeyFeedback',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [会话的反馈信息↗](/interface/api/64350) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/feedback`
 * @更新时间 `2023-09-08 14:29:09`
 */
export const postBotConvKeyFeedback = /*#__PURE__*/ (
    requestData: PostBotConvKeyFeedbackRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotConvKeyFeedbackResponse>(prepare(postBotConvKeyFeedbackRequestConfig, requestData), ...args);
};

postBotConvKeyFeedback.requestConfig = postBotConvKeyFeedbackRequestConfig;

/**
 * 接口 [获取会话chat的消息信息↗](/interface/api/64359) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}`
 * @更新时间 `2023-12-05 15:27:02`
 */
export interface GetBotConvKeyRequest {
    /**
     * all
     */
    all?: string;
    /**
     * 会话id
     */
    convId: string;
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [获取会话chat的消息信息↗](/interface/api/64359) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}`
 * @更新时间 `2023-12-05 15:27:02`
 */
export interface GetBotConvKeyResponse {
    /**
     * 会话的唯一标识
     */
    conversationId: string;
    /**
     * 会话的类型
     */
    conversationType: 'CHAT_INDEX' | 'COMMON' | 'DOC';
    /**
     * 创建者的id
     */
    createId: string;
    /**
     * 创建时间
     */
    createTime: string;
    /**
     * 会话描述，指的是最后一个回复
     */
    description: string;
    /**
     * 文件id
     */
    docId?: string;
    /**
     * 文件类型
     */
    docType?: string;
    /**
     * 与现在的时间的间隔
     */
    intervalMinute: string;
    /**
     * 会话消息的最近修改时间
     */
    lastMessageTime: string;
    /**
     * 全量的消息列表，按照创建时间倒序排列,从第一个父级查询
     */
    messages: {
        /**
         * 内容信息，包含markdown格式
         */
        content?: string;
        /**
         * 内容的类型，整体上分为三类：文本，快捷操作，阅读全文,摘要及可能问到的问题,带有来源的信息
         */
        contentType?:
            | 'text'
            | 'intent'
            | 'read_article'
            | 'reply_summary'
            | 'reply_source'
            | 'welcome'
            | 'read_doc'
            | 'doc_link:'
            | 'reply_doc_source'
            | 'template_params'
            | 'template_post'
            | 'template_text'
            | 'input'
            | 'virtual_root'
            | 'reply_input';
        /**
         * 会话的唯一标识
         */
        conversationId?: string;
        /**
         * 创建者id
         */
        createId?: number;
        /**
         * 创建时间
         */
        createTime?: string;
        errorStatus?: number;
        /**
         * 快捷操作的id,一个快捷操作有相同id，当contentType为快捷操作时才会有值
         */
        intentId?: string;
        /**
         * 是否展示
         */
        isShow?: boolean;
        /**
         * 反馈信息，当值为空时未设置，值的含义是赞或者踩或没有设置
         */
        like?: 'dislike' | 'like' | 'unknown';
        /**
         * message的唯一标识
         */
        messageId?: string;
        /**
         * 父的messageId
         */
        parentMessageId?: string;
        /**
         * 来源信息
         */
        reference?: {
            /**
             * 来源的信息
             */
            text?: string;
            /**
             * 编码
             */
            key?: string;
            /**
             * 来源的网站
             */
            link?: string;
            /**
             * 网站的标题
             */
            title?: string;
        }[];
        /**
         * 角色信息
         */
        role?: 'assistant' | 'system' | 'user';
        /**
         * 状态是否成功
         */
        status?: string;
        /**
         * 可能提到的问题列表，当contentType为摘要及可能问到的问题才会有值，并且这里是感兴趣的问题列表
         */
        suggest?: {
            /**
             * 问题
             */
            text?: string;
            /**
             * 序号
             */
            key?: string;
        }[];
        /**
         * 消息标题，包含markdown格式
         */
        title?: string;
        /**
         * message的类型,即文本或者图文
         */
        type?: 'text';
        /**
         * 来源机器人的唯一标识
         */
        source?: string;
    }[];
    /**
     * 会话使用的模型
     */
    model: string;
    /**
     * 文件名字
     */
    name?: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 更新时间
     */
    updateTime: string;
    /**
     * 来源的网页的url
     */
    webUrl?: string;
}

/**
 * 接口 [获取会话chat的消息信息↗](/interface/api/64359) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}`
 * @更新时间 `2023-12-05 15:27:02`
 */
type GetBotConvKeyRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/conv/{key}', 'data', 'key', 'all' | 'convId', false>
>;

/**
 * 接口 [获取会话chat的消息信息↗](/interface/api/64359) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}`
 * @更新时间 `2023-12-05 15:27:02`
 */
const getBotConvKeyRequestConfig: GetBotConvKeyRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/{key}',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: ['all', 'convId'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getBotConvKey',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取会话chat的消息信息↗](/interface/api/64359) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}`
 * @更新时间 `2023-12-05 15:27:02`
 */
export const getBotConvKey = /*#__PURE__*/ (requestData: GetBotConvKeyRequest, ...args: UserRequestRestArgs) => {
    return request<GetBotConvKeyResponse>(prepare(getBotConvKeyRequestConfig, requestData), ...args);
};

getBotConvKey.requestConfig = getBotConvKeyRequestConfig;

/**
 * 接口 [删除会话↗](/interface/api/64368) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `DELETE /bot/conv/{key}/{convId}`
 * @更新时间 `2023-09-08 14:29:09`
 */
export interface DeleteBotConvKeyConvIdRequest {
    /**
     * 会话id
     */
    convId: string;
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [删除会话↗](/interface/api/64368) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `DELETE /bot/conv/{key}/{convId}`
 * @更新时间 `2023-09-08 14:29:09`
 */
export type DeleteBotConvKeyConvIdResponse = boolean;

/**
 * 接口 [删除会话↗](/interface/api/64368) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `DELETE /bot/conv/{key}/{convId}`
 * @更新时间 `2023-09-08 14:29:09`
 */
type DeleteBotConvKeyConvIdRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/bot/conv/{key}/{convId}',
        'data',
        'convId' | 'key',
        string,
        false
    >
>;

/**
 * 接口 [删除会话↗](/interface/api/64368) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `DELETE /bot/conv/{key}/{convId}`
 * @更新时间 `2023-09-08 14:29:09`
 */
const deleteBotConvKeyConvIdRequestConfig: DeleteBotConvKeyConvIdRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/{key}/{convId}',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.raw,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['convId', 'key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deleteBotConvKeyConvId',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [删除会话↗](/interface/api/64368) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `DELETE /bot/conv/{key}/{convId}`
 * @更新时间 `2023-09-08 14:29:09`
 */
export const deleteBotConvKeyConvId = /*#__PURE__*/ (
    requestData: DeleteBotConvKeyConvIdRequest,
    ...args: UserRequestRestArgs
) => {
    return request<DeleteBotConvKeyConvIdResponse>(prepare(deleteBotConvKeyConvIdRequestConfig, requestData), ...args);
};

deleteBotConvKeyConvId.requestConfig = deleteBotConvKeyConvIdRequestConfig;

/**
 * 接口 [获取某一个会话的消息↗](/interface/api/64377) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/{convId}/msg/{msgId}`
 * @更新时间 `2023-11-09 15:56:26`
 */
export interface GetBotConvKeyConvIdMsgMsgIdRequest {
    /**
     * convId
     */
    convId: string;
    /**
     * 机器人的唯一标识
     */
    key: string;
    /**
     * msgId
     */
    msgId: string;
}

/**
 * 接口 [获取某一个会话的消息↗](/interface/api/64377) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/{convId}/msg/{msgId}`
 * @更新时间 `2023-11-09 15:56:26`
 */
export interface GetBotConvKeyConvIdMsgMsgIdResponse {
    /**
     * 内容信息，对于特殊的contenttype 展示的事不一样的json 字符串
     */
    content?: string;
    /**
     * 内容的类型，整体上分为三类：文本，快捷操作，阅读全文,摘要及可能问到的问题,带有来源的信息
     */
    contentType?:
        | 'text'
        | 'intent'
        | 'read_article'
        | 'reply_summary'
        | 'reply_source'
        | 'welcome'
        | 'read_doc'
        | 'doc_link'
        | 'reply_doc_source'
        | 'template_params'
        | 'template_post'
        | 'template_text';
    /**
     * 会话的唯一标识
     */
    conversationId?: string;
    /**
     * 创建者id
     */
    createId?: number;
    /**
     * 创建时间
     */
    createTime?: string;
    errorStatus?: number;
    /**
     * 快捷操作的id,一个快捷操作有相同id，当contentType为快捷操作时才会有值
     */
    intentId?: string;
    /**
     * 是否展示
     */
    isShow?: boolean;
    /**
     * 反馈信息，当值为空时未设置，值的含义是赞或者踩或没有设置
     */
    like?: 'dislike' | 'like';
    /**
     * message的唯一标识
     */
    messageId?: string;
    /**
     * 父的messageId
     */
    parentMessageId?: string;
    /**
     * 来源信息
     */
    reference?: {
        /**
         * 输入的内容信息
         */
        text?: string;
        key?: string;
        link?: string;
        title?: string;
    }[];
    /**
     * 角色信息
     */
    role?: 'assistant' | 'system' | 'user';
    /**
     * 状态是否成功
     */
    status?: string;
    /**
     * 可能提到的问题列表，当contentType为摘要及可能问到的问题才会有值，并且这里是感兴趣的问题列表
     */
    suggest?: {
        /**
         * 输入的内容信息
         */
        text?: string;
        key?: string;
    }[];
    /**
     * 消息标题，包含markdown格式
     */
    title?: string;
    /**
     * message的类型,即文本或者图文
     */
    type?: 'text';
}

/**
 * 接口 [获取某一个会话的消息↗](/interface/api/64377) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/{convId}/msg/{msgId}`
 * @更新时间 `2023-11-09 15:56:26`
 */
type GetBotConvKeyConvIdMsgMsgIdRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/bot/conv/{key}/{convId}/msg/{msgId}',
        'data',
        'convId' | 'key' | 'msgId',
        string,
        false
    >
>;

/**
 * 接口 [获取某一个会话的消息↗](/interface/api/64377) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/{convId}/msg/{msgId}`
 * @更新时间 `2023-11-09 15:56:26`
 */
const getBotConvKeyConvIdMsgMsgIdRequestConfig: GetBotConvKeyConvIdMsgMsgIdRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/{key}/{convId}/msg/{msgId}',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['convId', 'key', 'msgId'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getBotConvKeyConvIdMsgMsgId',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取某一个会话的消息↗](/interface/api/64377) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/{key}/{convId}/msg/{msgId}`
 * @更新时间 `2023-11-09 15:56:26`
 */
export const getBotConvKeyConvIdMsgMsgId = /*#__PURE__*/ (
    requestData: GetBotConvKeyConvIdMsgMsgIdRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetBotConvKeyConvIdMsgMsgIdResponse>(
        prepare(getBotConvKeyConvIdMsgMsgIdRequestConfig, requestData),
        ...args
    );
};

getBotConvKeyConvIdMsgMsgId.requestConfig = getBotConvKeyConvIdMsgMsgIdRequestConfig;

/**
 * 接口 [修改会话标题↗](/interface/api/64386) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/info`
 * @更新时间 `2023-09-08 14:29:09`
 */
export interface PostBotConvKeyInfoRequest {
    /**
     * 会话id
     */
    conversationId: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [修改会话标题↗](/interface/api/64386) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/info`
 * @更新时间 `2023-09-08 14:29:09`
 */
export interface PostBotConvKeyInfoResponse {
    /**
     * 会话的唯一标识
     */
    conversationId: string;
    /**
     * 会话的类型
     */
    conversationType: 'CHAT_INDEX' | 'COMMON' | 'DOC';
    /**
     * 创建者的id
     */
    createId: string;
    /**
     * 创建时间
     */
    createTime: string;
    /**
     * 会话描述，指的是最后一个回复
     */
    description: string;
    /**
     * 文件id
     */
    docId?: string;
    /**
     * 文件类型
     */
    docType?: string;
    /**
     * 与现在的时间的间隔
     */
    intervalMinute: string;
    /**
     * 会话消息的最近修改时间
     */
    lastMessageTime: string;
    /**
     * 会话使用的模型
     */
    model: string;
    /**
     * 文件名字
     */
    name?: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 更新时间
     */
    updateTime: string;
    /**
     * 来源的网页的url
     */
    webUrl?: string;
}

/**
 * 接口 [修改会话标题↗](/interface/api/64386) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/info`
 * @更新时间 `2023-09-08 14:29:09`
 */
type PostBotConvKeyInfoRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/conv/{key}/info', 'data', 'key', string, false>
>;

/**
 * 接口 [修改会话标题↗](/interface/api/64386) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/info`
 * @更新时间 `2023-09-08 14:29:09`
 */
const postBotConvKeyInfoRequestConfig: PostBotConvKeyInfoRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/{key}/info',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotConvKeyInfo',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [修改会话标题↗](/interface/api/64386) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.2.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/info`
 * @更新时间 `2023-09-08 14:29:09`
 */
export const postBotConvKeyInfo = /*#__PURE__*/ (
    requestData: PostBotConvKeyInfoRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotConvKeyInfoResponse>(prepare(postBotConvKeyInfoRequestConfig, requestData), ...args);
};

postBotConvKeyInfo.requestConfig = postBotConvKeyInfoRequestConfig;

/**
 * 接口 [非流式输入消息↗](/interface/api/65877) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:28:15`
 */
export interface PostBotConvKeyMsgRequest {
    /**
     * 会话id
     */
    conversationId?: string;
    /**
     * 语言
     */
    language?: string;
    /**
     * 消息的格式
     */
    messages?: {
        /**
         * 内容信息，包含markdown格式
         */
        content: string;
        /**
         * 内容的类型，整体上分为三类：文本，快捷操作，阅读全文,摘要及可能问到的问题,带有来源的信息
         */
        contentType:
            | 'text'
            | 'intent'
            | 'read_article'
            | 'reply_summary'
            | 'reply_source'
            | 'welcome'
            | 'read_doc'
            | 'doc_link'
            | 'reply_doc_source'
            | 'template_params'
            | 'template_text'
            | 'template_post'
            | 'input'
            | 'reply_input'
            | 'web_search'
            | 'virtual_root';
        /**
         * 会话的唯一标识
         */
        conversationId?: string;
        /**
         * 创建时间
         */
        createTime?: string;
        /**
         * 文档id
         */
        docId?: string;
        /**
         * 快捷操作的id，即选中文本的id,一个快捷操作有相同id，当contentType为快捷操作时才会有值
         */
        intentId?: string;
        /**
         * message的唯一标识，前端产生的由前端产生，可以使用uuid,保证会话唯一
         */
        messageId?: string;
        /**
         * 父的messageId
         */
        parentMessageId?: string;
        /**
         * 角色信息
         */
        role?: 'assistant' | 'system' | 'user';
        /**
         * 输入的时间戳
         */
        sort: string;
        /**
         * 任务id
         */
        taskId?: string;
        /**
         * message的类型,即文本或者图文
         */
        type: 'text';
    }[];
    /**
     * 文章标题
     */
    title?: string;
    /**
     * web url
     */
    webUrl?: string;
    /**
     * 使用联网检索
     */
    webSearch?: 'NONE' | 'FORCE' | 'SMART';
    /**
     * 需要重新更新回答的messageId，并覆盖该回复message
     */
    messageId?: string;
    /**
     * key
     */
    key: string;
}

/**
 * 接口 [非流式输入消息↗](/interface/api/65877) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:28:15`
 */
export interface PostBotConvKeyMsgResponse {
    /**
     * 内容信息，对于特殊的contentType 结果是json字符串
     */
    content?: string;
    /**
     * 内容的类型，整体上分为三类：文本，快捷操作，阅读全文,摘要及可能问到的问题,带有来源的信息
     */
    contentType?: 'text';
    /**
     * 会话的唯一标识
     */
    conversationId?: string;
    /**
     * 创建者id
     */
    createId?: number;
    /**
     * 创建时间
     */
    createTime?: string;
    errorStatus?: number;
    /**
     * 快捷操作的id,一个快捷操作有相同id，当contentType为快捷操作时才会有值
     */
    intentId?: string;
    /**
     * 是否展示
     */
    isShow?: boolean;
    /**
     * 反馈信息，当值为空时未设置，值的含义是赞或者踩或没有设置
     */
    like?: 'dislike' | 'like';
    /**
     * message的唯一标识
     */
    messageId?: string;
    /**
     * 父的messageId
     */
    parentMessageId?: string;
    /**
     * 来源信息
     */
    reference?: {
        text: string;
        /**
         * 序号
         */
        key: string;
        /**
         * 网页链接
         */
        link?: string;
        /**
         * pdf 的页面位置
         */
        position?: string;
        /**
         * 网页标题
         */
        title?: string;
    }[];
    /**
     * 角色信息
     */
    role?: 'assistant' | 'system' | 'user';
    /**
     * 输入的时间戳
     */
    sort: string;
    source?: string;
    /**
     * 状态是否成功
     */
    status?: string;
    /**
     * 可能提到的问题列表，当contentType为摘要及可能问到的问题才会有值，并且这里是感兴趣的问题列表
     */
    suggest?: {
        /**
         * 可能遇见的问题
         */
        text: string;
        /**
         * 序号
         */
        key: string;
    }[];
    /**
     * 消息标题
     */
    title?: string;
    /**
     * message的类型,即文本或者图文
     */
    type?: 'text';
}

/**
 * 接口 [非流式输入消息↗](/interface/api/65877) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:28:15`
 */
type PostBotConvKeyMsgRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/conv/{key}/msg', 'data', 'key', string, false>
>;

/**
 * 接口 [非流式输入消息↗](/interface/api/65877) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:28:15`
 */
const postBotConvKeyMsgRequestConfig: PostBotConvKeyMsgRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/{key}/msg',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotConvKeyMsg',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [非流式输入消息↗](/interface/api/65877) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:28:15`
 */
export const postBotConvKeyMsg = /*#__PURE__*/ (
    requestData: PostBotConvKeyMsgRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotConvKeyMsgResponse>(prepare(postBotConvKeyMsgRequestConfig, requestData), ...args);
};

postBotConvKeyMsg.requestConfig = postBotConvKeyMsgRequestConfig;

/**
 * 接口 [获取上传的地址等其他信息↗](/interface/api/65884) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/upload/config`
 * @更新时间 `2023-11-02 18:43:12`
 */
export interface GetBotConvUploadConfigRequest {
    /**
     * md5
     */
    md5: string;
    /**
     * size
     */
    size: string;
    /**
     * suffix
     */
    suffix: string;
    /**
     * 文件类型
     */
    type: string;
    /**
     * 文件名
     */
    fileName: string;
}

/**
 * 接口 [获取上传的地址等其他信息↗](/interface/api/65884) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/upload/config`
 * @更新时间 `2023-11-02 18:43:12`
 */
export interface GetBotConvUploadConfigResponse {
    /**
     * 对象存储id
     */
    objId: string;
    /**
     * 对象大小，单位是B
     */
    size: number;
    /**
     * 文件后缀
     */
    suffix: string;
    /**
     * 类型
     */
    type: 'image' | 'video';
    /**
     * 上传地址
     */
    uploadUrl: string;
    /**
     * 下载地址
     */
    downloadUrl: string;
    /**
     * 桶名
     */
    bucketName: string;
    /**
     * 文件名
     */
    fileName: string;
}

/**
 * 接口 [获取上传的地址等其他信息↗](/interface/api/65884) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/upload/config`
 * @更新时间 `2023-11-02 18:43:12`
 */
type GetBotConvUploadConfigRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/bot/conv/upload/config',
        'data',
        string,
        'md5' | 'size' | 'suffix' | 'type' | 'fileName',
        false
    >
>;

/**
 * 接口 [获取上传的地址等其他信息↗](/interface/api/65884) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/upload/config`
 * @更新时间 `2023-11-02 18:43:12`
 */
const getBotConvUploadConfigRequestConfig: GetBotConvUploadConfigRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/upload/config',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: [],
    queryNames: ['md5', 'size', 'suffix', 'type', 'fileName'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getBotConvUploadConfig',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取上传的地址等其他信息↗](/interface/api/65884) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `GET /bot/conv/upload/config`
 * @更新时间 `2023-11-02 18:43:12`
 */
export const getBotConvUploadConfig = /*#__PURE__*/ (
    requestData: GetBotConvUploadConfigRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetBotConvUploadConfigResponse>(prepare(getBotConvUploadConfigRequestConfig, requestData), ...args);
};

getBotConvUploadConfig.requestConfig = getBotConvUploadConfigRequestConfig;

/**
 * 接口 [流式输入消息↗](/interface/api/65891) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/stream/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:27:43`
 */
export interface PostBotStreamConvKeyMsgRequest {
    /**
     * 会话id
     */
    conversationId?: string;
    /**
     * 语言
     */
    language?: string;
    /**
     * 消息的格式
     */
    messages?: {
        /**
         * 内容信息，包含markdown格式
         */
        content: string;
        /**
         * 内容的类型，整体上分为三类：文本，快捷操作，阅读全文,摘要及可能问到的问题,带有来源的信息
         */
        contentType:
            | 'text'
            | 'intent'
            | 'read_article'
            | 'reply_summary'
            | 'reply_source'
            | 'welcome'
            | 'read_doc'
            | 'doc_link'
            | 'reply_doc_source'
            | 'template_params'
            | 'template_text'
            | 'template_post'
            | 'input'
            | 'reply_input'
            | 'web_search'
            | 'virtual_root';
        /**
         * 会话的唯一标识
         */
        conversationId?: string;
        /**
         * 文档id
         */
        docId?: string;
        /**
         * 快捷操作的id，即选中文本的id,一个快捷操作有相同id，当contentType为快捷操作时才会有值
         */
        intentId?: string;
        /**
         * message的唯一标识，前端产生的由前端产生，可以使用uuid,保证会话唯一
         */
        messageId?: string;
        /**
         * 父的messageId
         */
        parentMessageId?: string;
        /**
         * 角色信息
         */
        role?: 'assistant' | 'system' | 'user';
        /**
         * 任务id
         */
        taskId?: string;
    }[];
    /**
     * model
     */
    model?: string;
    /**
     * 文章标题
     */
    title?: string;
    /**
     * web url
     */
    webUrl?: string;
    /**
     * 是否开启联网搜索
     */
    webSearch: 'NONE' | 'FORCE' | 'SMART';
    /**
     * 重新执行并覆盖原来的message
     */
    messageId?: string;
    /**
     * key
     */
    key: string;
}

/**
 * 接口 [流式输入消息↗](/interface/api/65891) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/stream/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:27:43`
 */
export interface PostBotStreamConvKeyMsgResponse {
    timeout?: number;
}

/**
 * 接口 [流式输入消息↗](/interface/api/65891) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/stream/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:27:43`
 */
type PostBotStreamConvKeyMsgRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/stream/conv/{key}/msg', 'data', 'key', string, false>
>;

/**
 * 接口 [流式输入消息↗](/interface/api/65891) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/stream/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:27:43`
 */
const postBotStreamConvKeyMsgRequestConfig: PostBotStreamConvKeyMsgRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/stream/conv/{key}/msg',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotStreamConvKeyMsg',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [流式输入消息↗](/interface/api/65891) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/stream/conv/{key}/msg`
 * @更新时间 `2023-12-05 15:27:43`
 */
export const postBotStreamConvKeyMsg = /*#__PURE__*/ (
    requestData: PostBotStreamConvKeyMsgRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotStreamConvKeyMsgResponse>(
        prepare(postBotStreamConvKeyMsgRequestConfig, requestData),
        ...args
    );
};

postBotStreamConvKeyMsg.requestConfig = postBotStreamConvKeyMsgRequestConfig;

/**
 * 接口 [终止响应↗](/interface/api/65898) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/stop`
 * @更新时间 `2023-11-11 14:54:04`
 */
export interface PostBotConvKeyStopRequest {
    content?: string;
    contentType?: string;
    conversationId?: string;
    createId?: number;
    createTime?: string;
    errorStatus?: number;
    intentId?: string;
    isShow?: boolean;
    like?: string;
    messageId?: string;
    parentMessageId?: string;
    reference?: {
        /**
         * 回答
         */
        text: string;
        /**
         * 编号
         */
        key: string;
        /**
         * 编码的位置
         */
        position?: string;
        /**
         * 网页的链接
         */
        link?: string;
        /**
         * 网页的标题
         */
        title?: string;
    }[];
    role?: string;
    source?: string;
    status?: string;
    suggest?: {
        text: string;
        /**
         * 编号
         */
        key: string;
    }[];
    title?: string;
    type?: string;
    /**
     * 连接的id
     */
    connectId?: string;
    /**
     * 机器人的id
     */
    key: string;
}

/**
 * 接口 [终止响应↗](/interface/api/65898) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/stop`
 * @更新时间 `2023-11-11 14:54:04`
 */
export interface PostBotConvKeyStopResponse {
    /**
     * 内容信息，对于特殊的contentType 结果是json字符串
     */
    content?: string;
    /**
     * 内容的类型，整体上分为三类：文本，快捷操作，阅读全文,摘要及可能问到的问题,带有来源的信息
     */
    contentType?: 'text';
    /**
     * 会话的唯一标识
     */
    conversationId?: string;
    /**
     * 创建者id
     */
    createId?: number;
    /**
     * 创建时间
     */
    createTime?: string;
    errorStatus?: number;
    /**
     * 快捷操作的id,一个快捷操作有相同id，当contentType为快捷操作时才会有值
     */
    intentId?: string;
    /**
     * 是否展示
     */
    isShow?: boolean;
    /**
     * 反馈信息，当值为空时未设置，值的含义是赞或者踩或没有设置
     */
    like?: 'dislike' | 'like';
    /**
     * message的唯一标识
     */
    messageId?: string;
    /**
     * 父的messageId
     */
    parentMessageId?: string;
    /**
     * 来源信息
     */
    reference?: {
        /**
         * 参数信息
         */
        params?: {
            /**
             * 参数的主键
             */
            key?: string;
            /**
             * 参数的值
             */
            value?: string;
        }[];
        /**
         * 输入的内容信息
         */
        text?: string;
    }[];
    /**
     * 角色信息
     */
    role?: 'assistant' | 'system' | 'user';
    /**
     * 输入的时间戳
     */
    sort: string;
    source?: string;
    /**
     * 状态是否成功
     */
    status?: string;
    /**
     * 可能提到的问题列表，当contentType为摘要及可能问到的问题才会有值，并且这里是感兴趣的问题列表
     */
    suggest?: {
        /**
         * 参数信息
         */
        params?: {
            /**
             * 参数的主键
             */
            key?: string;
            /**
             * 参数的值
             */
            value?: string;
        }[];
        /**
         * 输入的内容信息
         */
        text?: string;
    }[];
    /**
     * 消息标题
     */
    title?: string;
    /**
     * message的类型,即文本或者图文
     */
    type?: 'text';
}

/**
 * 接口 [终止响应↗](/interface/api/65898) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/stop`
 * @更新时间 `2023-11-11 14:54:04`
 */
type PostBotConvKeyStopRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/conv/{key}/stop', 'data', 'key', string, false>
>;

/**
 * 接口 [终止响应↗](/interface/api/65898) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/stop`
 * @更新时间 `2023-11-11 14:54:04`
 */
const postBotConvKeyStopRequestConfig: PostBotConvKeyStopRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/{key}/stop',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotConvKeyStop',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [终止响应↗](/interface/api/65898) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`, `机器人会话管理相关接口`
 * @请求头 `POST /bot/conv/{key}/stop`
 * @更新时间 `2023-11-11 14:54:04`
 */
export const postBotConvKeyStop = /*#__PURE__*/ (
    requestData: PostBotConvKeyStopRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotConvKeyStopResponse>(prepare(postBotConvKeyStopRequestConfig, requestData), ...args);
};

postBotConvKeyStop.requestConfig = postBotConvKeyStopRequestConfig;

/**
 * 接口 [删除会话的消息↗](/interface/api/67074) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /bot/conv/msg/{key}`
 * @更新时间 `2023-10-31 16:57:53`
 */
export interface DeleteBotConvMsgKeyRequest {
    /**
     * 会话id
     */
    convId: string;
    /**
     * 消息id
     */
    msgId: string;
    /**
     * 机器人的id
     */
    key: string;
}

/**
 * 接口 [删除会话的消息↗](/interface/api/67074) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /bot/conv/msg/{key}`
 * @更新时间 `2023-10-31 16:57:53`
 */
export type DeleteBotConvMsgKeyResponse = boolean;

/**
 * 接口 [删除会话的消息↗](/interface/api/67074) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /bot/conv/msg/{key}`
 * @更新时间 `2023-10-31 16:57:53`
 */
type DeleteBotConvMsgKeyRequestConfig = Readonly<
    RequestConfig<
        'https://yapi.mlamp.cn/mock/858',
        '',
        '',
        '/bot/conv/msg/{key}',
        'data',
        'key',
        'convId' | 'msgId',
        false
    >
>;

/**
 * 接口 [删除会话的消息↗](/interface/api/67074) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /bot/conv/msg/{key}`
 * @更新时间 `2023-10-31 16:57:53`
 */
const deleteBotConvMsgKeyRequestConfig: DeleteBotConvMsgKeyRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/msg/{key}',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.form,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: ['convId', 'msgId'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deleteBotConvMsgKey',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [删除会话的消息↗](/interface/api/67074) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `DELETE /bot/conv/msg/{key}`
 * @更新时间 `2023-10-31 16:57:53`
 */
export const deleteBotConvMsgKey = /*#__PURE__*/ (
    requestData: DeleteBotConvMsgKeyRequest,
    ...args: UserRequestRestArgs
) => {
    return request<DeleteBotConvMsgKeyResponse>(prepare(deleteBotConvMsgKeyRequestConfig, requestData), ...args);
};

deleteBotConvMsgKey.requestConfig = deleteBotConvMsgKeyRequestConfig;

/**
 * 接口 [校验token 是否超出范围↗](/interface/api/67095) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/{key}/check`
 * @更新时间 `2023-10-31 18:55:21`
 */
export interface PostBotKeyCheckRequest {
    msg: {
        type: 'text' | 'template' | 'video' | 'image';
        /**
         * 输入的信息
         */
        value: string;
    }[];
    /**
     * 机器人的id
     */
    key: string;
}

/**
 * 接口 [校验token 是否超出范围↗](/interface/api/67095) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/{key}/check`
 * @更新时间 `2023-10-31 18:55:21`
 */
export interface PostBotKeyCheckResponse {
    /**
     * 是否超出范围
     */
    exceed: string;
    /**
     * 模型名称
     */
    model?: string;
    /**
     *  token数
     */
    token?: number;
    /**
     * 长度
     */
    length?: number;
}

/**
 * 接口 [校验token 是否超出范围↗](/interface/api/67095) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/{key}/check`
 * @更新时间 `2023-10-31 18:55:21`
 */
type PostBotKeyCheckRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/{key}/check', 'data', 'key', string, false>
>;

/**
 * 接口 [校验token 是否超出范围↗](/interface/api/67095) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/{key}/check`
 * @更新时间 `2023-10-31 18:55:21`
 */
const postBotKeyCheckRequestConfig: PostBotKeyCheckRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/{key}/check',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotKeyCheck',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [校验token 是否超出范围↗](/interface/api/67095) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/{key}/check`
 * @更新时间 `2023-10-31 18:55:21`
 */
export const postBotKeyCheck = /*#__PURE__*/ (requestData: PostBotKeyCheckRequest, ...args: UserRequestRestArgs) => {
    return request<PostBotKeyCheckResponse>(prepare(postBotKeyCheckRequestConfig, requestData), ...args);
};

postBotKeyCheck.requestConfig = postBotKeyCheckRequestConfig;

/**
 * 接口 [判断上传的文件是否存在↗](/interface/api/67319) 的 **请求类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/conv/upload/exists`
 * @更新时间 `2023-11-08 17:17:02`
 */
export interface PostBotConvUploadExistsRequest {
    /**
     * 对象的id
     */
    objId: string;
    /**
     * 桶的名字
     */
    bucketName: string;
}

/**
 * 接口 [判断上传的文件是否存在↗](/interface/api/67319) 的 **返回类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/conv/upload/exists`
 * @更新时间 `2023-11-08 17:17:02`
 */
export type PostBotConvUploadExistsResponse = boolean;

/**
 * 接口 [判断上传的文件是否存在↗](/interface/api/67319) 的 **请求配置的类型**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/conv/upload/exists`
 * @更新时间 `2023-11-08 17:17:02`
 */
type PostBotConvUploadExistsRequestConfig = Readonly<
    RequestConfig<'https://yapi.mlamp.cn/mock/858', '', '', '/bot/conv/upload/exists', 'data', string, string, false>
>;

/**
 * 接口 [判断上传的文件是否存在↗](/interface/api/67319) 的 **请求配置**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/conv/upload/exists`
 * @更新时间 `2023-11-08 17:17:02`
 */
const postBotConvUploadExistsRequestConfig: PostBotConvUploadExistsRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_3_0_2_0,
    devUrl: devUrl_3_0_2_0,
    prodUrl: prodUrl_3_0_2_0,
    path: '/bot/conv/upload/exists',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_3_0_2_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotConvUploadExists',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [判断上传的文件是否存在↗](/interface/api/67319) 的 **请求函数**
 *
 * @分类 [机器人会话管理相关接口↗](/interface/api/cat_11081)
 * @标签 `v1.3.0`
 * @请求头 `POST /bot/conv/upload/exists`
 * @更新时间 `2023-11-08 17:17:02`
 */
export const postBotConvUploadExists = /*#__PURE__*/ (
    requestData: PostBotConvUploadExistsRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotConvUploadExistsResponse>(
        prepare(postBotConvUploadExistsRequestConfig, requestData),
        ...args
    );
};

postBotConvUploadExists.requestConfig = postBotConvUploadExistsRequestConfig;

/* prettier-ignore-end */
