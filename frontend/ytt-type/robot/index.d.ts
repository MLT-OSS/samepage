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

const mockUrl_6_0_2_0 = 'mock/858' as any;
const devUrl_6_0_2_0 = '' as any;
const prodUrl_6_0_2_0 = '' as any;
const dataKey_6_0_2_0 = 'data' as any;

/**
 * 接口 [机器人相关↗](/interface/api/64206) 的 **请求类型**
 *
 * @分类 [字典相关接口↗](/interface/api/cat_11069)
 * @标签 `v1.2.0`, `字典相关接口`, `v1.3.5`
 * @请求头 `GET /dict/bot`
 * @更新时间 `2023-12-13 16:32:13`
 */
export interface GetDictBotRequest {}

/**
 * 接口 [机器人相关↗](/interface/api/64206) 的 **返回类型**
 *
 * @分类 [字典相关接口↗](/interface/api/cat_11069)
 * @标签 `v1.2.0`, `字典相关接口`, `v1.3.5`
 * @请求头 `GET /dict/bot`
 * @更新时间 `2023-12-13 16:32:13`
 */
export interface GetDictBotResponse {
    /**
     * 机器人的列表
     */
    bot: {
        /**
         * 机器人分类的唯一标识
         */
        categoryKey: string;
        /**
         * 机器人的描述信息
         */
        desc: string;
        /**
         * 机器人的功能列表
         */
        feature: (
            | 'intent'
            | 'read_article'
            | 'read_doc'
            | 'input_check'
            | 'message:redirect'
            | 'text_input'
            | 'image_input'
            | 'video_input'
            | 'template_input'
            | 'web_search'
            | 'prompt'
            | ''
        )[];
        /**
         * 机器人的id
         */
        key: string;
        /**
         * 机器人的语言设置
         */
        lang?: {
            /**
             * 唯一标识
             */
            key: string;
            /**
             * 中文名字
             */
            name: string;
        }[];
        /**
         * 机器人的系统标识
         */
        name: string;
        /**
         * 是否是系统机器人
         */
        system: boolean;
        /**
         * 机器人的类型
         */
        type: 'chat' | 'draw' | 'stateless_chat' | 'external_bot';
        /**
         * 图标的url
         */
        iconUrl: string;
        /**
         * 侧边图标的url
         */
        sidebarIconUrl: string;
        /**
         * 模板类型的机器人的参数列表
         */
        params?: {
            /**
             * 主键
             */
            key: string;
            /**
             * 名字
             */
            name: string;
            /**
             * 是否必填
             */
            isRequired: boolean;
            /**
             * 自定义 placeholder
             */
            placeholder?: string;
            /**
             * 默认值是2000个
             */
            maxLength: number;
        }[];
        /**
         * 机器人的顺序
         */
        sort: number;
        /**
         * 是否是流式
         */
        isStream: boolean;
        featureConfig?: {
            /**
             * 功能key
             */
            feature: string;
            fileFormat?: string[];
            /**
             * 支持的文件大小
             */
            fileSize?: number;
            /**
             * 跳转的机器人的key
             */
            toBot?: string;
            /**
             * 文件的最大输入个数
             */
            maxNum?: number;
            /**
             * 外部链接的url
             */
            externalLink?: string;
        }[];
    }[];
    /**
     * 用户机器人相关配置版本
     */
    botVersion: string;
    /**
     * 分类的列表
     */
    category: {
        /**
         * 子分类列表
         */
        children: string[];
        /**
         * 一级分类的主键
         */
        key: string;
        /**
         * 一级分类的名字
         */
        name: string;
    }[];
    /**
     * 浮动菜单
     */
    floatMenu?: 'immersive_translation'[];
    remain?: {
        /**
         * 功能网页的中文名
         */
        menu: string[];
        /**
         * 剩余的机器人分类统计
         */
        remainBot: {
            /**
             * 分类的key
             */
            key: string;
            /**
             * 分类的名字
             */
            name: string;
            /**
             * 分类下的剩余机器人
             */
            remainBot: number;
        }[];
    };
}

/**
 * 接口 [机器人相关↗](/interface/api/64206) 的 **请求配置的类型**
 *
 * @分类 [字典相关接口↗](/interface/api/cat_11069)
 * @标签 `v1.2.0`, `字典相关接口`, `v1.3.5`
 * @请求头 `GET /dict/bot`
 * @更新时间 `2023-12-13 16:32:13`
 */
type GetDictBotRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/dict/bot', 'data', string, string, true>
>;

/**
 * 接口 [机器人相关↗](/interface/api/64206) 的 **请求配置**
 *
 * @分类 [字典相关接口↗](/interface/api/cat_11069)
 * @标签 `v1.2.0`, `字典相关接口`, `v1.3.5`
 * @请求头 `GET /dict/bot`
 * @更新时间 `2023-12-13 16:32:13`
 */
const getDictBotRequestConfig: GetDictBotRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_2_0,
    devUrl: devUrl_6_0_2_0,
    prodUrl: prodUrl_6_0_2_0,
    path: '/dict/bot',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_2_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getDictBot',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [机器人相关↗](/interface/api/64206) 的 **请求函数**
 *
 * @分类 [字典相关接口↗](/interface/api/cat_11069)
 * @标签 `v1.2.0`, `字典相关接口`, `v1.3.5`
 * @请求头 `GET /dict/bot`
 * @更新时间 `2023-12-13 16:32:13`
 */
export const getDictBot = /*#__PURE__*/ (requestData?: GetDictBotRequest, ...args: UserRequestRestArgs) => {
    return request<GetDictBotResponse>(prepare(getDictBotRequestConfig, requestData), ...args);
};

getDictBot.requestConfig = getDictBotRequestConfig;

const mockUrl_6_0_0_0 = 'mock/858' as any;
const devUrl_6_0_0_0 = '' as any;
const prodUrl_6_0_0_0 = '' as any;
const dataKey_6_0_0_0 = 'data' as any;

/**
 * 接口 [获取钉在侧边的机器人列表↗](/interface/api/63801) 的 **请求类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/sidebar`
 * @更新时间 `2023-09-18 14:13:40`
 */
export interface GetBotSidebarRequest {}

/**
 * 接口 [获取钉在侧边的机器人列表↗](/interface/api/63801) 的 **返回类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/sidebar`
 * @更新时间 `2023-09-18 14:13:40`
 */
export type GetBotSidebarResponse = string[];

/**
 * 接口 [获取钉在侧边的机器人列表↗](/interface/api/63801) 的 **请求配置的类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/sidebar`
 * @更新时间 `2023-09-18 14:13:40`
 */
type GetBotSidebarRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/bot/sidebar', 'data', string, string, true>
>;

/**
 * 接口 [获取钉在侧边的机器人列表↗](/interface/api/63801) 的 **请求配置**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/sidebar`
 * @更新时间 `2023-09-18 14:13:40`
 */
const getBotSidebarRequestConfig: GetBotSidebarRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_0_0,
    devUrl: devUrl_6_0_0_0,
    prodUrl: prodUrl_6_0_0_0,
    path: '/bot/sidebar',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_0_0,
    paramNames: [],
    queryNames: [],
    requestDataOptional: true,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getBotSidebar',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取钉在侧边的机器人列表↗](/interface/api/63801) 的 **请求函数**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/sidebar`
 * @更新时间 `2023-09-18 14:13:40`
 */
export const getBotSidebar = /*#__PURE__*/ (requestData?: GetBotSidebarRequest, ...args: UserRequestRestArgs) => {
    return request<GetBotSidebarResponse>(prepare(getBotSidebarRequestConfig, requestData), ...args);
};

getBotSidebar.requestConfig = getBotSidebarRequestConfig;

/**
 * 接口 [获取一个机器人的会话欢迎语↗](/interface/api/63819) 的 **请求类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/{key}/welcome`
 * @更新时间 `2023-09-07 13:41:46`
 */
