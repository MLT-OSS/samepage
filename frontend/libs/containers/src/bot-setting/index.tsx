import { Button } from 'antd';
import { getPlaygroundDefaultUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.less';

export const BotSetting = () => {
    const navigate = useNavigate();
    const onHandleClick = async () => {
        const url = await getPlaygroundDefaultUrl();
        window.open(url, '_blank');
    };

    const onHandleGoHome = () => {
        navigate('/');
    };
    return (
        <div className={styles.botSetting}>
            <div className={styles.botSettingContent}>
                <div className={styles.title}>暂无机器人，请先添加机器人</div>
                <Button type="primary" onClick={onHandleClick}>
                    去添加机器人
                </Button>
                <div>
                    <Button type="link" onClick={onHandleGoHome}>
                        我已添加，去使用
                    </Button>
                </div>
            </div>
        </div>
    );
};
