import { useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import { navigateToChat } from '@/utils';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';

export const RegisterResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { run: loginApi } = useRequest(services.login.login, { manual: true });
    const login = async () => {
        await loginApi(location?.state?.userinfo);
    };
    const jumpToApp = async () => {
        await login();
        navigateToChat();
    };

    const registerCorp = async () => {
        await login();
        navigate('/prefect-corp-info');
    };

    return (
        <div className={styles.registerResult}>
            <div className={styles.registerSuccess}>
                <CheckCircleFilled className={styles.icon} />
                <div className={styles.info}>您已注册成功注册！</div>
                <Button type="primary" className={styles.btn} onClick={jumpToApp}>
                    开始使用
                </Button>
            </div>
        </div>
    );
};
