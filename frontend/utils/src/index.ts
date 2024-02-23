// 对照式翻译相关
import * as _translate from './translate';
import * as _translateApi from './translate/apis';
import * as _translateAuth from './translate/auth';
import * as _translateConstants from './translate/constants';
import * as _translateFetch from './translate/fetch';
import * as _translateIframe from './translate/iframe';
import * as _translateMsg from './translate/msg';
import * as _translatePool from './translate/pool';
import * as _translateRules from './translate/rules';
import * as _translateSync from './translate/sync';
import * as _translateUtils from './translate/utils';

export * from './utils';
export * from './request';
export * from './error-handlers';
export * from './adaptor';
export * from './storage';
export * from './login';
export * from './event-emitter';
export * from './load-src';
export * from './sse-request';
export * from './chat-branch';
export * from './user';
export * from './page-text';

const translate = {
    ..._translate,
    ..._translateApi,
    ..._translateAuth,
    ..._translateConstants,
    ..._translateFetch,
    ..._translateIframe,
    ..._translateMsg,
    ..._translatePool,
    ..._translateRules,
    ..._translateSync,
    ..._translateUtils
};
export { translate };
