// translator.ts

export const GLOBAL_KEY = '*';

const APP_NAME = 'Xiao Ming Translator'.trim().split(/\s+/).join('-');

export const APP_LCNAME = APP_NAME.toLowerCase();

export const STOKEY_MSAUTH = `${APP_NAME}_msauth`;
export const STOKEY_SETTING = `${APP_NAME}_setting`;
export const STOKEY_RULES = `${APP_NAME}_rules`;
export const STOKEY_SYNC = `${APP_NAME}_sync`;
export const STOKEY_RULE_SETTING = `${APP_NAME}_rule_setting`;
export const STOKEY_RULESCACHE_PREFIX = `${APP_NAME}_rulescache_`;
export const STOKEY_PATH_ARR = `${APP_NAME}_auto_path_arr`;

export const CMD_TOGGLE_TRANSLATE = 'toggleTranslate';
export const CMD_TOGGLE_STYLE = 'toggleStyle';

export const CLIENT_CHROME = 'chrome';
export const CLIENT_EDGE = 'edge';
export const CLIENT_FIREFOX = 'firefox';

export const CLIENT_EXTS = [CLIENT_CHROME, CLIENT_EDGE, CLIENT_FIREFOX];

export const KV_RULES_KEY = 'XMT_RULES';
export const KV_RULES_SHARE_KEY = 'XMT_RULES_SHARE';
export const KV_SETTING_KEY = 'XMT_SETTING';
export const KV_SALT_SYNC = 'Xiao-Ming-Translator-SYNC';
export const KV_SALT_SHARE = 'Xiao-Ming-Translator-SHARE';

export const CACHE_NAME = `${APP_NAME}_cache`;

export const MSG_FETCH = 'fetch';
export const MSG_FETCH_LIMIT = 'fetch_limit';
export const MSG_FETCH_CLEAR = 'fetch_clear';
export const MSG_TRANS_TOGGLE = 'trans_toggle';
export const MSG_TRANS_TOGGLE_STYLE = 'trans_toggle_style';
export const MSG_TRANS_GETRULE = 'trans_getrule';
export const MSG_TRANS_PUTRULE = 'trans_putrule';
export const MSG_TRANS_CURRULE = 'trans_currule';

export const EVENT_KISS = 'kissEvent';

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

export const URL_KISS_WORKER = 'https://github.com/fishjar/kiss-worker';
export const URL_RAW_PREFIX = 'https://raw.githubusercontent.com/fishjar/kiss-translator/master';
export const URL_MICROSOFT_AUTH = 'https://edge.microsoft.com/translate/auth';
export const URL_MICROSOFT_TRANS = 'https://api-edge.cognitive.microsofttranslator.com/translate';

export const OPT_TRANS_GOOGLE = 'Google';
export const OPT_TRANS_MICROSOFT = 'Microsoft';
export const OPT_TRANS_OPENAI = 'OpenAI';
export const OPT_TRANS_ALL = [OPT_TRANS_GOOGLE, OPT_TRANS_MICROSOFT, OPT_TRANS_OPENAI];

export const OPT_LANGS_TO = [
    ['en', 'English'],
    ['zh-CN', '简体中文'],
    ['zh-TW', '繁體中文'],
    ['ar', 'العربية'],
    ['bg', 'Български'],
    ['ca', 'Català'],
    ['hr', 'Hrvatski'],
    ['cs', 'Čeština'],
    ['da', 'Dansk'],
    ['nl', 'Nederlands'],
    ['fi', 'Suomi'],
    ['fr', 'Français'],
    ['de', 'Deutsch'],
    ['el', 'Ελληνικά'],
    ['hi', 'हिन्दी'],
    ['hu', 'Magyar'],
    ['id', 'Indonesia'],
    ['it', 'Italiano'],
    ['ja', '日本語'],
    ['ko', '한국어'],
    ['ms', 'Melayu'],
    ['mt', 'Malti'],
    ['nb', 'Norsk Bokmål'],
    ['pl', 'Polski'],
    ['pt', 'Português'],
    ['ro', 'Română'],
    ['ru', 'Русский'],
    ['sk', 'Slovenčina'],
    ['sl', 'Slovenščina'],
    ['es', 'Español'],
    ['sv', 'Svenska'],
    ['ta', 'தமிழ்'],
    ['te', 'తెలుగు'],
    ['th', 'ไทย'],
    ['tr', 'Türkçe'],
    ['uk', 'Українська'],
    ['vi', 'Tiếng Việt']
];
export const OPT_LANGS_FROM = [['auto', 'Auto Detect'], ...OPT_LANGS_TO];
export const OPT_LANGS_SPECIAL: { [k: string]: Map<any, any> } = {
    [OPT_TRANS_MICROSOFT]: new Map([
        ['auto', ''],
        ['zh-CN', 'zh-Hans'],
        ['zh-TW', 'zh-Hant']
    ]),
    [OPT_TRANS_OPENAI]: new Map(OPT_LANGS_FROM.map(([key, val]) => [key, val.split(' - ')[0]]))
};

