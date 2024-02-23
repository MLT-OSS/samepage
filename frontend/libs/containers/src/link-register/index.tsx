/**
 * 链接注册页面
 */

import { GetLink2cCheckWhiteResponse } from '@/ytt-type/corp';
import { GetUserProfileResponse } from '@/ytt-type/user';
import useRequest from '@ahooksjs/use-request';
import { Loading } from '@xm/components';
import { CorpRegisterCard } from '@xm/packages';
import services from '@xm/services';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { genCorpRegisterLocationState, genCorpRegisterResultLocationState } from '@/utils';
import { useCorpRegister } from '@xm/hooks';

export const LinkRegister = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const paramsKey = searchParams.get('key');
    const [linkUrlInfo, setLinkUrlInfo] = useState<GetLink2cCheckWhiteResponse>();
    const [errorMsg, setErrorMsg] = useState<string>();
    const { corpRegisterErrorCb } = useCorpRegister();

    const {
        run: getUserInfo,
        data: userinfo,
        loading: getUserInfoLoading
    } = useRequest(services.user.getUserInfo, {
        manual: true,
        onError: (res) => {
            console.log('获取用户信息失败', res);
        }
    });
    const { run: getInviteKeyInfo, loading: getLinkUrlInfoLoading } = useRequest(services.user.getInviteKeyInfo, {
        manual: true,
        onSuccess: (res: GetLink2cCheckWhiteResponse, [req]: any) => {
            const isLoggedIn = !!req.userId;
            if (!isLoggedIn) {
                navigate('/login', {
                    state: genCorpRegisterLocationState({ inviteKey: paramsKey ?? '' }, res)
                });
                return;
            }
            if (res?.tenantId) {
                navigate('/corp-register/result', {
                    state: genCorpRegisterResultLocationState('CORP', { inviteKey: paramsKey ?? '' }, res)
                });
                return;
            }
            // 个人版（没有申请过其他租户）
            setLinkUrlInfo(res);
        },
        onError: (res: any, [req]: any) => {
            console.log('打印 res', res);
            const { data, message } = res?.data?.response || {};
            setLinkUrlInfo(data);
            corpRegisterErrorCb(res, [req]);
            setErrorMsg(message);
        }
    });

    useEffect(() => {
        (async () => {
            let userinfo: GetUserProfileResponse | undefined;
            try {
                userinfo = await getUserInfo(false);
            } catch {}
            if (paramsKey) {
                await getInviteKeyInfo({
                    param: paramsKey,
                    userId: userinfo?.userId as unknown as string
                });
            }
        })();
    }, []);

    if (getUserInfoLoading || getLinkUrlInfoLoading) {
        return <Loading />;
    }

    return (
        <CorpRegisterCard
            dataSource="props"
            data={{
                resultType: 'PERSONAL',
                inviteParams: { inviteKey: paramsKey },
                userinfo: { username: userinfo?.name, corpId: userinfo?.tenantId, corpName: userinfo?.tenantName },
                inviteInfo: {
                    inviteUsername: linkUrlInfo?.inviteUserName,
                    corpId: linkUrlInfo?.inviteTenantId,
                    corpName: linkUrlInfo?.inviteTenantName
                }
            }}
            errorMsg={errorMsg}
        />
    );
};
