// 固定机器人相关方法，更新sidebarList
import useRequest from '@ahooksjs/use-request';

import { useConversationContext } from '@xm/context';
import services from '@xm/services';
import { useBotInfo } from './use-bot-info';

interface IFixParams {
    key: string;
    fixed: string;
}

export const useFixed = () => {
    const { conversationState } = useConversationContext();
    const { sidebarListSet } = conversationState;
    const { setSidebar, setSidebarSet } = useBotInfo();

    const handleFixed = (params: IFixParams) => {
        const { key } = params;
        getHandleFixed(params);
        // （这里不等接口返回，直接更改，交互友好）
        updateSiderbarSet(key);
    };

    const { run: getHandleFixed } = useRequest(services.robot.handleFixed, {
        manual: true,
        onSuccess: (res: any) => {
            getSidebarList();
        }
    });

    const updateSiderbarSet = (handleKey: string) => {
        const newSet: Set<string> = sidebarListSet || new Set('');
        if (sidebarListSet?.has(handleKey)) {
            newSet?.delete(handleKey);
        } else {
            newSet?.add(handleKey);
        }

        setSidebarSet(newSet);
    };

    // 更新sidebar列表
    const { run: getSidebarList } = useRequest(services.robot.getSidebarList, {
        manual: true,
        onSuccess: (res: string[]) => {
            setSidebar(res);
        }
    });

    return { getSidebarList, handleFixed };
};
