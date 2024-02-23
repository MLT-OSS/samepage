/**
 * 注册(个人信息填写)
 */
import Icon from '@ant-design/icons';
import PersonalForm from './components/personal-form';
import { ReactComponent as LeftArrowIcon } from '@/assets/images/left-arrow.svg';
import styles from './index.module.less';
import { useLocation, useNavigate } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { useCorpRegister, useUserNavigate } from '@xm/hooks';
import { CORP_REGISTER } from 'types/corp-register';

export const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userNavigete = useUserNavigate();
    const locationState: CORP_REGISTER.LocationState = location?.state || {};
    const inviteKey = locationState?.inviteParams?.inviteKey;
    const isLinkRegister = !!inviteKey;

    const { run: login } = useRequest(services.login.login, {
        manual: true
    });
    const { getInviteKeyInfo } = useCorpRegister();

    /**
     * 正常注册:
     * 1. 跳转到注册结果页
     *
     * 链接注册:
     * 1. 登录
     * 2. 加入租户
     */
    const onRegisterCb = async (userinfo: { account: string; password: string }) => {
        if (isLinkRegister) {
            const data = await login({ account: userinfo.account, password: userinfo.password });
            await getInviteKeyInfo({
                param: inviteKey,
                userId: data.userId // todo 目前后端接口没有返回
            });
        } else {
            navigate('/register/result', {
                state: { userinfo }
            });
        }
    };

    return (
        <div className={styles.register}>
            {isLinkRegister && (
                <div className={styles.inviteInfo}>
                    <span className={styles.emphasis}>{locationState?.inviteInfo?.inviteUsername}</span> 邀请您加入
                    <span className={styles.emphasis}>【{locationState?.inviteInfo?.corpName}】</span>租户
                </div>
            )}
            <PersonalForm onReigsterCb={onRegisterCb} />
            <div
                className={styles.back}
                onClick={() => {
                    userNavigete('/login');
                }}>
                <Icon component={LeftArrowIcon} className={styles.icon} />
                返回
            </div>
        </div>
    );
};
