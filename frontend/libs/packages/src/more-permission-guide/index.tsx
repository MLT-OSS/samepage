import { App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getPlaygroundDefaultUrl } from '@/utils';

import styles from './index.module.less';

interface MorePermissionGuideProps {
    hide?: boolean;
}

export const MorePermissionGuide: React.FC<MorePermissionGuideProps> = (props) => {
    const navigate = useNavigate();
    const { message } = App.useApp();

    const { hide = false } = props;

    if (hide) {
        return null;
    }

    const onHandleOpen = async () => {
        // message.info('敬请期待');
        // navigate('/bot-setting');
        const url = await getPlaygroundDefaultUrl();
        window.open(url, '_blank');
    };

    return (
        <>
            <div className={styles.guideText}>
                如需更多机器人，请
                <span onClick={onHandleOpen} style={{ color: '#7171EE', cursor: 'pointer' }}>
                    点击添加
                </span>
            </div>
        </>
    );
};
