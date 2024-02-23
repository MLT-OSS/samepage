import Icon from '@ant-design/icons';
import { ReactComponent as DesktopIcon } from '@/assets/images/desktop.svg';
import styles from './index.module.less';
import { Tooltip } from 'antd';
import { getWebDefaultUrl } from '@/utils';

export const JumpToDesktop = () => {
    return (
        <Tooltip title="在网页中进行会话">
            <span
                className={styles.container}
                onClick={async () => {
                    const _webDefaultUrl = await getWebDefaultUrl();
                    window.open(_webDefaultUrl, '_blank');
                }}>
                <Icon component={DesktopIcon} className={styles.icon} />
            </span>
        </Tooltip>
    );
};
