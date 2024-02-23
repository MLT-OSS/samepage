/**
 * 语言初始化
 */
import { useCallback, useEffect } from 'react';
import { useConversationContext } from '@xm/context';
import { TLanguage, getStorageKey } from './use-lang';
import { getSessionValue } from '@/utils';
import { useModelPermission } from './use-model-permission';

interface UseLangInitParams {
    lang: string;
    setLang: (l: string, temp: boolean) => void;
}

export const useLangInit = (params: UseLangInitParams) => {
    const { lang, setLang: _setLang } = params;

    const setLang = useCallback(
        (v: TLanguage) => {
            _setLang(v, false);
        },
        [_setLang]
    );
    const setLangTemp = useCallback(
        (v: TLanguage) => {
            _setLang(v, true);
        },
        [_setLang]
    );
    const { conversationState } = useConversationContext();
    const { userinfo } = conversationState;

    const { langPermission, langOptions } = useModelPermission();
    useEffect(() => {
        (async () => {
            if (!langPermission) {
                return;
            }
            const storageKey = getStorageKey(userinfo);
            const storageLang = await getSessionValue(storageKey);
            const isCurrLangSupported = langOptions.findIndex((i: any) => i.value === storageLang) > -1;
            isCurrLangSupported ? setLang(storageLang as string) : setLangTemp(langOptions?.[0]?.value);
        })();
    }, [langPermission, langOptions, userinfo, setLang, setLangTemp]);

    return {
        lang,
        setLang
    };
};
