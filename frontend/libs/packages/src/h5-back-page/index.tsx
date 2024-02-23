import React from 'react';
import { NavBar } from '@xm/components';

import type { INavBarProps } from '@xm/components';

import styles from './index.module.less';

interface IH5BackPageProps extends Omit<INavBarProps, 'children'> {
    children?: React.ReactNode;
    title?: React.ReactNode;
    onBack?: () => void;
    open?: boolean;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
}

export const H5BackPage = (props: IH5BackPageProps) => {
    const { title = '', onBack, open, children, style, contentStyle, ...navBarProps } = props;
    return (
        <div className={styles.h5BackPage} style={{ ...style }}>
            <NavBar {...navBarProps}>{title}</NavBar>
            <div className={styles.content} style={{ ...contentStyle }}>
                {children}
            </div>
        </div>
    );
};
