export declare namespace CORP_REGISTER {
    type ResultType =
        | 'PERSONAL' // 个人版(未申请过租户)
        | 'APPLYING' // 个人版(已申请过租户)
        | 'CORP' // 企业版(当前租户)
        | 'CURRENT_CORP' // 企业版(非当前租户)
        | 'FULL_CORP' // 租户已满
        | 'INVALID_LINK' // 链接失效
        | 'NEED_TO_APPROVAL' // 需要审批
        | 'DEPART_SELECT'; // 需要选择部门
    interface LocationStateInviteInfo {
        // inviteKey 和 inviteCode 两种注册方式
        inviteKey?: string | null; // 邀请 key
        inviteCode?: string; // 邀请码
        inviteDepartId?: string; // 邀请部门
    }
    type InviteType = 'new' | 'change';
    interface UserInfo {
        username?: string;
        corpId?: string;
        corpName?: string;
    }
    interface LocationState {
        // 加入方式: join: 加入租户；change: 修改租户；
        inviteType?: InviteType;
        inviteParams: LocationStateInviteInfo;
        // 当前用户的信息（用户名和当前的企业信息）
        userinfo?: UserInfo;
        // 邀请信息，待加入的企业信息
        inviteInfo?: {
            inviteUsername?: string;
            corpId?: string;
            corpName?: string;
        };
    }

    interface ResultLocationState extends LocationState {
        resultType: ResultType;
    }
}
