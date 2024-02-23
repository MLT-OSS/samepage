import styles from './index.module.less';

import type { PropsWithChildren, CSSProperties } from 'react';

interface IIconWapperProps extends PropsWithChildren {
    style?: CSSProperties;
}

export const IconWapper = (props: IIconWapperProps) => {
    const { style, children } = props;
    return (
        <span className={styles['icon-wapper']} style={{ ...style }}>
            {children}
        </span>
    );
};
