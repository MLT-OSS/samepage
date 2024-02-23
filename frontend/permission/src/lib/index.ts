/**
 * 功能权限
 */
import { PERMISSION, ModelType } from '@/types';
import { ENV, isH5 } from '@/utils';
import EXTENSION_PERMISSION from './permission.extension';
import WEB_PERMISSION from './permission.web';
import H5_PERMISSION from './permission.h5';
import DOC_CHAT_PERMISSION from './permission.doc-chat';

const { NX_PLATFORM } = ENV;

const PLATFORM_PERMISSION_MAP: { [k: string]: any } = {
    extension: EXTENSION_PERMISSION,
    web: WEB_PERMISSION,
    'doc-chat': DOC_CHAT_PERMISSION,
    h5: H5_PERMISSION,
    playground: WEB_PERMISSION
};

export const UNSUPPORT_PLATFORM = isH5 ? '手机端' : '电脑端';
export const SUPPORT_PLATFORM = isH5 ? '电脑端' : '手机端';

/**
 * 前后端权限映射
 *
 * key: api key
 * value: fe key
 */
const API_KEY_MAP: { [k: string]: string } = {
    intent: 'selection',
    read_article: 'readArticle',
    read_doc: 'readDoc',
    prompt: 'prompt'
};

const getApiPermissionConfigMap = (config: PERMISSION.ApiFeatConfig = []) => {
    const res: { [k: string]: any } = {};
    config.forEach(({ feature, ...rest }) => {
        res[feature] = rest;
    });
    return res;
};

/**
 * 计算模型最终的权限
 * @param fePermission 该类型（chat, stateless_chat）下前端对应权限
 * @param apiPermission api 返回的权限，对标 feature 字段
 * @param apiPermissionConfig api 返回的权限配置，对标 feature_config 字段
 *
 * api 返回的权限分为两部分：
 * 1. common: API 和 前端共有的权限, 这种权限在 feature_config 中没有定义
 * 2. apiOnly: 后端独有的， API_KEY_MAP 中找不到对应关系的权限，在 feature_config 中可能有定义
 *
 * 前端定义的权限（for 分端）分为两部分：
 * 1. common: 和 API 共用的，会比 api 的权限粒度更细
 * 2. feOnly: 前端独有的。后端无需控制
 * *
 * 模型的最终权限由下面三部分构成：
 * 1. apiOnly: API_KEY_MAP 中找不到对应关系的权限
 * 2. common: API&前端共有的权限: API 中权限和前端权限的交集
 * 3. feOnly: 前端独有的权限
 */
const calcConversationPermission = (
    fePermission: { [k: string]: any },
    apiPermission: string[],
    apiPermissionConfig: PERMISSION.ApiFeatConfig
) => {
    const [apiOnlyPermission, commonPermission, feOnlyPermission]: { [k: string]: any }[] = [{}, {}, {}];
    const apiPermConfigMap = getApiPermissionConfigMap(apiPermissionConfig);
    apiPermission.forEach((i) => {
        if (API_KEY_MAP[i]) {
            // common
            const fePermissionKey = API_KEY_MAP[i];
            if (fePermission[fePermissionKey]) {
                commonPermission[fePermissionKey] = fePermission[fePermissionKey];
            }
        } else {
            // api only
            apiOnlyPermission[i] = apiPermConfigMap[i] ?? true;
        }
    });

    const fePermissionKeys = Object.keys(fePermission);
    const apiFePermissionKeys = Object.values(API_KEY_MAP);
    fePermissionKeys.forEach((i) => {
        if (apiFePermissionKeys.includes(i)) {
            return;
        }
        feOnlyPermission[i] = fePermission[i];
    });

    return {
        ...apiOnlyPermission,
        ...commonPermission,
        ...feOnlyPermission
    };
};

export const calcConversationPermissionByType = (
    type: ModelType,
    apiPermission: string[] = [],
    apiPermissionConfig: PERMISSION.ApiFeatConfig
) => {
    const convPermission = NX_PLATFORM ? PLATFORM_PERMISSION_MAP[NX_PLATFORM] : undefined;
    const fePermission = convPermission?.[type] ?? {};
    return calcConversationPermission(fePermission, apiPermission, apiPermissionConfig);
};

// 目前 float menu permission 不需要特殊处理，直接从 api 导出
export const calcFloatMenuPermission = (apiPermission: string[] = []) => {
    const permission: { [k: string]: boolean } = {};
    apiPermission.forEach((i) => {
        permission[i] = true;
    });
    return permission;
};

export const getReadDocObjectPermission = (permission?: boolean | PERMISSION.IReadDoc) => {
    if (!permission) {
        return {
            entry: false,
            docLink: { show: false },
            summaryGuide: false
        };
    }
    if (typeof permission === 'boolean') {
        return {
            entry: true,
            docLink: { show: false },
            summaryGuide: false
        };
    }
    return {
        entry: permission?.entry ?? true,
        docLink: { show: permission?.docLink?.show ?? false },
        summaryGuide: permission?.summaryGuide ?? false
    };
};

export const getPromptObjectPermission = (permission?: boolean | PERMISSION.IPrompt): PERMISSION.IPrompt => {
    if (!permission) {
        return {
            show: false,
            add: false
        };
    }
    if (typeof permission === 'boolean') {
        return {
            show: true,
            add: true
        };
    }
    return {
        show: permission?.show ?? true,
        add: permission?.add ?? true
    };
};
