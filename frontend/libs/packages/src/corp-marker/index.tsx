import styles from './index.module.less';
import Icon from '@ant-design/icons';
import { ReactComponent as TriangleIcon } from '@/assets/images/triangle.svg';

export const CorpMarker = () => {
    return (
        <div className={styles.corpMarker}>
            <Icon component={TriangleIcon} className={styles.bg} />
            <span className={styles.text}>企业版</span>
        </div>
    );
};
