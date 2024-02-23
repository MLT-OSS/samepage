import { Drawer, Input, Tabs, InputProps, Empty } from 'antd';
import { IconWapper } from '@xm/components';
import Icon from '@ant-design/icons';
import { RobotShop } from '../robot-shop';

import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';

import styles from './index.module.less';

import type { IRobotShopProps } from '@/types';

export const RobotShopDrawer = (props: IRobotShopProps) => {
    const { open, onClose } = props;
    return (
        <Drawer
            className={styles['robot-shop-drawer']}
            title={<span className={styles['drawer-title']}>全部大模型</span>}
            placement={'bottom'}
            closable={false}
            destroyOnClose={true}
            closeIcon={<CloseIcon />}
            onClose={onClose}
            open={open}
            extra={
                <IconWapper>
                    <Icon component={CloseIcon} onClick={onClose} />
                </IconWapper>
            }
            height={'auto'}
            rootStyle={{ outline: 'none' }}
            contentWrapperStyle={{
                height: '80%',
                maxHeight: '960px',
                borderRadius: '20px 20px 0px 0px'
            }}
            headerStyle={{
                textAlign: 'center',
                color: 'rgba(0, 0, 0, 0.75)',
                fontWeight: 600,
                borderBottom: '1px solid #f3f3f3',
                borderRadius: '20px 20px 0px 0px'
            }}
            bodyStyle={{
                padding: 0,
                overflow: 'hidden'
            }}>
            <RobotShop {...props} />
        </Drawer>
    );
};
