/**
 * 语言 hooks
 */
import { DEFAULT_LANG, STORAGE_LANGUAGE } from '@/constants';
import { useConversationContext } from '@xm/context';
import { getQueryString, getSessionValue, setSessionValue } from '@/utils';
import { GetUserProfileResponse } from '@/ytt-type/user';
import { useCallback, useEffect, useState } from 'react';

export type TLanguage = string;
export type TSetLang = (v: TLanguage, temp: boolean) => void;

export const getStorageKey = (userinfo?: GetUserProfileResponse) => {
    return `${STORAGE_LANGUAGE}_${userinfo?.userId || '-'}`;
};

export const useLang: () => [TLanguage, TSetLang] = () => {
    const {
        conversationState: { userinfo }
    } = useConversationContext();
    const storageKey = getStorageKey(userinfo);

    // doc-chat: 挂载组件的时候默认的语言: query.lang || storageLang || DEFAULT_LANG;
    // 非 doc-chat: 挂载组件的时候默认的语言：storageLang || DEFAULT_LANG;
    // 但是因为从 storage 取值操作是异步的，所以初始化为 DEFAULT_LANG，在 effect 里面去获取并设置
    const [lang, setLocalLang] = useState<TLanguage>(DEFAULT_LANG);
    const setLang = useCallback(
        (v: TLanguage, temp: boolean) => {
            setLocalLang(v);
            if (!temp) {
                setSessionValue({ key: storageKey, value: v });
            }
        },
        [storageKey]
    );
    useEffect(() => {
        (async () => {
            // 不考虑 tempStorage 的情况，如果不支持，在 ConversationComp 里面去处理
            const queryInitValue = getQueryString(window.location, 'lang');
            if (queryInitValue) {
                setLang(queryInitValue, false);
                return;
            }
            const lang = (await getSessionValue(storageKey)) as TLanguage;
            setLang(lang || DEFAULT_LANG, false);
        })();
    }, []);

    return [lang, setLang];
};
