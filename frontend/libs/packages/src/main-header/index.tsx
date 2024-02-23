/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * main-layout/doc-chat-layout 里面的 header
 */
import styles from './index.module.less';
import classNames from 'classnames';
import { UserInfoDropdown } from '../user-info-dropdown';
import { CorpTag } from '../corp-tag';
import { HeaderLogo } from '../header-logo';
import React from 'react';
import { HeaderCloseBtn } from '../header-close-btn';
import { isExtension } from '@/utils';
import { JumpToDesktop } from '../jump-to-desktop';
import { MainLayoutWrapper } from '../main-layout-wrapper';
import { ApproveMessage } from '../approve-message';
import { HeaderSettingBtn } from '../header-setting-btn';

interface MainHeaderProps {
    onHeaderLogoClick?: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = (props) => {
    const { onHeaderLogoClick } = props;

    return (
        <MainLayoutWrapper>
            <div className={classNames('_ml_xm_header', styles.mainHeader)}>
                <HeaderLogo onClick={onHeaderLogoClick} style={onHeaderLogoClick ? { cursor: 'pointer' } : {}} />
                <div className={styles.right}>
                    {/* <CorpTag /> */}

                    {isExtension && <JumpToDesktop />}
                    <ApproveMessage />
                    {isExtension && <HeaderSettingBtn />}
                    <UserInfoDropdown />
                    <HeaderCloseBtn />
                </div>
            </div>
        </MainLayoutWrapper>
    );
};
