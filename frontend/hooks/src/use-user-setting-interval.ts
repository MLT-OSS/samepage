import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import type { GetUserProfileSettingsResponse } from '@/ytt-type/user';
import { useConversationContext } from '@xm/context';
import { GetDictBotResponse } from '@/ytt-type/robot';
import { useBotInfo } from './use-bot-info';
import { useNavigate } from 'react-router-dom';

export const useUserSettingInterval = () => {
    const navigate = useNavigate();
    const { dispatch, conversationState } = useConversationContext();
    const { robotDict, modelInfo, userSettingPollTimerId } = conversationState || {};
    const { setBotDict } = useBotInfo();

    // 机器人相关字典，包含模型列表以及分类
    const { run: getRobotDict } = useRequest(services.robot.getRobotDict, {
        manual: true,
        onSuccess: (res: GetDictBotResponse) => {
            setBotDict(res);

            // 判断当前模型还有没有权限，如果没有，提示用户
            const isIgnore = !modelInfo; // modelInfo 为空的时候忽略 robot unauth 判断
            if (isIgnore) {
                return;
            }

            const isExist = res?.bot.findIndex((i) => i.key === modelInfo?.key) > -1;
            if (!isExist) {
                dispatch({
                    type: 'p_robot_unauth_show',
                    payload: {
                        robotUnauthShow: true
                    }
                });
                // 指 s_flag 为 false
                dispatch({
                    type: 's_flag',
                    payload: {
                        selectFlag: false
                    }
                });
            }
        }
    });

    const { run: getUserSettings } = useRequest(services.user.getSettings, {
        manual: true,
        onSuccess: (res: GetUserProfileSettingsResponse) => {
            // 存全局
            dispatch({
                type: 'i_user_setting',
                payload: {
                    userSetting: res
                }
            });
            checkBotVision(res.botVersion);
            checkProductVersion(res.isUpdateClient);
        }
    });

    // 每次切换路由的时候校验机器人版本是否为最新版
    const checkBotVision = (newBotVersion: GetUserProfileSettingsResponse['botVersion']) => {
        const currBotVersion = robotDict?.botVersion;
        if (newBotVersion && currBotVersion !== newBotVersion) {
            // 更新字典
            getRobotDict();
        }
    };
    const checkProductVersion = (isExpired: boolean) => {
        if (isExpired) {
            dispatch({
                type: 'p_layout_version_info_popup_show',
                payload: {
                    layoutVersionInfoPopupShow: 'soft'
                }
            });
        }
    };

    // 无需判断是否已经有 timerId，需要保证每次 set/clear 成对出现，否则会有玄学问题
    const setUserSettingInterval = () => {
        getUserSettings();
        const timerId = setInterval(() => {
            getUserSettings();
        }, 1 * 60 * 1000);
        dispatch({
            type: 'i_user_setting_poll_time_id',
            payload: {
                userSettingPollTimerId: timerId
            }
        });
        return timerId;
    };

    const clearUserSettingInterval = (_timerId?: NodeJS.Timer | null) => {
        const timerId = _timerId ?? userSettingPollTimerId;
        console.log('执行 clearUserSettingInterval', timerId);
        if (timerId) {
            clearInterval(timerId);
            dispatch({
                type: 'i_user_setting_poll_time_id',
                payload: {
                    userSettingPollTimerId: null
                }
            });
        }
    };

    return { getUserSettings, setUserSettingInterval, clearUserSettingInterval };
};
