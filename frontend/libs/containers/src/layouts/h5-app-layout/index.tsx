import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { SafeArea } from 'antd-mobile';
import { GlobalWapper } from '../../global-wapper';

import styles from './index.module.less';
import { ErrorBoundary } from '@xm/components';
import { useConversationContext } from '@xm/context';

export const H5AppLayout = () => {
    const {
        conversationState: { mainLayoutKey }
    } = useConversationContext();
    const mainRef = useRef<HTMLDivElement>(null);

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

    return (
        <GlobalWapper key={mainLayoutKey}>
            <div className={styles.h5AppLayout}>
                <div className={styles.header}>
                    <SafeArea position="top" />
                </div>
                <div ref={mainRef} className={styles.content}>
                    <ErrorBoundary>
                        <ConfigProvider
                            getPopupContainer={(node) => {
                                // 挂载在main上（其他的兜底感觉没有实际效果只是不会报错）
                                if (mainRef?.current) {
                                    return mainRef?.current;
                                }
                                return document.body;
                            }}>
                            <Outlet />
                        </ConfigProvider>
                    </ErrorBoundary>
                </div>
                <div className={styles.tail}>
                    <SafeArea position="bottom" />
                </div>
            </div>
        </GlobalWapper>
    );
};
