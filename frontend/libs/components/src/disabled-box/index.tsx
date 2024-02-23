import { ReactNode } from 'react';
import styles from './index.module.less';
import classNames from 'classnames';

interface DisabledBoxProps {
    disabled?: boolean;
    children: ReactNode;
}
export const DisabledBox: React.FC<DisabledBoxProps> = (props) => {
    const { disabled = false } = props;
    return (
        <div className={styles.disabledBox}>
            <div className={classNames(styles.innerBox, { [styles.disabled]: disabled })}>{props.children}</div>
        </div>
    );
};
