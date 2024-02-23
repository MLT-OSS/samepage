import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@ant-design/icons';
import { useConversationContext } from '@xm/context';
import { useLogout, useUserInfo, useUserSettingInterval } from '@xm/hooks';
import { VERSION_VALUE, ENV, getLoginUrl } from '@/utils';
import { TUTORIALS_PATH } from '@/constants';

import { ReactComponent as UserIcon } from '@/assets/images/user.svg';
import { ReactComponent as MoreIcon } from '@/assets/images/h5/more.svg';

import styles from './index.module.less';
import { GetUserProfileResponse, GetUserProfileSettingsResponse } from '@/ytt-type/user';
import { App } from 'antd';

export const H5UserCenter = () => {
    const { NX_PLATFORM } = ENV;
    const { clean, logout } = useLogout();
    const navigate = useNavigate();
    const { getUserSettings } = useUserSettingInterval();
    const { message: antdMessage } = App.useApp();

    const {
        dispatch,
        conversationState: { userinfo = {}, userSetting = {} }
    } = useConversationContext();
    const { expireTime, mail, name, tenantName: userinfoTenantName } = userinfo as GetUserProfileResponse;
    const {
        expireTime: userSettingExpiredTime,
        tenantName: userSettingTenantName,
        pendingAuditNum = 0
    } = userSetting as GetUserProfileSettingsResponse;
    const { isCorpUser, isCorpAdmin } = useUserInfo();

    const tenantName = userSettingTenantName ?? userinfoTenantName ?? '-';

    const [tentantExitModalOpen, setTentantExitModalOpen] = useState<boolean>(false);

    const handleLogout = async () => {
        await logout({});
        await clean(['storage']);
        const _logonUrl = await getLoginUrl();
        window.location.href = `${_logonUrl}?target=${NX_PLATFORM}`;
    };

    const tenantExitCb = useCallback(async () => {
        // 清空模型信息
        dispatch({
            type: 'i_model_info',
            payload: {
                modelInfo: undefined
            }
        });
        // 重置 covnversation info
        dispatch({ type: 'clean_conversation' });
        // reload
        dispatch({
            type: 'i_main_layout_key',
            payload: {
                mainLayoutKey: String(+new Date())
            }
        });
        navigate('/');
    }, [dispatch, navigate]);

    const onApprove = () => {
        if (!pendingAuditNum) {
            return;
        }
        const msg = '请前往电脑端操作';
        antdMessage.info({
            key: msg,
            content: msg
        });
    };

    const approveText = pendingAuditNum ? (
        <span>
            您有 <span style={{ color: '#f00' }}>{pendingAuditNum}</span> 个审批，请前往电脑端操作
        </span>
    ) : (
        '暂无审批事项'
    );
    return (
        <div className={styles.h5UserCenter}>
            <div className={styles.user}>
                <Icon component={UserIcon} className={styles.avatar} />
                <div className={styles.info}>
                    <div className={styles.title}>
                        <div className={styles.name}>
                            <span>{name ?? '-'}</span>
                        </div>
                    </div>
                    <div className={styles.account}>账号：{mail ?? '-'}</div>
                </div>
            </div>
            <div className={styles.content}>
                <div
                    className={styles.item}
                    onClick={() => {
                        window.open(TUTORIALS_PATH);
                        return;
                    }}>
                    <div className={styles.left}>使用教程</div>
                    <div className={styles.right}>
                        <MoreIcon style={{ verticalAlign: 'middle' }} />
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.left}>当前版本</div>
                    <div className={styles.right}>{VERSION_VALUE ? `V ${VERSION_VALUE}` : '-'}</div>
                </div>
            </div>
            <div className={styles.logout} onClick={handleLogout}>
                退出登录
            </div>
        </div>
    );
};
