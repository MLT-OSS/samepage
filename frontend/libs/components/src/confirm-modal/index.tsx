import { Modal } from 'antd';
import cl from 'classnames';
import React from 'react';

import styles from './index.module.less';

interface PropsType {
    title?: string;
    content: React.ReactNode;
    open: boolean;
    cancelText?: string;
    okText?: string;
    closable?: boolean;
    contentClass?: string;
    onCancel: () => void;
    onOk: () => void;
}

const { confirm } = Modal;

export const openConfirmModal = (props: Partial<PropsType>) => {
    return confirm({
        ...props,
        title: null,
        centered: true,
        width: 368,
        zIndex: 5000,
        closeIcon: null,
        className: styles['confirm-tip-modal'],
        cancelText: props.cancelText || '取消',
        okText: props.okText || '确定',
        content: (
            <>
                <div className={styles.title}>{props.title}</div>
                <div className={cl(styles.content, props.contentClass)}>{props.content}</div>
            </>
        )
    });
};
