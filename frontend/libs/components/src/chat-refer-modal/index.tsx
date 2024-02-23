import { Modal, ModalProps } from 'antd';
import React from 'react';
import styles from './index.module.less';
import { CHAT_BUBBLE } from '@/types';

interface ChatReferModalProps extends ModalProps {
    content: CHAT_BUBBLE.IRefer['reference']['0'] | null;
}
export const ChatReferModal: React.FC<ChatReferModalProps> = (props) => {
    const { content, ...rest } = props;
    return (
        <Modal
            getContainer={false}
            width={400}
            title={<div style={{ textAlign: 'center' }}>{content?.link ? '来源' : '参考'}</div>}
            footer={null}
            centered
            {...rest}>
            <div className={styles.content}>
                <a className={styles.title} target={'_blank'} href={content?.link}>
                    <div dangerouslySetInnerHTML={{ __html: content?.title || '' }} />
                </a>
                <div dangerouslySetInnerHTML={{ __html: content?.text || '' }} />
            </div>
        </Modal>
    );
};
