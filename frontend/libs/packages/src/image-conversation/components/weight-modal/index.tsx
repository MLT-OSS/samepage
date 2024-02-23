import { useState } from 'react';
import { Button, Modal, Form, Slider } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as TipIcon } from '@/assets/images/tip.svg';
import useRequest from '@ahooksjs/use-request';

import styles from './index.module.less';
import services from '@xm/services';

interface IWeightModalProps {
    imgUrl?: string;
    onDelete?: () => void;
    onConfirm?: (imageWeight: number) => void;
    children?: React.ReactNode;
}
const WeightModal = (props: IWeightModalProps) => {
    const { imgUrl, onConfirm, onDelete, children } = props;
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [showWeight, setShowWeight] = useState('');
    const { run: defaultSetting } = useRequest(services.imageConversation.defaultSetting, {
        manual: true,
        onSuccess: async (res, req) => {
            form.setFieldValue('imageWeight', res.imageWeight);
            setShowWeight(formatter(res.imageWeight));
        }
    });
    const onSettingClick = () => {
        setOpen(true);
        defaultSetting();
    };
    const formatter = (value?: number) => `${Math.round(((value || 0) / 2) * 100)}%`;
    const handleChange = (value: number) => {
        setShowWeight(formatter(value));
    };
    const handleSave = () => {
        if (onConfirm) onConfirm(form.getFieldValue('imageWeight'));
        setOpen(false);
    };
    const handleDelete = () => {
        onDelete?.();
        setOpen(false);
    };
    return (
        <div className={styles['weight-setting']}>
            <div onClick={onSettingClick}>
                {children ? (
                    children
                ) : (
                    <Button type="text" size="small" className="setting-img-btn">
                        设置
                    </Button>
                )}
            </div>
            <Modal
                wrapClassName={styles['setting-modal']}
                width={400}
                title={<div style={{ textAlign: 'center' }}>设置</div>}
                open={open}
                centered
                closeIcon={false}
                footer={[
                    <div className={styles.settingFooter} key={'setting-modal-footer'}>
                        {onDelete && (
                            <div className={styles.delete} onClick={handleDelete}>
                                删除
                            </div>
                        )}
                        <div>
                            <Button className={styles.cancel} onClick={() => setOpen(false)}>
                                取消
                            </Button>
                            <Button className={styles.save} type="primary" onClick={handleSave}>
                                保存
                            </Button>
                        </div>
                    </div>
                ]}>
                <div className={styles.content}>
                    <div className="img-weight-box">
                        <div className="img-box">
                            <img src={imgUrl} className="img" alt="" />
                        </div>
                        <div className="right-box">
                            <div className="text-box">
                                图像强度： <span className="em">{showWeight}</span>
                            </div>
                            <Form
                                form={form}
                                initialValues={{
                                    imageWeight: 0
                                }}>
                                <Form.Item name="imageWeight">
                                    <Slider
                                        trackStyle={{ height: 6, backgroundColor: '#CBCBFF' }}
                                        railStyle={{ height: 6, backgroundColor: '#F0F0F0' }}
                                        onChange={handleChange}
                                        min={0}
                                        max={2}
                                        step={0.02}
                                        tooltip={{ formatter }}
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div className="sub-text">
                        <Icon className="tip-icon" component={TipIcon} />
                        数值越大，生成结果与原图象相似度越高
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WeightModal;
