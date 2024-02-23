/**
 * web-search hooks
 */
import { STORAGE_ONLINE_SEARCH } from '@/constants';
import { getSessionValue, setSessionValue } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

export type TWebSearch = string;
export type TSetWebSearch = (v: TWebSearch) => void;

export const useWebSearch: () => [TWebSearch, TSetWebSearch] = () => {
    const [webSearch, setWebSearch] = useState<TWebSearch>('NONE');

    const setWebSearchFun = useCallback(
        (v: TWebSearch) => {
            setWebSearch(v);
            // 将是否联网搜索存储在前端storage里
            setSessionValue({
                key: STORAGE_ONLINE_SEARCH,
                value: v
            });
        },
        [setWebSearch]
    );

    useEffect(() => {
        (async () => {
            // 获取联网搜索信息
            const storageWebSearch = (await getSessionValue(STORAGE_ONLINE_SEARCH)) + '' || 'NONE';
            setWebSearch(storageWebSearch);
        })();
    }, []);

    return [webSearch, setWebSearchFun];
};
