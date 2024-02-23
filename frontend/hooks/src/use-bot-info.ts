/**
 * 机器人信息 hooks
 */

import { STORAGE_ROBOT_DICTIONARY, STORAGE_ROBOT_SIDEBAR_LIST } from '@/constants';
import { setSessionValue } from '@/utils';
import { GetBotSidebarResponse, GetDictBotResponse } from '@/ytt-type/robot';
import { useConversationContext } from '@xm/context';

export const useBotInfo = () => {
    const { dispatch } = useConversationContext();
    const setBotDict = (robotDict: GetDictBotResponse) => {
        // 存 context
        dispatch({
            type: 'i_robot_dict',
            payload: {
                robotDict: {
                    ...robotDict,
                    botMap: getBotMap(robotDict)
                }
            }
        });

        // 存 storage
        setSessionValue({
            key: STORAGE_ROBOT_DICTIONARY,
            value: {
                ...robotDict,
                botMap: getBotMap(robotDict)
            }
        });
    };
    const setSidebar = (sidebarList: GetBotSidebarResponse) => {
        // 存 context
        dispatch({
            type: 'i_robot_side_bar',
            payload: {
                sidebarList
            }
        });
        dispatch({
            type: 'i_robot_side_bar_set',
            payload: {
                sidebarListSet: getSiderbarSet(sidebarList)
            }
        });

        // 存 storage
        setSessionValue({
            key: STORAGE_ROBOT_SIDEBAR_LIST,
            value: sidebarList
        });
    };

    const setSidebarSet = (sidebarListSet: Set<string>) => {
        dispatch({
            type: 'i_robot_side_bar_set',
            payload: {
                sidebarListSet: sidebarListSet
            }
        });
    };

    const getBotMap = (robotDict: GetDictBotResponse) => {
        const newMap = new Map();
        robotDict?.bot.forEach((i) => {
            newMap.set(i?.key, i);
        });
        return newMap;
    };

    const getSiderbarSet = (sidebarList: GetBotSidebarResponse) => {
        const newSet = new Set('');
        sidebarList?.forEach((i) => {
            newSet.add(i as string);
        });
        return newSet;
    };

    return {
        setBotDict,
        setSidebar,
        setSidebarSet
    };
};
