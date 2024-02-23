/**
 * 对照式翻译
 */
import { useState, useEffect } from 'react';
import { translate } from '@/utils';

const { apiTranslate } = translate;

/**
 * 翻译hook
 * @param {*} q
 * @param {*} rule
 * @returns
 */
export const useTranslate = (q: string, rule: any) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [sameLang, setSamelang] = useState(false);

    const { translator, fromLang, toLang } = rule;

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { trText, isSame } = await apiTranslate({
                    translator,
                    q,
                    fromLang,
                    toLang
                });
                setText(trText);
                setSamelang(isSame);
            } catch (err) {
                console.log('[translate]', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [q, translator, fromLang, toLang]);

    return { text, sameLang, loading };
};
