import { ENV } from '@/utils';

import styles from './index.module.less';
export const PlatformDemo = () => {
    return <div className={styles.demo}>{`${ENV?.NX_PLATFORM}-warpper`}</div>;
};
