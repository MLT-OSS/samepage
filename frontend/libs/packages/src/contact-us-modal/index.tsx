import { Button, Modal, message } from 'antd';
import styles from './index.module.less';
import emailSrc from '@/assets/images/email.svg';
import copy from 'copy-to-clipboard';
import React from 'react';
import { SERVICE_QR_CODE_PATH } from '@/constants';

interface ContactUsModalProps {
    onClose: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = (props) => {
    const { onClose } = props;
    const handleCopy = () => {
        copy('xiaomingservice@gmail.com');
        message.success('已复制到剪切板');
    };

    return (
        <Modal
            title="联系我们"
            wrapClassName={styles.customModal}
            open
            footer={null}
            width={560}
            centered
            onCancel={onClose}>
            <div className="concat-content">
                <div className="top-text">
                    如您遇到BUG或有未满足的需求，可通过扫码进入<span>客服群</span>或<span>电子邮件</span>
                    进行反馈。
                </div>
                <div className="concat-box">
                    <div className="erwei-qr">
                        <img className="er-img" src={SERVICE_QR_CODE_PATH} alt="logo" />
                    </div>
                    <div className="right-box">
                        <div className="input-box">
                            <img className="email" src={emailSrc} alt="logo" />
                            <span className="text">xiaomingservice@gmail.com</span>
                        </div>
                        <Button className="copy-btn" type="primary" onClick={handleCopy}>
                            <span />
                            <span>复制</span>
                            <span />
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
