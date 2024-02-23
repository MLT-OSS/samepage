import { Spin } from 'antd';
import styles from './index.module.less';

import type { SpinProps } from 'antd';

interface ITaskLoadingProps extends SpinProps {
    style?: React.CSSProperties;
}

export const TaskLoading = (props: ITaskLoadingProps) => {
    const { style, ...spinProps } = props;
    return (
        <div className={styles['task-loading']} style={{ ...style }}>
            <Spin {...spinProps} />
        </div>
    );
};
