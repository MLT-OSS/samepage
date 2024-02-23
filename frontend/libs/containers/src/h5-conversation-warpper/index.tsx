/**
 * H5 主页面 “Layout”
 *
 * H5 用户中心/模型商店的切换是用的 hash 的方式
 * 主页面的 layout 包括 用户中心/模型商店功能
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { H5ConversationHeader, H5BackPage, RobotShop, H5UserCenter, H5HeaderUser } from '@xm/packages';
import { useLang } from '@xm/hooks';
import { isMini } from '@/utils';
import { NavBar } from '@xm/components';
import { ReactComponent as LogoIcon } from '@/assets/images/logo-home.svg';

import { ReactComponent as BackIcon } from '@/common/assets/images/h5/back.svg';

import styles from './index.module.less';

interface IH5ConversationProps {
    children: React.ReactNode;
    pageType?: 'main' | 'expired'; // 页面类型
}

export const H5ConversationWarpper = (props: IH5ConversationProps) => {
    const { pageType = 'main' } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [lang, setLang] = useLang();
    const [robotShopOpen, setRobotShopOpen] = useState(false);
    const [userCenterOpen, setUserCenterOpen] = useState(false);
    const handleRobotShopOpen = () => {
        navigate('#/rebot-shop');
    };
    const handleRobotShopClose = () => {
        navigate('#', {
            replace: true
        });
    };
    const handleUserCenterOpen = () => {
        navigate('#/user-center');
    };
    const handleUserCenterClose = () => {
        navigate('#', {
            replace: true
        });
    };

    const handleBackMini = () => {
        wx.miniProgram.navigateBack();
    };

    useEffect(() => {
        switch (location.hash) {
            case '#/rebot-shop':
                setRobotShopOpen(true);
                break;
            case '#/user-center':
                setUserCenterOpen(true);
                break;
            default:
                setRobotShopOpen(false);
                setUserCenterOpen(false);
                break;
        }
    }, [location.hash]);

    return (
        <div className={styles.h5Conversation}>
            <div className={styles.header}>
                {pageType === 'main' && (
                    <H5ConversationHeader
                        lang={lang}
                        langChnage={setLang}
                        onModelsClick={handleRobotShopOpen}
                        onUserClick={handleUserCenterOpen}
                    />
                )}
                {pageType === 'expired' && (
                    <NavBar rightIcon={<H5HeaderUser onClick={handleUserCenterOpen} />}>
                        <div className={styles.title}>
                            <LogoIcon className={styles.icon} />
                            Samepage助理
                        </div>
                    </NavBar>
                )}
            </div>
            <div className={styles.content}>
                {React.Children.map(props.children, (child) => {
                    if (!React.isValidElement(child)) {
                        return null;
                    } else {
                        return React.cloneElement(child as React.ReactElement<any>, { langConfig: { lang, setLang } });
                    }
                })}
            </div>
            {robotShopOpen && (
                <div className={['xm-h5-conversation-fixed'].join(' ')}>
                    <H5BackPage leftIcon={<BackIcon onClick={handleRobotShopClose} />} title="全部大模型">
                        <RobotShop
                            open={robotShopOpen}
                            showFiexd={false}
                            showFilter={false}
                            onClose={handleRobotShopClose}
                        />
                    </H5BackPage>
                </div>
            )}
            {userCenterOpen && (
                <div className={['xm-h5-conversation-fixed'].join(' ')}>
                    <H5BackPage leftIcon={<BackIcon onClick={handleUserCenterClose} />} title="设置">
                        <H5UserCenter />
                    </H5BackPage>
                </div>
            )}
            {isMini && (
                <div className={styles.backMini} onClick={handleBackMini}>
                    返回到
                    <br />
                    小程序
                </div>
            )}
        </div>
    );
};
