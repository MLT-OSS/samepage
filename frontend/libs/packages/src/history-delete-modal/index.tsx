import { useState } from 'react';
import { Modal, Button } from 'antd';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';

import styles from './index.module.less';

import type { HISTORY_LOG } from '@/types';
import { useConversationContext } from '@xm/context';

interface IDeleteModalProps {
    data?: HISTORY_LOG.Item;
    open?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}
export const HistoryDeleteModal = (props: IDeleteModalProps) => {
    const { data, open, onOk, onCancel } = props;
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const model = modelInfo?.key;
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { run: delHistory } = useRequest(services.conversation.delConv, {
        manual: true,
        onSuccess: (res: any) => {
            console.log('删除会话成功');
            setDeleteLoading(false);
            onOk?.();
        },
        onError: () => {
            setDeleteLoading(false);
        }
    });

    const handleOnCancel = () => {
        onCancel?.();
    };

    const handleOnOk = () => {
        if (data?.conversationId) {
            setDeleteLoading(true);
            delHistory({
                key: model as string,
                convId: data.conversationId
            });
        }
    };

    return (
        <Modal
            wrapClassName={styles['delete-modal']}
            centered
            width={368}
            title={<div style={{ textAlign: 'center' }}>删除</div>}
            closeIcon={<></>}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            footer={[
                <Button className={styles.cancel} key="cancel" onClick={handleOnCancel}>
                    取消
                </Button>,
                <Button className={styles.save} loading={deleteLoading} type="primary" key="copy" onClick={handleOnOk}>
                    删除
                </Button>
            ]}>
            <div className={styles.content}>您确定要删除此对话吗？</div>
        </Modal>
    );
};
