/**
 * 删除二次确认弹窗
 */
import { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Button } from 'antd';
import cl from 'classnames';
import styles from './index.module.less';

interface IDeleteModalProps {
    open: boolean;
    content?: string | React.ReactNode;
    title?: string;
    cancelText?: string;
    okText?: string;
    width?: number;
    contentClass?: string;
    onOk: () => void;
    onCancel: () => void;
}

export const DeleteModal = forwardRef((props: IDeleteModalProps, ref: any) => {
    const { open, content, title, cancelText, okText, width, contentClass, onOk, onCancel } = props;
    const [deleteLoading, setDeleteLoading] = useState(false);

    useImperativeHandle(ref, () => {
        return {
            _closeLoading() {
                setDeleteLoading(false);
            }
        };
    });

    const handleOnOk = () => {
        setDeleteLoading(true);
        onOk();
    };

    return (
        <Modal
            wrapClassName={styles['delete-modal']}
            centered
            width={width ? width : 368}
            title={<div style={{ textAlign: 'center' }}>{title ? title : '删除'}</div>}
            closeIcon={false}
            open={open}
            zIndex={10002}
            onCancel={onCancel}
            destroyOnClose={true}
            footer={[
                <Button className={styles.cancel} key="cancel" onClick={onCancel}>
                    {cancelText ? cancelText : '取消'}
                </Button>,
                <Button className={styles.save} loading={deleteLoading} type="primary" key="link" onClick={handleOnOk}>
                    {okText ? okText : '确认'}
                </Button>
            ]}>
            <div className={cl(styles.content, { [props.contentClass as string]: !!contentClass })}>
                {content ? content : '您确定要删除此内容吗？'}
            </div>
        </Modal>
    );
});
