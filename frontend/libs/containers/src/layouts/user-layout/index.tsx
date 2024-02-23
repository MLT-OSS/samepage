/**
 * 登录相关 layout
 */
import styles from './index.module.less';
import Icon from '@ant-design/icons';
import { ReactComponent as LogoIcon } from '@/assets/images/logo/logo.svg';
import { UserHeader } from '@xm/packages';
import classNames from 'classnames';
import { Outlet } from 'react-router-dom';
import React from 'react';

interface UserLayoutProps {
    hideLogo?: boolean;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ hideLogo = false }) => {
    return (
        <div className={classNames('_ml_xm_layout', styles.userLayout)}>
            <UserHeader />
            <div className={classNames('_ml_xm_body', styles.body)}>
                {!hideLogo && (
                    <div className={styles.logoBox}>
                        <Icon component={LogoIcon} className={styles.logo} />
                    </div>
                )}
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
