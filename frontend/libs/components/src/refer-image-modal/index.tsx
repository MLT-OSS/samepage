import { Button, Modal } from 'antd';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';

import type { ModalProps } from 'antd';

import styles from './index.module.less';

interface IReferImageModalProps extends ModalProps {
    url?: string;
}

export const ReferImageModal = (props: IReferImageModalProps) => {
    const { url, children, ...modalProps } = props;
    return (
        <div>
            <Modal
                wrapClassName={styles['refer-image-modal']}
                width={400}
                title={<div style={{ textAlign: 'center' }}>参考图片</div>}
                centered
                closeIcon={<CloseIcon />}
                footer={[
                    <Button className={styles.save} type="primary" key="save" onClick={props?.onOk}>
                        重新使用
                    </Button>
                ]}
                {...modalProps}>
                <div className={styles.content}>{children}</div>
            </Modal>
        </div>
    );
};
