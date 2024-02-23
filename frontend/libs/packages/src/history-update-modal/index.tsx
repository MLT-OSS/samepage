import { Modal, Button, Form, Input, App } from 'antd';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';

import styles from './index.module.less';

import type { HISTORY_LOG } from '@/types';
import { useEffect } from 'react';
import { useConversationContext } from '@xm/context';

interface IUpdateTitleModalProps {
    data?: HISTORY_LOG.Item;
    open?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
}
export const HistoryUpdateModal = (props: IUpdateTitleModalProps) => {
    const { data, open, onOk, onCancel } = props;
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const model = modelInfo?.key;
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const { loading: updateTitleLoading, run: updateTitle } = useRequest(services.conversation.updateConvInfo, {
        manual: true,
        onSuccess: (res: any) => {
            onOk?.();
            form.resetFields();
            message.success('更新标题成功！');
        }
    });

    const handleOnCancel = () => {
        onCancel?.();
    };

    const handleOnOk = async () => {
        if (data?.conversationId) {
            form.validateFields()
                .then((values) => {
                    console.log(values, 'values');
                    const { title } = values;
                    updateTitle({
                        key: model as string,
                        conversationId: data?.conversationId,
                        title: (title as string).trim()
                    });
                })
                .catch((info) => {
                    console.log('Validate Failed:', info);
                });
        }
    };

    useEffect(() => {
        if (data?.title) {
            form.setFieldValue('title', data?.title);
        }
    }, [data?.title, form]);

    return (
        <Modal
            wrapClassName={styles['update-title-modal']}
            width={400}
            title={<div style={{ textAlign: 'center' }}>修改标题</div>}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            centered
            closeIcon={<CloseIcon />}
            footer={[
                <Button className={styles.cancel} key="cancel" onClick={handleOnCancel}>
                    取消
                </Button>,
                <Button
                    className={styles.save}
                    loading={updateTitleLoading}
                    type="primary"
                    key="save"
                    onClick={handleOnOk}>
                    保存
                </Button>
            ]}
            maskClosable={false}>
            <div className={styles.content}>
                <Form form={form} layout="vertical" name="form_in_modal" initialValues={{ modifier: 'public' }}>
                    <Form.Item
                        name="title"
                        label="新标题"
                        required={false}
                        rules={[
                            { whitespace: true },
                            { required: true, message: '请输入新标题!' },
                            { max: 40, message: '标题最长为40字符!' }
                        ]}>
                        <Input placeholder="请输入新标题" />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};
