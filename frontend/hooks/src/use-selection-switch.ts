import { STORAGE_SELECTION } from '@/constants';
import { getSessionValue, setSessionValue } from '@/utils';
import { GetUserProfileResponse } from '@/ytt-type/user';
import { useConversationContext } from '@xm/context';
import { useCallback, useEffect } from 'react';

const DEFAULT_VALUE = true;
const getStorageKey = (userinfo?: GetUserProfileResponse) => {
    return `${STORAGE_SELECTION}_${userinfo?.userId || ''}`;
};

export const useSelectionSwitch: () => [boolean, (v: boolean) => void] = () => {
    const {
        conversationState: { userinfo, selectSwitch },
        dispatch
    } = useConversationContext();
    const storageKey = getStorageKey(userinfo);

    const _setVal = useCallback(
        (value: boolean) => {
            dispatch({
                type: 's_switch',
                payload: { selectSwitch: value }
            });
        },
        [dispatch]
    );
    const setVal = (value: boolean) => {
        _setVal(value);
        setSessionValue({ key: storageKey, value: +value });
    };

    useEffect(() => {
        (async () => {
            const storageVal = (await getSessionValue(storageKey)) ?? +DEFAULT_VALUE;
            _setVal(Boolean(+storageVal));
        })();
    }, []);

    return [selectSwitch ?? DEFAULT_VALUE, setVal];
};
