import { ReactComponent as SummaryIcon } from '@/assets/images/collect.svg';
import { ReactComponent as UndoIcon } from '@/assets/images/undo.svg';
import { ReactComponent as TranslateIcon } from '@/assets/images/translate.svg';
import { ReactComponent as ExpandIcon } from '@/assets/images/expand.svg';
import { ReactComponent as QuestionIcon } from '@/assets/images/question-circle-outlined.svg';
import Icon from '@ant-design/icons';
import { ErrorType, ISelectionItem, CUE_WORD } from '@/types';
import packageJson from '../../../package.json';

export const PRODUCT_VERSION = packageJson.version;

export const SELECTION_ACTIONS: ISelectionItem[] = [
    { key: '摘要', title: '摘要', icon: <Icon component={SummaryIcon} /> },
    { key: '重写', title: '重写', icon: <Icon component={UndoIcon} /> },
    { key: '翻译', title: '翻译', icon: <Icon component={TranslateIcon} /> },
    { key: '问答', title: '问答', icon: <Icon component={QuestionIcon} /> },
    { key: '扩写', title: '扩写', icon: <Icon component={ExpandIcon} /> }
];

export const PROMPT_TYPES: CUE_WORD.PromptType[] = [
    { key: 'user_custom', name: '我的提示词' },
    { key: 'enterprise', name: '企业提示词' },
    { key: 'official', name: '公共提示词' }
];

/**
 * 消息相关常量
 */
// 打开 Main 页面
export const MSG_OPEN_MAIN = 'OPEN_MAIN';
export const MSG_OPEN_LOGIN = 'OPEN_LOGIN';
export const MSG_FORM_LOGIN = 'LOGIN_PAGE';
export const MSG_LOGIN_SUCCESS = 'LOGIN_SUCCESS';
// 选中文本: 把选中文本带到聊天框
export const MSG_SELECTION_SELECTED = 'SELECTION_SELECTED';
// 点击 selection 下拉快捷操作: 发送对应的 prompt
export const MSG_SELECTION_QUESTION = 'SELECTION_QUESTION';
// 点击非插件区域: 取消聊天框里的 selection
export const MSG_SELECTION_CANCEL = 'SELECTION_CANCEL';
// 发送请求
export const MSG_REQUEST = 'REQUEST';
export const MSG_ABORT_REQUEST = 'ABORT_REQUEST';
export const MSG_REQUEST_STREAM = 'REQUEST_STREAM';
export const MSG_REQUEST_STREAM_PAUSE = 'REQUEST_STREAM_PAUSE';
export const MSG_RESPONSE_STREAM = 'RESPONSE_STREAM';
// 错误消息
export const MSG_RESPONSE_ERROR = 'RESPONSE_ERROR';
export const MSG_RESPONSE_TAB_ID = 'RESPONSE_TAB_ID';

/**
 * 默认语言
 */
export const DEFAULT_LANG = 'Auto';

/**
 * Storage 相关变量
 */
export const STORAGE_SELECTION = 'XM_SELECTION';
export const STORAGE_LANGUAGE = 'XM_LANGUAGE';
export const STORAGE_TEMP_LANGUAGE = 'XM_TEMP_LANGUAGE';
export const STORAGE_OPEN_TIMES = 'XM_OPEN_TIMES';
export const STORAGE_KEEP_IMAGE_INPUT = 'XM_KEEP_IMAGE_INPUT';
export const STORAGE_ENTRY_POSITION = 'XM_ENTRY_POSITION';
export const STORAGE_ROBOT_DICTIONARY = 'XM_ROBOT_DICTIONARY';
export const STORAGE_ONLINE_SEARCH = 'XM_ONLINE_SEARCH';
export const STORAGE_ROBOT_SIDEBAR_LIST = 'XM_ROBOT_SIDEBAR_LIST';
export const STORAGE_SSE_TASK_ID_PREFIX = 'XM_SSE_TASK_ID_';
export const STORAGE_LOGIN_SEARCH = 'XM_LOGIN_SEARCH';

/**
 * sse error 相关常量
 */
export const SSE_ERROR = 'FE_SSE_ERROR';
export const SSE_ERROR_TIMEOUT = 'FE_SSE_ERROR_TIMEOUT';
export const SSE_ERROR_USER_ABORT = 'FE_SSE_ERROR_USER_ABORT';

/**
 * event emitter key
 */
export const EVENT_RESPONSE_ERROR_MESSAGE = 'XM_RESPONSE_ERROR_MESSAGE';
export const EVENT_CLOSE_EXTENSION = 'XM_CLOSE_EXTENSION';

export const ASYNC_SCRIOPTS_ID = 'XM_ASYNC_SCRIOPTS';
export const READ_PAGE_TEXT = 'XM_READ_PAGE_TEXT';
export const GET_READ_PAGE_CONFIG = 'XM_GET_READ_PAGE_CONFIG';

// 路由变量
export const LOGIN_PATH = '/login';
export const NOT_AUTH_PATHS = ['/', '/login', '/register', '/retrieve-password'];

/**
 * 正则表达式
 */
export const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$/;

/**
 * 外链地址
 */
export const USER_POLICY_PATH = '/privacy/service_policy.pdf';
export const PRIVACY_POLICY_PATH = '/privacy/privacy_policy.pdf';
export const TUTORIALS_PATH = '/about/tutorials.pdf';
export const EXTENSION_DOWNLOAD_PATH = '/extension/download';
// todo 替换成渠道活码
export const SERVICE_QR_CODE_PATH = '/about/qr.png';

/**
 * 会话 Message
 */
export const CONV_PENDING_MSG = '系统正在处理您的问题，请等待回复完成后再进行提问';
export const CONV_EDIT_MODE_MSG = '请完成编辑后再进行提问';
export const CONV_ERROR_MODE_MSG = '当前有一个问题尚未完成回复，请您编辑问题或重新请求答案。';
export const CONV_MSG_IMAGE_GENERATING = '已有正在执行的绘图任务';
export const CONV_CHAT_MAX_MSG_LENGTH = 100000; // 聊天模型消息最长为 10w 字符，写死的值

// message 错误消息
const ERROR_MSG = '请求失败，请稍后再试';
const ERROR_MSG_EN = 'Request failed, please try again later';
const TIMEOUT_ERROR_MSG = '系统繁忙，请稍后再试';
const TIMEOUT_ERROR_MSG_EN = 'System busy, please try again later';
const ABORT_ERROR_MSG = '系统提示：您已中止请求';
const ABORT_ERROR_MSG_EN = 'System prompt: You have aborted the request';
export const ERROR_MSG_MAP: Record<ErrorType, string[]> = {
    timeout: [TIMEOUT_ERROR_MSG, TIMEOUT_ERROR_MSG_EN],
    abort: [ABORT_ERROR_MSG, ABORT_ERROR_MSG_EN],
    error: [ERROR_MSG, ERROR_MSG_EN]
};

export const EXT_DISABLED_URL_REG =
    // eslint-disable-next-line no-useless-escape
    /^(https?:\/\/)(.*)\/(chat|user|m-chat)/;
