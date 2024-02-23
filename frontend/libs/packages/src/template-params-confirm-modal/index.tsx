/**
 * 继续生成二次确认弹窗
 */
import { Modal, Button } from 'antd';
import styles from './index.module.less';

interface IConfirmModalProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}

export const TemplateParamsConfirmModal = (props: IConfirmModalProps) => {
    const { open, onOk, onCancel } = props;

    return (
        <Modal
            wrapClassName={styles['confirm-modal']}
            centered
            width={368}
            title={<div style={{ textAlign: 'center' }}>提示</div>}
            closeIcon={<></>}
            open={open}
            zIndex={10002}
            onCancel={onCancel}
            footer={[
                <Button className={styles.cancel} key="cancel" onClick={onCancel}>
                    返回修改
                </Button>,
                <Button className={styles.save} type="primary" key="copy" onClick={onOk}>
                    继续生成
                </Button>
            ]}>
            <div className={styles.content}>您输入的参数信息过长，生成内容时将无法全部带入，建议您进行删减。</div>
        </Modal>
    );
};
