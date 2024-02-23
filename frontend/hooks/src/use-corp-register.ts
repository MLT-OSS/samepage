/**
 * 企业注册相关钩子
 */

import { MSG_RESPONSE_ERROR } from '@/constants';
import {
    genCorpRegisterResultLocationState,
    navigateToChat,
    CORP_REGISTER_RESULT_TYPE_MAP,
    genCorpRegisterLocationState
} from '@/utils';
import useRequest from '@ahooksjs/use-request';
import { useLocation, useNavigate } from 'react-router-dom';
import services from '@xm/services';
import { App } from 'antd';
import { useLogout } from './use-logout';
import { isEmpty, omit } from 'lodash-es';
import { CORP_REGISTER } from 'types/corp-register';
import { GetLink2cCheckWhiteResponse } from '@/ytt-type/corp';

export const useCorpRegister = (defaultState?: CORP_REGISTER.LocationState) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { message: antdMessage } = App.useApp();
    const { logout, clean } = useLogout();

    const successCb = (res: any, [req]: any) => {
        console.log('打印 res', res ? JSON.stringify(res) : '-');
        if (res.result === 'PENDING') {
            // 需要管理员审核
            navigate('/corp-register/result', {
                state: genCorpRegisterResultLocationState(
                    'NEED_TO_APPROVAL',
                    { inviteKey: req.key, inviteCode: req.code, inviteDepartId: req.departId },
                    res
                )
            });
        } else if (res.tenantId && res.tenantId !== res.inviteTenantId) {
            // 非当前租户
            navigate('/corp-register/result', {
                state: genCorpRegisterResultLocationState(
                    'CORP',
                    { inviteKey: req.key, inviteCode: req.code, inviteDepartId: req.departId },
                    res
                )
            });
        } else {
            navigateToChat(location?.search);
        }
    };

    // 企业注册接口 errorCb
    // 对应接口：加入租户，退出租户并加入新租户，获取邀请key的信息
    // 这三个接口的出参是兼容的。前两个接口比第三个接口加了一个加入租户状态（是否是审核中）
    const errorCb = (res: any, [req]: any) => {
        console.log('errorCb', res, req);
        const { statusCode, message, data } = res?.data?.response || {};
        if ([610, 611, 612, 613].includes(statusCode)) {
            navigate('/corp-register/result', {
                state: genCorpRegisterResultLocationState(
                    CORP_REGISTER_RESULT_TYPE_MAP[statusCode],
                    { inviteKey: req.key ?? req.param, inviteCode: req.code, inviteDepartId: req.departId },
                    data
                )
            });
        } else {
            antdMessage.open({
                key: `${MSG_RESPONSE_ERROR}_${statusCode}`,
                type: 'error',
                content: message
            });
        }
    };

    const { run: joinCorp } = useRequest(services.user.joinCorp, {
        manual: true,
        onSuccess: successCb,
        onError: errorCb
    });

    const { run: changeCorp } = useRequest(services.user.changeCorp, {
        manual: true,
        onSuccess: successCb,
        onError: errorCb
    });
    const { run: getInviteKeyInfo } = useRequest(services.user.getInviteKeyInfo, {
        manual: true,
        onSuccess: (res: GetLink2cCheckWhiteResponse, [req]: any) => {
            const isLoggedIn = !!req.userId;
            if (!isLoggedIn) {
                navigate('/login', {
                    state: genCorpRegisterLocationState({ inviteKey: req.param ?? '' }, res)
                });
                return;
            }
            if (res?.tenantId) {
                // 非当前企业租户
                navigate('/corp-register/result', {
                    state: genCorpRegisterResultLocationState('CORP', { inviteKey: req.param ?? '' }, res)
                });
                return;
            }
            // 个人版（没有申请过其他租户）-选部门
            navigate('/corp-register/result', {
                state: genCorpRegisterResultLocationState('DEPART_SELECT', { inviteKey: req.param ?? '' }, res)
            });
        },
        onError: errorCb
    });

    const changeAccount = async () => {
        await logout({});
        clean(['storage']);

        console.log('打印 切换账户 数据', location?.state, defaultState);
        navigate('/login', {
            state: omit((isEmpty(location?.state) ? defaultState : location?.state) || {}, 'resultType')
        });
    };

    const jumpToApp = () => {
        navigateToChat();
    };

    return {
        joinCorp,
        changeCorp,
        changeAccount,
        jumpToApp,
        getInviteKeyInfo,
        corpRegisterErrorCb: errorCb
    };
};
