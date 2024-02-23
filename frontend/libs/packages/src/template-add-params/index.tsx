/**
 * 添加参数弹窗
 */
import { useEffect, useState, useRef } from 'react';
import { Drawer, Input, Button, Form } from 'antd';
import useRequest from '@ahooksjs/use-request';
import Icon from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

import styles from './index.module.less';
import { TemplateParamsHistoryLog } from '../template-params-history-log';
import { TemplateParamsConfirmModal } from '../template-params-confirm-modal';

import services from '@xm/services';
import { IconWapper } from '@xm/components';
import { useConversationContext } from '@xm/context';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { PostBotTemplateKeyCheckResponse } from '@/ytt-type/robot';
import classNames from 'classnames';
import { isH5, safeStringify } from '@/utils';
import { useModelPermission } from '@xm/hooks';

interface IAddParametersProps {
    open: boolean;
    sendMessage: (params: any) => void;
    onClose: () => void;
}

interface IParam {
    key: string;
    name: string;
    isRequired: boolean;
    placeholder?: string;
    maxLength?: number;
}

interface ITemplateForm {
    key?: string;
    value?: string;
}

type FieldType = any;

export const TemplateAddParams = (props: IAddParametersProps) => {
    const { open, onClose, sendMessage } = props;
    const { inputCheckPermission } = useModelPermission();
    const { conversationState } = useConversationContext();
    const formRef = useRef<FormInstance>(null);

    // 参数配置信息在字典接口，维护在conversationState中获取当前的modelInfo里
    const { modelInfo } = conversationState;
    const { params } = modelInfo || {};

    const [isShowHistory, setIsShowHistory] = useState<boolean>(false);
    const [templateForm, setTemplateForm] = useState<ITemplateForm[]>([]);
    const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    // check参数token是否超出限制
    const { run: checkParamToken } = useRequest(services.chatConversation.checkToken, {
        manual: true,
        onSuccess: (res: PostBotTemplateKeyCheckResponse) => {
            const { exceed } = res;
            setSubmitLoading(false);
            if (exceed) {
                setIsShowConfirm(true);
            } else {
                // check成功之后发送消息并关闭抽屉
                sendMessage(templateForm);
                onClose();
            }
        },
        onError: () => {
            setSubmitLoading(false);
        }
    });

    // token过长时，提交二次确认弹窗,确认后关闭弹窗，关闭抽屉
    const handleSubmit = () => {
        sendMessage(templateForm);
        handleCancel();
        onClose();
    };

    // token过长弹窗：关闭弹窗
    const handleCancel = () => {
        setIsShowConfirm(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
        setSubmitLoading(true);
        handleFormData(values);
    };

    // 对form表单里的数据进行处理，组合成后端接口需要的格式
    const handleFormData = (data: any) => {
        const newParamData: ITemplateForm[] = [];
        for (const key in data) {
            // eslint-disable-next-line no-prototype-builtins
            if (data.hasOwnProperty(key)) {
                newParamData.push({
                    key: key,
                    value: data[key]
                });
            }
        }
        setTemplateForm(newParamData);
        if (inputCheckPermission) {
            const arr: any = newParamData.map((i: ITemplateForm) => {
                return {
                    type: 'template',
                    value: safeStringify(i)
                };
            });
            // 提交参数form表单之前先调用check接口
            checkParamToken({
                key: modelInfo?.key as string,
                msg: arr
            });
        } else {
            setSubmitLoading(false);
            sendMessage(newParamData);
            onClose();
        }
    };

    // form表单校验不通过
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (open) {
            setIsShowHistory(false);
        }
    }, [open]);

    // 打开历史参数弹窗
    const addFromHistory = () => {
        setIsShowHistory(true);
    };

    // 关闭历史参数弹窗
    const closeFromHistory = () => {
        setIsShowHistory(false);
    };

    // 回填form表单：将数据转换为form表单允许的格式
    const backFill = (data: any) => {
        const newValues: any = {};
        data.params?.forEach((item: any) => {
            const { key, value } = item;
            newValues[key] = value;
        });
        formRef.current?.setFieldsValue(newValues);
    };
    const resetInfo = () => {
        formRef.current?.resetFields();
    };

    return (
        <>
            <Drawer
                className={styles['add-parameters-drawer']}
                title={
                    <div>
                        <span className={styles['drawer-title']}>参数</span>
                        {!!isH5 && (
                            <Button htmlType="button" type="text" className={styles.h5Reset} onClick={resetInfo}>
                                重置
                            </Button>
                        )}
                    </div>
                }
                placement={'bottom'}
                closable={false}
                maskClosable={false}
                closeIcon={<CloseIcon />}
                onClose={onClose}
                destroyOnClose={true}
                open={open}
                extra={
                    <IconWapper>
                        <Icon component={CloseIcon} onClick={onClose} />
                    </IconWapper>
                }
                height="auto"
                contentWrapperStyle={{
                    borderRadius: '20px 20px 0px 0px'
                }}
                headerStyle={{
                    textAlign: 'center',
                    color: 'rgba(0, 0, 0, 0.75)',
                    fontWeight: 600
                }}
                bodyStyle={{
                    padding: 0
                }}>
                <div className={styles['add-param-con']}>
                    <Form
                        ref={formRef}
                        name="control-ref"
                        onFinish={onFinish}
                        layout="vertical"
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        style={{ height: '100%' }}>
                        <div
                            className={classNames(styles.fields, {
                                [styles.h5Fields]: !!isH5
                            })}>
                            {params?.map((item: IParam) => {
                                const { key, isRequired, name, placeholder, maxLength } = item;
                                return (
                                    <Form.Item<FieldType>
                                        key={key}
                                        name={key}
                                        label={`${name}${isRequired ? '' : '（非必填）'}`}
                                        rules={[
                                            { required: isRequired, message: `请输入${name}`, whitespace: isRequired }
                                        ]}>
                                        <Input
                                            className={styles['input-style']}
                                            width={16}
                                            maxLength={maxLength}
                                            placeholder={placeholder ? placeholder : `请输入${name}`}
                                        />
                                    </Form.Item>
                                );
                            })}
                        </div>

                        <div className={styles['param-handle-box']}>
                            <div className={styles['handle-box-left']}>
                                <Button htmlType="button" onClick={addFromHistory} className={styles.history}>
                                    从历史参数导入
                                </Button>
                                {!isH5 && (
                                    <Button htmlType="button" className={styles.reset} onClick={resetInfo}>
                                        重置
                                    </Button>
                                )}
                            </div>
                            <div className={styles['handle-box-right']}>
                                <Button onClick={onClose} className={styles.cancel}>
                                    取消
                                </Button>
                                <Button type="primary" htmlType="submit" loading={submitLoading} className={styles.ok}>
                                    确定
                                </Button>
                            </div>
                        </div>
                    </Form>
                    {/* 历史参数 */}
                    <TemplateParamsHistoryLog
                        backFill={backFill}
                        onClose={closeFromHistory}
                        open={isShowHistory}
                        botKey={modelInfo?.key as string}
                    />
                </div>
            </Drawer>
            <TemplateParamsConfirmModal open={isShowConfirm} onCancel={handleCancel} onOk={handleSubmit} />
        </>
    );
};
