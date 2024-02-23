import { useRef, useEffect } from 'react';
import { ConfigProvider, App, message } from 'antd';
import { UseRequestProvider } from '@ahooksjs/use-request';
import { getThemeConfig } from '@xm/configs';
import { isExtension } from '@/utils';
import { ResponseError, PageVisibilityChange, PreSetting } from '@xm/packages';
import { PlatformDemo } from '@xm/components';

import styles from './index.module.less';

// 引入Ant Design中文语言包
import zhCN from 'antd/locale/zh_CN';

/* eslint-disable-next-line */
export interface GlobalWapperProps {
    messageTop?: number;
    children?: React.ReactNode;
}

export function GlobalWapper(props: GlobalWapperProps) {
    const mainRef = useRef(null);
    const { messageTop = isExtension ? 48 : 8 } = props;

    useEffect(() => {
        // message 全局配置
        message.config({
            prefixCls: '__xm_message_style__',
            getContainer: () => mainRef.current!,
            top: messageTop
        });
    }, []);
    return (
        <ConfigProvider
            locale={zhCN}
            theme={getThemeConfig()}
            autoInsertSpaceInButton={false}
            getPopupContainer={(node) => {
                // 挂载在main上（其他的兜底感觉没有实际效果只是不会报错）
                if (mainRef?.current) {
                    return mainRef?.current;
                }
                // 挂载在父级上
                if (node?.parentNode) {
                    return node.parentNode as unknown as HTMLElement;
                }
                return document.body;
            }}>
            <UseRequestProvider
                value={{
                    formatResult: (res) => res?.data ?? res
                }}>
                <App
                    className={styles.app}
                    message={{
                        getContainer: () => mainRef.current!,
                        prefixCls: '__xm_message_style__',
                        top: messageTop
                    }}>
                    <ResponseError />
                    <PageVisibilityChange />
                    {/* 无用节点 测试多端打包使用 保险起见增加一层display:none节点 */}
                    <div style={{ display: 'none' }}>
                        <PlatformDemo />
                    </div>
                    <div className={styles.main} id="main-ref" ref={mainRef}>
                        {isExtension && <PreSetting />}
                        {props?.children}
                    </div>
                </App>
            </UseRequestProvider>
        </ConfigProvider>
    );
}

export default GlobalWapper;
