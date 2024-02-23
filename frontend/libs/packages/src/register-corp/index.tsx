/**
 * 注册临时租户
 */
import { Button, Form, Input, message } from 'antd';
import Icon from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { DisabledBox, UserPolicyCheckBox } from '@xm/components';
import { ReactComponent as CorpOutlineIcon } from '@/assets/images/corp-outline.svg';
import { ReactComponent as UserIcon } from '@/assets/images/reg/nickname.svg';
import { ReactComponent as PhoneIcon } from '@/assets/images/phone.svg';
import styles from './index.module.less';
import { VerifyCodeFormItem, VerifyCodeFormItemRef } from '../verify-code-form-item';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { useRef, useState } from 'react';

interface ICorpInfo {
    contactName: string;
    contactPhone: string;
    tenantName: string;
}

interface RegisterCorpProps {
    finishCb: (data: ICorpInfo) => void;
}

export const RegisterCorp: React.FC<RegisterCorpProps> = (props) => {
    const { finishCb } = props;
    const [form] = Form.useForm();
    // 企业名是否存在
    const [isCorpNameExist, setIsCorpNameExist] = useState<boolean>(false);
    const verifyCodeVersion = useRef<string>();
    const verifyCodeFormItemRef = useRef<VerifyCodeFormItemRef>({});
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const { run: corpNameCheck } = useRequest(services.user.corpNameCheck, {
        manual: true,
        throwOnError: true
    });
    const checkCorpNameExist = () => ({
        validator: async (_: any, value: string) => {
            try {
                const trimValue = value?.trim();
                if (!trimValue) {
                    setIsCorpNameExist(false);
                    return Promise.resolve();
                }

                const res = await corpNameCheck({ tenantName: trimValue });
                if (res) {
                    setIsCorpNameExist(true);
                    return Promise.reject(new Error('该企业名称已被注册'));
                }

                setIsCorpNameExist(false);
                return Promise.resolve();
            } catch (e: any) {
                return Promise.reject(new Error(e?.data?.response?.message || '网络连接异常'));
            }
        },
        validateTrigger: 'onBlur'
    });

    // 企业名称/手机号发生变化的时候重置验证码
    const onResetCode = () => {
        form.resetFields(['code']);
        verifyCodeFormItemRef.current?.stopTimer?.();
    };

    const { run: sendVerifyCodeReq } = useRequest(services.user.sendVerifyCode, {
        manual: true,
        throwOnError: true
    });
    const sendVerifyCode = async () => {
        const data = await form.validateFields(['contactPhone', 'tenantName']);
        const { contactPhone, tenantName } = data;
        verifyCodeVersion.current = uuidv4();
        await sendVerifyCodeReq({ type: 'phone', version: verifyCodeVersion.current, phone: contactPhone, tenantName });
    };

    const { run: registerCorp } = useRequest(services.user.registerCorp, {
        manual: true
    });
    const onRegisterClick = () => {
        setSubmitLoading(true);
        form.validateFields(['tenantName', 'contactName', 'contactPhone', 'code', 'policy'])
            .then(async (values) => {
                if (!values.policy) {
                    message.warning('请先同意协议');
                    throw new Error();
                }
                const { policy, tenantName, contactName, ...rest } = values;
                const formData = {
                    tenantName: tenantName.trim(),
                    contactName: contactName.trim(),
                    ...rest
                };
                await registerCorp({
                    ...formData,
                    version: verifyCodeVersion.current,
                    type: 'phone'
                });
                finishCb(formData);
                setSubmitLoading(false);
            })
            .catch(() => {
                setSubmitLoading(false);
            });
    };
    return (
        <div className={styles.joinCorp}>
            <Form form={form} name="corpForm" autoComplete="off">
                <Form.Item
                    name="tenantName"
                    validateFirst
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                        { required: true, message: '请输入企业名称!' },
                        { whitespace: true, message: '不能为全空格' },
                        { type: 'string', min: 1, max: 30, message: '请输入1-30 个字的企业名称' },
                        checkCorpNameExist
                    ]}>
                    <Input
                        prefix={<Icon component={CorpOutlineIcon} className="input-prefix-icon" type="icon-show-13" />}
                        size="large"
                        placeholder="请输入企业名称"
                        onChange={onResetCode}
                    />
                </Form.Item>
                <DisabledBox disabled={isCorpNameExist}>
                    <Form.Item
                        name="contactName"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                            { required: true, message: '请输入企业联系人姓名!' },
                            { type: 'string', min: 1, max: 30, message: '请输入1-30 个字的企业联系人姓名' }
                        ]}>
                        <Input
                            prefix={<Icon component={UserIcon} className="input-prefix-icon" type="icon-show-13" />}
                            size="large"
                            placeholder="请输入企业联系人姓名"
                        />
                    </Form.Item>
                    <Form.Item
                        name="contactPhone"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                            { required: true, message: '请输入企业联系人手机号码!' },
                            { pattern: /^1\d{10}$/, message: '手机号格式错误！', validateTrigger: 'onBlur' }
                        ]}>
                        <Input
                            prefix={<Icon component={PhoneIcon} className="input-prefix-icon" type="icon-show-13" />}
                            size="large"
                            placeholder="请输入企业联系人手机号码"
                            onChange={onResetCode}
                        />
                    </Form.Item>

                    <VerifyCodeFormItem
                        type="phone"
                        validTime={15}
                        ref={verifyCodeFormItemRef}
                        field="code"
                        sendCode={sendVerifyCode}
                        resetField={() => {
                            form.resetFields(['code']);
                        }}
                    />
                    <Form.Item name="policy" style={{ marginBottom: 0 }}>
                        <UserPolicyCheckBox />
                    </Form.Item>
                    <div>
                        <Button
                            type="primary"
                            size="large"
                            onClick={onRegisterClick}
                            className="submit-btn"
                            loading={submitLoading}>
                            注册企业版
                        </Button>
                    </div>
                </DisabledBox>
            </Form>
        </div>
    );
};
