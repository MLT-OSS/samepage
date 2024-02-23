/**
 * 机器人无权限模态框
 */
import { useConversationContext } from '@xm/context';
import { Modal, ModalProps, Button } from 'antd';
import React from 'react';

interface RobotUnauthModalProps extends ModalProps {
    onConfirm?: () => void;
}
export const RobotUnauthModal: React.FC<RobotUnauthModalProps> = (props) => {
    const { onConfirm: propsOnConfirm, ...rest } = props;
    const { dispatch } = useConversationContext();

    const onClose = () => {
        dispatch({
            type: 'p_robot_unauth_show',
            payload: {
                robotUnauthShow: false
            }
        });
    };

    const onConfirm = async () => {
        propsOnConfirm?.();
        onClose();
    };

    return (
        <div>
            <Modal
                open
                getContainer={false}
                width={368}
                title={<div style={{ textAlign: 'center' }}>提示</div>}
                footer={[
                    <Button type="primary" key="link" onClick={onConfirm}>
                        确定
                    </Button>
                ]}
                centered
                closable={false}
                {...rest}>
                <div style={{ padding: '20px 0' }}>无该模型权限，请联系管理员～</div>
            </Modal>
        </div>
    );
};
