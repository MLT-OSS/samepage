import { CORP_REGISTER, USER } from '@/types';
import { GetLink2cCheckWhiteResponse } from '@/ytt-type/corp';

type LocationState = CORP_REGISTER.LocationState;
type ResultLocationState = CORP_REGISTER.ResultLocationState;
type LocationStateInviteInfo = CORP_REGISTER.LocationStateInviteInfo;

export const CORP_REGISTER_RESULT_TYPE_MAP: { [k: number]: CORP_REGISTER.ResultType } = {
    610: 'INVALID_LINK',
    611: 'FULL_CORP',
    612: 'CURRENT_CORP',
    613: 'APPLYING'
};

export const genCorpRegisterLocationState = (
    inviteInfo: LocationStateInviteInfo,
    corpInfo: GetLink2cCheckWhiteResponse
): LocationState =>
    ({
        inviteParams: inviteInfo,
        userinfo: {
            corpId: corpInfo?.tenantId,
            corpName: corpInfo?.tenantName
        },
        inviteInfo: {
            inviteUsername: corpInfo?.inviteUserName,
            corpId: corpInfo?.inviteTenantId,
            corpName: corpInfo?.inviteTenantName
        }
    } satisfies LocationState);

export const genCorpRegisterResultLocationState = (
    resultType: CORP_REGISTER.ResultType,
    inviteInfo: LocationStateInviteInfo,
    corpInfo: GetLink2cCheckWhiteResponse
): ResultLocationState =>
    ({
        resultType,
        ...genCorpRegisterLocationState(inviteInfo, corpInfo)
    } satisfies ResultLocationState);

export const getLeafDepartList = (data: USER.DepartInfo[]): USER.DepartInfo[] => {
    const s = new Set<string>();
    data.forEach((i) => {
        i.parentId && s.add(i.parentId);
    });
    return data.filter((i) => i.departId && !s.has(i.departId));
};
