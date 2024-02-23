/**
 * login 应用的 layout
 */
import queryString from 'query-string';
import { Navigate, useLocation } from 'react-router-dom';
import { STORAGE_LOGIN_SEARCH } from '@/constants';
import { GlobalWapper } from '../../global-wapper';
import { UserLayout } from '../user-layout';
import styles from './index.module.less';
import React, { useEffect } from 'react';

interface LoginAppLayoutProps {
    hideLogo?: boolean;
}

export const LoginAppLayout: React.FC<LoginAppLayoutProps> = ({ hideLogo }) => {
    const location = useLocation();

    const searchParams = queryString.parse(location?.search);

    // 将来自 extension 的 search 存入 sessionStorage 登陆成功后解析使用
    if (searchParams?.platform === 'extension') {
        sessionStorage.setItem(STORAGE_LOGIN_SEARCH, location?.search);
    }

    useEffect(() => {
        const _resize = () => {
            // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
            const vh = window.innerHeight * 0.01;
            // Then we set the value in the --vh custom property to the root of the document
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        _resize();

        // We listen to the resize event
        window.addEventListener('resize', _resize);

        return () => {
            // Remove event listener on cleanup
            window.removeEventListener('resize', _resize);
        };
    }, []);

    // 重定向
    if (['/'].includes(location?.pathname)) {
        Navigate({
            to: '/login',
            replace: true
        });
        return null;
    }
    return (
        <div className={styles.loginLayout}>
            <GlobalWapper>
                <div className={styles.wapper}>
                    <UserLayout hideLogo={hideLogo} />
                </div>
            </GlobalWapper>
        </div>
    );
};
