import { useRef, useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, Tooltip, Spin } from 'antd';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { ImageBtn } from '@xm/components';

import { ReactComponent as SettingIcon } from '@/assets/images/setting.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { ReactComponent as InfoIcon } from '@/assets/images/tip.svg';

import type { IMAGE_CONVERSATION } from '@/types';

import styles from './index.module.less';

export interface ISettingModalProps {
    tooltipOpen?: boolean;
    initConfig?: IMAGE_CONVERSATION.IParamsConfig;
    children?: React.ReactNode;
}

const SettingModal = (props: ISettingModalProps) => {
    const { tooltipOpen, initConfig, children } = props;
    const [form] = Form.useForm();
    const settingRef = useRef(null);
    const [open, setOpen] = useState(false);

    const {
        data: getSettingData,
        loading: getSettingLoading,
        run: getSetting,
        error: getSettingError
    } = useRequest(services.imageConversation.setting, {
        manual: true,
        onSuccess: (res: IMAGE_CONVERSATION.IParamsConfig, params) => {
            const { negativeOriginal, chaos, seed, stylize } = res;
            form.setFields([
                {
                    name: 'negativeOriginal',
                    value: negativeOriginal
                },
                {
                    name: 'chaos',
                    value: chaos
                },
                {
                    name: 'seed',
                    value: seed
                },
                {
                    name: 'stylize',
                    value: stylize
                }
            ]);
        }
    });

    const {
        data: updateSettingData,
        loading: updateSettingLoading,
        run: updateSetting,
        error: updateSettingError
    } = useRequest(services.imageConversation.updateSetting, {
        manual: true,
        onSuccess: (res) => {
            form.resetFields();
            setOpen(false);
        }
    });

    const onSettingClick = () => {
        setOpen(true);
        getSetting();
    };

    const onHandleCancel = () => {
        setOpen(false);
    };

    const onHandleOk = () => {
        form.validateFields()
            .then((values) => {
                updateSetting(values);
            })
            .catch((info) => {
                console.log('Setting form validate failed:', info);
            });
    };
    return (
        <div ref={settingRef} className={styles['setting']}>
            <Tooltip
                open={tooltipOpen}
                title={`已复制配置至设置`}
                getPopupContainer={(triggerNode) => {
                    return triggerNode || (settingRef as any)?.current;
                }}>
                <div onClick={onSettingClick}>
                    {children ? children : <ImageBtn iconNode={SettingIcon}>设置</ImageBtn>}
                </div>
            </Tooltip>
            <Modal
                wrapClassName={styles['setting-modal']}
                width={400}
                title={<div style={{ textAlign: 'center' }}>设置</div>}
                open={open}
                onOk={onHandleOk}
                onCancel={onHandleCancel}
                centered
                closeIcon={<CloseIcon />}
                footer={[
                    <div className={styles['footer-wapper']} key="footer">
                        <div
                            className={styles.reset}
                            key="reset"
                            onClick={() => {
                                form.resetFields();
                            }}>
                            重置
                        </div>
                        <div>
                            <Button className={styles.cancel} key="cancel" onClick={onHandleCancel}>
                                取消
                            </Button>
                            <Button
                                className={styles.save}
                                loading={updateSettingLoading}
                                type="primary"
                                key="save"
                                onClick={onHandleOk}>
                                保存
                            </Button>
                        </div>
                    </div>
                ]}>
                <Spin spinning={getSettingLoading}>
                    <div className={styles.content}>
                        <Form
                            form={form}
                            layout="vertical"
                            // initialValues={[
                            //     {
                            //         name: 'negative',
                            //         value: initConfig?.negative
                            //     },
                            //     {
                            //         name: 'chaos',
                            //         value: initConfig?.chaos
                            //     },
                            //     {
                            //         name: 'seed',
                            //         value: initConfig?.seed
                            //     },
                            //     {
                            //         name: 'stylize',
                            //         value: initConfig?.stylize
                            //     }
                            // ]}
                        >
                            <Form.Item
                                name="negativeOriginal"
                                label="负面提示"
                                required={false}
                                initialValue={initConfig?.negativeOriginal}>
                                <Input.TextArea
                                    style={{ resize: 'none' }}
                                    rows={4}
                                    placeholder="（选填）描述您不希望图像中包含的内容"
                                />
                            </Form.Item>
                            <Form.Item
                                name="chaos"
                                label="多样性"
                                required={false}
                                initialValue={initConfig?.chaos}
                                tooltip={{
                                    title: `多样性数值越高，越能产生更多意想不到的结果和组合，越小越能产生更稳定、更有重复性的结果`,
                                    icon: <InfoIcon />
                                }}
                                rules={[
                                    { type: 'number', max: 100, message: '多样性数值最大为100!' },
                                    { type: 'number', min: 0, message: '多样性数值最小为0!' }
                                ]}>
                                <InputNumber className={styles.number} placeholder="请填写0-100的数字" />
                            </Form.Item>
                            <Form.Item
                                name="seed"
                                label="随机种子"
                                required={false}
                                initialValue={initConfig?.seed}
                                tooltip={{
                                    title: `我们会为每个图像随机生成种子编号，您可使用相同种子编号和提示词，让生成的图像更相似`,
                                    icon: <InfoIcon />
                                }}
                                rules={[
                                    { type: 'number', max: 4294967295, message: '随机种子数值最大为4294967295!' },
                                    { type: 'number', min: 0, message: '随机种子数值最小为0!' }
                                ]}>
                                <InputNumber className={styles.number} placeholder="请填写0-4294967295的数字" />
                            </Form.Item>
                            <Form.Item
                                name="stylize"
                                label="风格化"
                                required={false}
                                initialValue={initConfig?.stylize}
                                tooltip={{
                                    title: `风格化数值越高，结果的艺术性越高；数值越低，结果越接近真实图片`,
                                    icon: <InfoIcon />
                                }}
                                rules={[
                                    { type: 'number', max: 1000, message: '风格化数值最大为1000!' },
                                    { type: 'number', min: 0, message: '风格化数值最小为0!' }
                                ]}>
                                <InputNumber className={styles.number} placeholder="请填写0-1000的数字" />
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default SettingModal;