export interface GetBotKeyWelcomeRequest {
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [获取一个机器人的会话欢迎语↗](/interface/api/63819) 的 **返回类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/{key}/welcome`
 * @更新时间 `2023-09-07 13:41:46`
 */
export interface GetBotKeyWelcomeResponse {
    /**
     * 感兴趣的问题
     */
    questions: string[];
    /**
     * 欢迎语
     */
    welcome: string;
}

/**
 * 接口 [获取一个机器人的会话欢迎语↗](/interface/api/63819) 的 **请求配置的类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/{key}/welcome`
 * @更新时间 `2023-09-07 13:41:46`
 */
type GetBotKeyWelcomeRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/bot/{key}/welcome', 'data', 'key', string, false>
>;

/**
 * 接口 [获取一个机器人的会话欢迎语↗](/interface/api/63819) 的 **请求配置**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/{key}/welcome`
 * @更新时间 `2023-09-07 13:41:46`
 */
const getBotKeyWelcomeRequestConfig: GetBotKeyWelcomeRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_0_0,
    devUrl: devUrl_6_0_0_0,
    prodUrl: prodUrl_6_0_0_0,
    path: '/bot/{key}/welcome',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_0_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getBotKeyWelcome',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取一个机器人的会话欢迎语↗](/interface/api/63819) 的 **请求函数**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/{key}/welcome`
 * @更新时间 `2023-09-07 13:41:46`
 */
export const getBotKeyWelcome = /*#__PURE__*/ (requestData: GetBotKeyWelcomeRequest, ...args: UserRequestRestArgs) => {
    return request<GetBotKeyWelcomeResponse>(prepare(getBotKeyWelcomeRequestConfig, requestData), ...args);
};

getBotKeyWelcome.requestConfig = getBotKeyWelcomeRequestConfig;

/**
 * 接口 [改变机器人在用户侧边栏的状态↗](/interface/api/63828) 的 **请求类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/fixed/{key}`
 * @更新时间 `2023-09-04 16:35:56`
 */
export interface GetBotFixedKeyRequest {
    /**
     * true: 表示固定在侧边栏，false: 取消固定在侧边栏
     */
    fixed: string;
    /**
     * key
     */
    key: string;
}

/**
 * 接口 [改变机器人在用户侧边栏的状态↗](/interface/api/63828) 的 **返回类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/fixed/{key}`
 * @更新时间 `2023-09-04 16:35:56`
 */
export type GetBotFixedKeyResponse = boolean;

/**
 * 接口 [改变机器人在用户侧边栏的状态↗](/interface/api/63828) 的 **请求配置的类型**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/fixed/{key}`
 * @更新时间 `2023-09-04 16:35:56`
 */
type GetBotFixedKeyRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/bot/fixed/{key}', 'data', 'key', 'fixed', false>
>;

/**
 * 接口 [改变机器人在用户侧边栏的状态↗](/interface/api/63828) 的 **请求配置**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/fixed/{key}`
 * @更新时间 `2023-09-04 16:35:56`
 */
const getBotFixedKeyRequestConfig: GetBotFixedKeyRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_0_0,
    devUrl: devUrl_6_0_0_0,
    prodUrl: prodUrl_6_0_0_0,
    path: '/bot/fixed/{key}',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_0_0,
    paramNames: ['key'],
    queryNames: ['fixed'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getBotFixedKey',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [改变机器人在用户侧边栏的状态↗](/interface/api/63828) 的 **请求函数**
 *
 * @分类 [机器人相关接口↗](/interface/api/cat_11045)
 * @标签 `v1.2.0`, `机器人相关接口`
 * @请求头 `GET /bot/fixed/{key}`
 * @更新时间 `2023-09-04 16:35:56`
 */
export const getBotFixedKey = /*#__PURE__*/ (requestData: GetBotFixedKeyRequest, ...args: UserRequestRestArgs) => {
    return request<GetBotFixedKeyResponse>(prepare(getBotFixedKeyRequestConfig, requestData), ...args);
};

getBotFixedKey.requestConfig = getBotFixedKeyRequestConfig;

const mockUrl_6_0_1_0 = 'mock/858' as any;
const devUrl_6_0_1_0 = '' as any;
const prodUrl_6_0_1_0 = '' as any;
const dataKey_6_0_1_0 = 'data' as any;

/**
 * 接口 [删除会话信息↗](/interface/api/63981) 的 **请求类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/conversation`
 * @更新时间 `2023-09-04 13:39:49`
 */
export interface DeleteBotTemplateKeyConversationRequest {
    /**
     * 会话id
     */
    conversationId: string;
    /**
     * 消息id
     */
    messageId: string;
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [删除会话信息↗](/interface/api/63981) 的 **返回类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/conversation`
 * @更新时间 `2023-09-04 13:39:49`
 */
export interface DeleteBotTemplateKeyConversationResponse {
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
    messages?: {
        /**
         * 内容信息，包含markdown格式
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
             * 唯一标识,这是为了流式返回时区分每一条消息的信息，特意冗余的字段
             */
            key?: string;
            pos?: number[];
            position?: number[];
            /**
             * 内容
             */
            text?: string;
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
             * 唯一标识,这是为了流式返回时区分每一条消息的信息，特意冗余的字段
             */
            key?: string;
            pos?: number[];
            position?: number[];
            /**
             * 内容
             */
            text?: string;
        }[];
        /**
         * message的类型,即文本或者图文
         */
        type?: 'text';
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
 * 接口 [删除会话信息↗](/interface/api/63981) 的 **请求配置的类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/conversation`
 * @更新时间 `2023-09-04 13:39:49`
 */
type DeleteBotTemplateKeyConversationRequestConfig = Readonly<
    RequestConfig<
        'mock/858',
        '',
        '',
        '/bot/template/{key}/conversation',
        'data',
        'key',
        'conversationId' | 'messageId',
        false
    >
>;

/**
 * 接口 [删除会话信息↗](/interface/api/63981) 的 **请求配置**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/conversation`
 * @更新时间 `2023-09-04 13:39:49`
 */
const deleteBotTemplateKeyConversationRequestConfig: DeleteBotTemplateKeyConversationRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_1_0,
    devUrl: devUrl_6_0_1_0,
    prodUrl: prodUrl_6_0_1_0,
    path: '/bot/template/{key}/conversation',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.raw,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_1_0,
    paramNames: ['key'],
    queryNames: ['conversationId', 'messageId'],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deleteBotTemplateKeyConversation',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [删除会话信息↗](/interface/api/63981) 的 **请求函数**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/conversation`
 * @更新时间 `2023-09-04 13:39:49`
 */
export const deleteBotTemplateKeyConversation = /*#__PURE__*/ (
    requestData: DeleteBotTemplateKeyConversationRequest,
    ...args: UserRequestRestArgs
) => {
    return request<DeleteBotTemplateKeyConversationResponse>(
        prepare(deleteBotTemplateKeyConversationRequestConfig, requestData),
        ...args
    );
};

deleteBotTemplateKeyConversation.requestConfig = deleteBotTemplateKeyConversationRequestConfig;

/**
 * 接口 [输入消息↗](/interface/api/63990) 的 **请求类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/conv`
 * @更新时间 `2023-09-12 14:17:36`
 */
export interface PostBotTemplateKeyConvRequest {
    /**
     * 如果为空，则新创建会话
     */
    conversationId?: string;
    language?: string;
    /**
     * 参数设置
     */
    params?: {
        /**
         * 参数的中文名
         */
        key: string;
        value: string;
    }[];
    /**
     * 失败的回答messageId
     */
    messageId?: string;
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
 * 接口 [输入消息↗](/interface/api/63990) 的 **返回类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/conv`
 * @更新时间 `2023-09-12 14:17:36`
 */
export interface PostBotTemplateKeyConvResponse {
    timeout?: number;
}

/**
 * 接口 [输入消息↗](/interface/api/63990) 的 **请求配置的类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/conv`
 * @更新时间 `2023-09-12 14:17:36`
 */
type PostBotTemplateKeyConvRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/bot/template/{key}/conv', 'data', 'key', string, false>
>;

/**
 * 接口 [输入消息↗](/interface/api/63990) 的 **请求配置**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/conv`
 * @更新时间 `2023-09-12 14:17:36`
 */
const postBotTemplateKeyConvRequestConfig: PostBotTemplateKeyConvRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_1_0,
    devUrl: devUrl_6_0_1_0,
    prodUrl: prodUrl_6_0_1_0,
    path: '/bot/template/{key}/conv',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_1_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotTemplateKeyConv',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [输入消息↗](/interface/api/63990) 的 **请求函数**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/conv`
 * @更新时间 `2023-09-12 14:17:36`
 */
export const postBotTemplateKeyConv = /*#__PURE__*/ (
    requestData: PostBotTemplateKeyConvRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotTemplateKeyConvResponse>(prepare(postBotTemplateKeyConvRequestConfig, requestData), ...args);
};

postBotTemplateKeyConv.requestConfig = postBotTemplateKeyConvRequestConfig;

/**
 * 接口 [获取模板参数记录↗](/interface/api/63999) 的 **请求类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `GET /bot/template/{key}/params`
 * @更新时间 `2023-09-04 17:05:08`
 */
export interface GetBotTemplateKeyParamsRequest {
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [获取模板参数记录↗](/interface/api/63999) 的 **返回类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `GET /bot/template/{key}/params`
 * @更新时间 `2023-09-04 17:05:08`
 */
export type GetBotTemplateKeyParamsResponse = {
    createTime: string;
    id: string;
    params: {
        /**
         * 描述信息
         */
        desc: string;
        /**
         * 是否必填
         */
        isRequired: boolean;
        /**
         * 参数的中文名
         */
        key: string;
        /**
         * 最大字符数
         */
        maxLength?: number;
        value: string;
        /**
         * 中文名
         */
        name: string;
    }[];
}[];

/**
 * 接口 [获取模板参数记录↗](/interface/api/63999) 的 **请求配置的类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `GET /bot/template/{key}/params`
 * @更新时间 `2023-09-04 17:05:08`
 */
type GetBotTemplateKeyParamsRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/bot/template/{key}/params', 'data', 'key', string, false>
>;

/**
 * 接口 [获取模板参数记录↗](/interface/api/63999) 的 **请求配置**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `GET /bot/template/{key}/params`
 * @更新时间 `2023-09-04 17:05:08`
 */
const getBotTemplateKeyParamsRequestConfig: GetBotTemplateKeyParamsRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_1_0,
    devUrl: devUrl_6_0_1_0,
    prodUrl: prodUrl_6_0_1_0,
    path: '/bot/template/{key}/params',
    method: Method.GET,
    requestHeaders: {},
    requestBodyType: RequestBodyType.query,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_1_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'getBotTemplateKeyParams',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [获取模板参数记录↗](/interface/api/63999) 的 **请求函数**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `GET /bot/template/{key}/params`
 * @更新时间 `2023-09-04 17:05:08`
 */
export const getBotTemplateKeyParams = /*#__PURE__*/ (
    requestData: GetBotTemplateKeyParamsRequest,
    ...args: UserRequestRestArgs
) => {
    return request<GetBotTemplateKeyParamsResponse>(
        prepare(getBotTemplateKeyParamsRequestConfig, requestData),
        ...args
    );
};

getBotTemplateKeyParams.requestConfig = getBotTemplateKeyParamsRequestConfig;

/**
 * 接口 [删除模板参数记录↗](/interface/api/64008) 的 **请求类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/params/{id}`
 * @更新时间 `2023-09-04 17:16:25`
 */
export interface DeleteBotTemplateKeyParamsIdRequest {
    /**
     * 机器人的唯一标识
     */
    key: string;
    /**
     * 参数记录的唯一标识
     */
    id: string;
}

/**
 * 接口 [删除模板参数记录↗](/interface/api/64008) 的 **返回类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/params/{id}`
 * @更新时间 `2023-09-04 17:16:25`
 */
export type DeleteBotTemplateKeyParamsIdResponse = boolean;

/**
 * 接口 [删除模板参数记录↗](/interface/api/64008) 的 **请求配置的类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/params/{id}`
 * @更新时间 `2023-09-04 17:16:25`
 */
type DeleteBotTemplateKeyParamsIdRequestConfig = Readonly<
    RequestConfig<
        'mock/858',
        '',
        '',
        '/bot/template/{key}/params/{id}',
        'data',
        'key' | 'id',
        string,
        false
    >
>;

/**
 * 接口 [删除模板参数记录↗](/interface/api/64008) 的 **请求配置**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/params/{id}`
 * @更新时间 `2023-09-04 17:16:25`
 */
const deleteBotTemplateKeyParamsIdRequestConfig: DeleteBotTemplateKeyParamsIdRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_1_0,
    devUrl: devUrl_6_0_1_0,
    prodUrl: prodUrl_6_0_1_0,
    path: '/bot/template/{key}/params/{id}',
    method: Method.DELETE,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_1_0,
    paramNames: ['key', 'id'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'deleteBotTemplateKeyParamsId',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [删除模板参数记录↗](/interface/api/64008) 的 **请求函数**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `DELETE /bot/template/{key}/params/{id}`
 * @更新时间 `2023-09-04 17:16:25`
 */
export const deleteBotTemplateKeyParamsId = /*#__PURE__*/ (
    requestData: DeleteBotTemplateKeyParamsIdRequest,
    ...args: UserRequestRestArgs
) => {
    return request<DeleteBotTemplateKeyParamsIdResponse>(
        prepare(deleteBotTemplateKeyParamsIdRequestConfig, requestData),
        ...args
    );
};

deleteBotTemplateKeyParamsId.requestConfig = deleteBotTemplateKeyParamsIdRequestConfig;

/**
 * 接口 [判断是否超出限制↗](/interface/api/64044) 的 **请求类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/check`
 * @更新时间 `2023-09-18 14:03:59`
 */
export interface PostBotTemplateKeyCheckRequest {
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
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [判断是否超出限制↗](/interface/api/64044) 的 **返回类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/check`
 * @更新时间 `2023-09-18 14:03:59`
 */
export interface PostBotTemplateKeyCheckResponse {
    /**
     * 是否超出限制
     */
    exceed: boolean;
}

/**
 * 接口 [判断是否超出限制↗](/interface/api/64044) 的 **请求配置的类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/check`
 * @更新时间 `2023-09-18 14:03:59`
 */
type PostBotTemplateKeyCheckRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/bot/template/{key}/check', 'data', 'key', string, false>
>;

/**
 * 接口 [判断是否超出限制↗](/interface/api/64044) 的 **请求配置**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/check`
 * @更新时间 `2023-09-18 14:03:59`
 */
const postBotTemplateKeyCheckRequestConfig: PostBotTemplateKeyCheckRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_1_0,
    devUrl: devUrl_6_0_1_0,
    prodUrl: prodUrl_6_0_1_0,
    path: '/bot/template/{key}/check',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_1_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotTemplateKeyCheck',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [判断是否超出限制↗](/interface/api/64044) 的 **请求函数**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/check`
 * @更新时间 `2023-09-18 14:03:59`
 */
export const postBotTemplateKeyCheck = /*#__PURE__*/ (
    requestData: PostBotTemplateKeyCheckRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotTemplateKeyCheckResponse>(
        prepare(postBotTemplateKeyCheckRequestConfig, requestData),
        ...args
    );
};

postBotTemplateKeyCheck.requestConfig = postBotTemplateKeyCheckRequestConfig;

/**
 * 接口 [添加模板参数记录↗](/interface/api/64197) 的 **请求类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/params`
 * @更新时间 `2023-09-12 18:10:23`
 */
export interface PostBotTemplateKeyParamsRequest {
    params: {
        key: string;
        value: string;
    }[][];
    /**
     * 机器人的唯一标识
     */
    key: string;
}

/**
 * 接口 [添加模板参数记录↗](/interface/api/64197) 的 **返回类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/params`
 * @更新时间 `2023-09-12 18:10:23`
 */
export type PostBotTemplateKeyParamsResponse = boolean;

/**
 * 接口 [添加模板参数记录↗](/interface/api/64197) 的 **请求配置的类型**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/params`
 * @更新时间 `2023-09-12 18:10:23`
 */
type PostBotTemplateKeyParamsRequestConfig = Readonly<
    RequestConfig<'mock/858', '', '', '/bot/template/{key}/params', 'data', 'key', string, false>
>;

/**
 * 接口 [添加模板参数记录↗](/interface/api/64197) 的 **请求配置**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/params`
 * @更新时间 `2023-09-12 18:10:23`
 */
const postBotTemplateKeyParamsRequestConfig: PostBotTemplateKeyParamsRequestConfig = /*#__PURE__*/ {
    mockUrl: mockUrl_6_0_1_0,
    devUrl: devUrl_6_0_1_0,
    prodUrl: prodUrl_6_0_1_0,
    path: '/bot/template/{key}/params',
    method: Method.POST,
    requestHeaders: {},
    requestBodyType: RequestBodyType.json,
    responseBodyType: ResponseBodyType.json,
    dataKey: dataKey_6_0_1_0,
    paramNames: ['key'],
    queryNames: [],
    requestDataOptional: false,
    requestDataJsonSchema: {},
    responseDataJsonSchema: {},
    requestFunctionName: 'postBotTemplateKeyParams',
    queryStringArrayFormat: QueryStringArrayFormat.brackets,
    extraInfo: {}
};

/**
 * 接口 [添加模板参数记录↗](/interface/api/64197) 的 **请求函数**
 *
 * @分类 [Samepage机器人相关接口↗](/interface/api/cat_11063)
 * @标签 `v1.2.0`, `Samepage机器人相关接口`
 * @请求头 `POST /bot/template/{key}/params`
 * @更新时间 `2023-09-12 18:10:23`
 */
export const postBotTemplateKeyParams = /*#__PURE__*/ (
    requestData: PostBotTemplateKeyParamsRequest,
    ...args: UserRequestRestArgs
) => {
    return request<PostBotTemplateKeyParamsResponse>(
        prepare(postBotTemplateKeyParamsRequestConfig, requestData),
        ...args
    );
};

postBotTemplateKeyParams.requestConfig = postBotTemplateKeyParamsRequestConfig;

/* prettier-ignore-end */
