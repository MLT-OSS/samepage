import { Button, Layout, Dropdown } from 'antd';
import styles from './index.module.less';
import type { MenuProps } from 'antd';
import Icon, { CaretDownOutlined } from '@ant-design/icons';
import logo from '@/assets/images/home-logo.svg';
import { ReactComponent as Title } from '@/assets/images/title.svg';
import { useState } from 'react';
import { PRIVACY_POLICY_PATH, TUTORIALS_PATH, USER_POLICY_PATH } from '@/constants';
import { ContactUsModal } from '../contact-us-modal';
import { ReactComponent as ItemIcon } from '@/assets/images/item.svg';
import { H5_DEFAULT_URL, getWebDefaultUrl, FEED_BACK_URL } from '@/utils';

const { Header } = Layout;

const TUTORIALS_LABEL = '帮助中心';
const USE_WEB_LABEL = '使用网页版';
const USE_H5_LABEL = '在手机上使用Samepage';
const FEED_BACK_LABEL = '反馈';

const ABOUT_MENU_ITEMS: MenuProps['items'] = [
    // { label: '隐私协议', key: '2' },
    // { label: '用户协议', key: '3' },
    // { label: '反馈', key: '4' }
];
const MENU_ITEMS: MenuProps['items'] = [
    { label: USE_H5_LABEL, key: '0' },
    // { label: TUTORIALS_LABEL, key: '1' },
    { label: FEED_BACK_LABEL, key: '4' },
    ...ABOUT_MENU_ITEMS
];

export const HomePageHeader = () => {
    const [openModel, setOpenModel] = useState(false);

    const dumpHelp = () => {
        window.open(TUTORIALS_PATH, '_blank');
    };

    const dumpWeb = async () => {
        const _webDefaultUrl = await getWebDefaultUrl();
        window.open(_webDefaultUrl, '_blank');
    };

    const dumpH5 = () => {
        window.open(H5_DEFAULT_URL, '_blank');
    };

    const dumpFeedback = () => {
        FEED_BACK_URL && window.open(FEED_BACK_URL, '_blank');
    };

    const onMenuClick: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case '0':
                dumpH5();
                break;
            case '1':
                dumpHelp();
                break;
            case '2':
                window.open(PRIVACY_POLICY_PATH, '_blank');
                break;
            case '3':
                window.open(USER_POLICY_PATH, '_blank');
                break;
            default:
                // 联系我们
                // setOpenModel(true);
                dumpFeedback();
                break;
        }
    };

    return (
        <>
            <Header className={styles.oweHeader}>
                <div className="left">
                    <img className="logo" src={logo} />
                    <Title className="title" width={69} height={36} />
                </div>
                <div className="right">
                    <div className="pc">
                        <Button className="header-btn web" type="text" onClick={dumpWeb}>
                            {USE_WEB_LABEL}
                        </Button>
                        {/* <Button className="header-btn help" type="text" onClick={dumpHelp}>
                            {TUTORIALS_LABEL}
                        </Button> */}
                        <Button className="header-btn help" type="text" onClick={dumpFeedback}>
                            {FEED_BACK_LABEL}
                        </Button>
                        {/* <Dropdown
                            menu={{
                                items: ABOUT_MENU_ITEMS,
                                onClick: onMenuClick
                            }}
                            overlayClassName="owe-menu"
                            trigger={['click']}>
                            <Button className="header-btn about" type="text">
                                <span>关于</span>
                                <CaretDownOutlined />
                            </Button>
                        </Dropdown> */}
                    </div>
                    <div className="mobile">
                        <Dropdown
                            menu={{
                                items: MENU_ITEMS,
                                onClick: onMenuClick
                            }}
                            overlayClassName="owe-menu-mobile"
                            trigger={['click']}>
                            <Button className="header-btn" type="text">
                                <Icon component={ItemIcon} />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </Header>
            {openModel && <ContactUsModal onClose={() => setOpenModel(false)} />}
        </>
    );
};
