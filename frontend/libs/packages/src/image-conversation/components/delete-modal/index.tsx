import { useState } from 'react';
import { Modal, Button, message } from 'antd';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';

import styles from './index.module.less';

import type { IImageData } from '../..';

interface IDeleteModalProps {
    data: IImageData;
    index?: number;
    open?: boolean;
    onOk?: (data: IImageData) => void;
    onCancel?: () => void;
}
const DeleteModal = (props: IDeleteModalProps) => {
    const { data, open, onOk, onCancel } = props;
    const [deleteLoading, setDeleteLoading] = useState(false);

    const {
        data: delImageTaskData,
        loading: delImageTaskLoading,
        run: delImageTask,
        error: delImageTaskError
    } = useRequest(services.imageConversation.del, {
        manual: true,
        onSuccess: async (res: any) => {
            console.log('删除会话成功');
            await onOk?.(data);

            setDeleteLoading(false);
            // message.info('删除会话成功！');
        },
        onError: () => {
            setDeleteLoading(false);
        }
    });

    const handleOnCancel = () => {
        onCancel?.();
    };

    const handleOnOk = () => {
        if (data?.messageId) {
            setDeleteLoading(true);
            delImageTask({
                messageId: data.messageId
            });
        }
    };

    return (
        // <div className={styles['delete-modal']}>
        <Modal
            wrapClassName={styles['delete-modal']}
            centered
            width={368}
            title={<div style={{ textAlign: 'center' }}>删除</div>}
            closeIcon={<></>}
            open={open}
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
        // </div>
    );
};

export default DeleteModal;
