import Icon from '@ant-design/icons';
import styles from './index.module.less';

interface IH5ActionOptionsItemProps {
    // 前缀
    prefixIcon?: React.ReactNode;
    // 后缀
    suffixIcon?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
}

export const H5ActionOptionsItem = (props: IH5ActionOptionsItemProps) => {
    const { prefixIcon, suffixIcon, children } = props;
    return (
        <div className={styles.h5ActionOptionsItem} onClick={props?.onClick}>
            {prefixIcon && <div className={`${styles.prefix} ${styles.icon}`}>{prefixIcon}</div>}
            <div className={styles.content}>{children}</div>
            {suffixIcon && <div className={`${styles.suffix} ${styles.icon}`}>{suffixIcon}</div>}
        </div>
    );
};
