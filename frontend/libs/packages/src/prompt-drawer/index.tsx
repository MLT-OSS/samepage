import styles from './index.module.less';
import { Drawer } from 'antd';
import cl from 'classnames';

import type { CUE_WORD } from '@/types';
import { isH5 } from '@/utils';

import { IconWapper } from '@xm/components';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { PromptScrollTabs } from '../prompt-scroll-tabs';
import Icon from '@ant-design/icons';

export const PromptDrawer = (props: CUE_WORD.IPromptDrawerProps) => {
    const { open, onClose } = props;

    return (
        <Drawer
            className={cl(styles.promptDrawer, { [styles.h5PromptDrawer]: isH5 })}
            title={isH5 ? <></> : <span className={styles['drawer-title']}>全部提示词</span>}
            placement={'bottom'}
            closable={false}
            closeIcon={<CloseIcon />}
            onClose={onClose}
            destroyOnClose={true}
            open={open}
            rootStyle={{ outline: 'none' }}
            extra={
                isH5 ? (
                    <></>
                ) : (
                    <IconWapper>
                        <Icon component={CloseIcon} onClick={onClose} />
                    </IconWapper>
                )
            }
            height={'auto'}
            contentWrapperStyle={{
                height: '80%',
                maxHeight: '960px',
                borderRadius: '20px 20px 0px 0px'
            }}
            headerStyle={
                isH5
                    ? { padding: 0, borderBottom: 0 }
                    : {
                          textAlign: 'center',
                          color: 'rgba(0, 0, 0, 0.75)',
                          fontWeight: 600,
                          borderBottom: '1px solid #f3f3f3'
                      }
            }
            bodyStyle={{
                padding: 0,
                overflow: 'hidden'
            }}
            getContainer={false}>
            <div className={cl(styles.promptTabsWrap, { [styles.h5Wrap]: isH5 })}>
                <PromptScrollTabs {...props} />
                {isH5 && (
                    <div className={styles['bottom-cancle-btn']} onClick={onClose}>
                        取消
                    </div>
                )}
            </div>
        </Drawer>
    );
};