export const OPT_STYLE_NONE = 'style_none'; // 无
export const OPT_STYLE_LINE = 'under_line'; // 下划线
export const OPT_STYLE_DOTLINE = 'dot_line'; // 点状线
export const OPT_STYLE_DASHLINE = 'dash_line'; // 虚线
export const OPT_STYLE_WAVYLINE = 'wavy_line'; // 波浪线
export const OPT_STYLE_FUZZY = 'fuzzy'; // 模糊
export const OPT_STYLE_HIGHTLIGHT = 'highlight'; // 高亮
export const OPT_STYLE_ALL = [
    OPT_STYLE_NONE,
    OPT_STYLE_LINE,
    OPT_STYLE_DOTLINE,
    OPT_STYLE_DASHLINE,
    OPT_STYLE_WAVYLINE,
    OPT_STYLE_FUZZY,
    OPT_STYLE_HIGHTLIGHT
];
export const AUTO_TRANSLATE_NONE = 'auto_translate_none'; // 不自动翻译
export const AUTO_TRANSLATE_PATH = 'auto_translate_path'; // 翻译网址
export const AUTO_TRANSLATE_DOMAIN = 'auto_translate_domain'; // 翻译域名

export const OPT_TRANSLATE_ALL = [
    [AUTO_TRANSLATE_NONE, '不自动翻译'],
    [AUTO_TRANSLATE_PATH, '总是翻译当前网址'],
    [AUTO_TRANSLATE_DOMAIN, '总是翻译']
];

export const DEFAULT_FETCH_LIMIT = 10; // 默认最大任务数量
export const DEFAULT_FETCH_INTERVAL = 100; // 默认任务间隔时间

export const PROMPT_PLACE_FROM = '{{from}}'; // 占位符
export const PROMPT_PLACE_TO = '{{to}}'; // 占位符

export const DEFAULT_COLOR = '#8d8df1'; // 默认高亮背景色/线条颜色

// 全局规则
export const GLOBLA_RULE = {
    pattern: '*',
    translator: OPT_TRANS_MICROSOFT,
    fromLang: 'auto',
    toLang: 'zh-CN',
    textStyle: OPT_STYLE_DASHLINE,
    transOpen: 'false',
    bgColor: DEFAULT_COLOR
};

export const TRANS_MIN_LENGTH = 1; // 最短翻译长度
export const TRANS_MAX_LENGTH = 5000; // 最长翻译长度

export const DEFAULT_SETTING = {
    uiLang: 'en', // 界面语言
    fetchLimit: DEFAULT_FETCH_LIMIT, // 最大任务数量
    fetchInterval: DEFAULT_FETCH_INTERVAL, // 任务间隔时间
    minLength: TRANS_MIN_LENGTH,
    maxLength: TRANS_MAX_LENGTH,
    clearCache: true, // 是否在浏览器下次启动时清除缓存
    googleUrl: 'https://translate.googleapis.com/translate_a/single', // 谷歌翻译接口
    openaiUrl: 'https://api.openai.com/v1/chat/completions',
    openaiKey: '',
    openaiModel: 'gpt-3.5-turbo',
    openaiPrompt: `You will be provided with a sentence in ${PROMPT_PLACE_FROM}, and your task is to translate it into ${PROMPT_PLACE_TO}.`
};

export const DEFAULT_RULES = [GLOBLA_RULE];

export const DEFAULT_SYNC = {
    syncUrl: '', // 数据同步接口
    syncKey: '', // 数据同步密钥
    settingUpdateAt: 0,
    settingSyncAt: 0,
    rulesUpdateAt: 0,
    rulesSyncAt: 0,
    subRulesSyncAt: 0 // 订阅规则同步时间
};
