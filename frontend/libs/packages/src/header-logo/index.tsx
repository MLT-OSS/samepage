/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * header 左侧 logo
 */
import { ReactComponent as Logo } from '@/assets/images/logo-home.svg';
import Icon from '@ant-design/icons';
import styles from './index.module.less';
import classNames from 'classnames';
import React, { CSSProperties } from 'react';

interface HeaderLogoProps {
    onClick?: () => void;
    className?: string;
    style?: CSSProperties;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({ className, style, onClick }) => (
    <div className={classNames(styles.headerLogo, className)} style={style} onClick={onClick}>
        <Icon component={Logo} className={styles.logo} />
        <span className={styles.title}>MING</span>
    </div>
);
