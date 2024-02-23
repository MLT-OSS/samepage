/**
 * 获取用户信息
 *
 * 目前只有 isCorpUser 和 isCorpAdmin
 *
 * todo 后续补充
 */
import { useConversationContext } from '@xm/context';
import { useMemo } from 'react';

export const useUserInfo = () => {
    const { conversationState } = useConversationContext();
    const { userSetting } = conversationState || {};
    const { type: userType, roleType, tenantId, tenantName, expireTime } = userSetting || {};

    const isCorpUser = useMemo(() => userType === 'ENTERPRISE' && !!tenantId, [userType, tenantId]);
    const isCorpAdmin = useMemo(() => isCorpUser && roleType === 'ENTERPRISE_ADMIN', [isCorpUser, roleType]);

    return {
        isCorpUser,
        isCorpAdmin,
        userType,
        roleType,
        tenantId,
        tenantName,
        expireTime: expireTime ?? ''
    };
};
