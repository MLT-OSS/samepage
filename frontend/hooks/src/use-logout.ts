import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { STORAGE_ROBOT_DICTIONARY, STORAGE_ROBOT_SIDEBAR_LIST } from '@/constants';
import { removeSessionValue } from '@/utils';
import { useConversationContext } from '@xm/context';
import { useUserSettingInterval } from './use-user-setting-interval';

export const useLogout = () => {
    const { dispatch } = useConversationContext();
    const { clearUserSettingInterval } = useUserSettingInterval();

    const { run: logout } = useRequest(services.login.Logout, { manual: true });

    // 必须执行的清理操作
    const _clean = () => {
        // 清理定时器
        clearUserSettingInterval();
    };
    // clean 内存里的一些东西
    const cleanMemory = async () => {
        // 1. 清理 context 数据
        dispatch({ type: 'clean' });
    };
    // 删除 storage 中的字典, 需要清理的 key
    // XM_ROBOT_DICTIONARY, XM_ROBOT_SIDEBAR_LIST
    const cleanStorage = async () => {
        await removeSessionValue([STORAGE_ROBOT_DICTIONARY, STORAGE_ROBOT_SIDEBAR_LIST]);
    };

    const clean = async (keys: ('storage' | 'memory')[] = ['memory', 'storage']) => {
        await _clean();
        if (keys.includes('memory')) {
            await cleanMemory();
        }
        if (keys.includes('storage')) {
            await cleanStorage();
        }
    };

    return { clean, logout };
};
