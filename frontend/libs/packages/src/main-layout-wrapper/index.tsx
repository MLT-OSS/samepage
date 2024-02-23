import useRequest from '@ahooksjs/use-request';
import { useEffect } from 'react';
import services from '@xm/services';
import { useConversationContext } from '@xm/context';
import { isEmpty } from 'lodash-es';

import type { GetUserProfileResponse, GetUserProfileSettingsResponse } from '@/ytt-type/user';
import type { GetDictBotResponse } from '@/ytt-type/robot';
import { useBotInfo, useUserSettingInterval } from '@xm/hooks';

type IBotItem = GetDictBotResponse['bot'][0];

interface IMainLayoutWrapperProps {
    children?: React.ReactNode;
}

export const MainLayoutWrapper = (props: IMainLayoutWrapperProps) => {
    const {
        dispatch,
        conversationState: { robotDict, modelInfo }
    } = useConversationContext();

    useRequest(services.user.getUserInfo, {
        onSuccess: async (res: GetUserProfileResponse) => {
            if (res?.userId) {
                dispatch({
                    type: 'i_userinfo',
                    payload: {
                        userinfo: res
                    }
                });
            }
        }
    });

    useEffect(() => {
        if (isEmpty(robotDict)) {
            return;
        }

        const modelItem = robotDict?.bot?.find((i) => i.key === modelInfo?.key) as IBotItem;
        dispatch({
            type: 'i_model_info',
            payload: {
                modelInfo: modelItem || {}
            }
        });
    }, [robotDict?.bot]);

    const { setUserSettingInterval, clearUserSettingInterval } = useUserSettingInterval();
    useEffect(() => {
        const timerId = setUserSettingInterval();
        return () => {
            // 执行清理操作
            clearUserSettingInterval(timerId);
        };
    }, []);

    return <>{props?.children}</>;
};
