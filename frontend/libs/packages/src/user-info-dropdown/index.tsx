/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * header 右侧的用户信息弹窗
 */
import { ReactComponent as User } from '@/assets/images/user.svg';
import Icon from '@ant-design/icons';
import styles from './index.module.less';
import { useNavigate } from 'react-router-dom';
import { useConversationContext } from '@xm/context';
import classNames from 'classnames';
import { MenuProps, Typography } from 'antd';
import { useLogout } from '@xm/hooks';
import React from 'react';
import { isExtension, VERSION_VALUE, ENV, getLoginUrl } from '@/utils';
import { ReactComponent as helpIcon } from '@/assets/images/user/help.svg';
import { ReactComponent as exitIcon } from '@/assets/images/user/exit.svg';
import { ReactComponent as rightIcon } from '@/assets/images/right.svg';
import { TUTORIALS_PATH } from '@/constants';
import { XmDropdown } from '@xm/components';

const { Text } = Typography;
const { NX_PLATFORM, NX_HOME_DOMAIN } = ENV;

const DROPDOWN_MENU_OPTIONS = [
    { key: 'tutorial', icon: helpIcon, text: '使用教程' },
    { key: 'logout', icon: exitIcon, text: '退出登录' }
];

export const UserInfoDropdown = () => {
    const { logout, clean } = useLogout();
    const navigate = useNavigate();

    const {
        conversationState: { userinfo }
    } = useConversationContext();

    const onMenuClick: MenuProps['onClick'] = async ({ key, domEvent }) => {
        if (key === 'tutorial') {
            const tutorialUrl = isExtension ? `${NX_HOME_DOMAIN}${TUTORIALS_PATH}` : TUTORIALS_PATH;
            window.open(tutorialUrl, '_blank');
            return;
        }
        if (key === 'logout') {
            await logout({});

            // 插件：clean storage 和 memory
            // 网页：clean storage
            if (isExtension) {
                await clean();
                navigate('/user/login');
            } else {
                await clean(['storage']);
                const _loginUrl = await getLoginUrl();
                window.location.href = `${_loginUrl}?target=${NX_PLATFORM}`;
            }
            return;
        }
    };

    // todo 邮箱过长的展示
    const dropdownItems: MenuProps['items'] = DROPDOWN_MENU_OPTIONS.map(({ key, icon, text: _text }) => {
        let text = _text;
        return {
            key,
            label: (
                <div className={classNames(styles.dropdownItem)}>
                    <Icon component={icon} className={styles.icon} />
                    <div className={styles.text}>
                        <Text
                            style={{ maxWidth: 150 }}
                            ellipsis={{
                                tooltip: {
                                    getPopupContainer: (node) => {
                                        return (node.parentNode ?? document.body) as any;
                                    },
                                    title: text
                                }
                            }}>
                            {text}
                        </Text>
                    </div>
                    <span className={styles.right}>
                        <Icon component={rightIcon} className={styles.icon} />
                    </span>
                </div>
            )
        };
    });

    return (
        <>
            <XmDropdown
                menu={{
                    items: dropdownItems,
                    onClick: onMenuClick
                }}
                dropdownRender={(menu) => (
                    <div className={styles.dropdownContainer}>
                        <div className={styles.dropdownHeader}>
                            <div className={styles.userInfo}>
                                <Icon component={User} className={styles.avatar} />
                                <div className={styles.info}>
                                    <div className={styles.username}>
                                        <Text
                                            style={{ width: 96 }}
                                            ellipsis={{
                                                tooltip: {
                                                    getPopupContainer: (node) => {
                                                        return (node.parentNode ?? document.body) as any;
                                                    },
                                                    title: userinfo?.name ?? '-'
                                                }
                                            }}>
                                            {userinfo?.name ?? '-'}
                                        </Text>
                                    </div>
                                    <div className={styles.mail}>{userinfo?.mail ?? '-'}</div>
                                </div>
                            </div>
                        </div>
                        {React.cloneElement(menu as React.ReactElement)}
                        {!!VERSION_VALUE && <div className={styles.version}>当前版本 v{VERSION ?? VERSION_VALUE}</div>}
                    </div>
                )}
                trigger={['click']}
                overlayStyle={{ zIndex: 10001 }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Icon component={User} className={styles.userIcon} />
                </a>
            </XmDropdown>
        </>
    );
};
