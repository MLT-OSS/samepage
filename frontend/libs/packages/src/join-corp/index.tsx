/**
 * 加入租户表单
 */
import { CSSProperties, useState } from 'react';
import { Button, Form, Input, Tooltip, message } from 'antd';
import Icon from '@ant-design/icons';

import { UserPolicyCheckBox, CustomSelect } from '@xm/components';

import { ReactComponent as OrgIcon } from '@/assets/images/expand.svg';
import { ReactComponent as EmptyIcon } from '@/assets/images/empty.svg';
import { ReactComponent as ShieldIcon } from '@/assets/images/reg/mail-code.svg';
import { ReactComponent as InfoIcon } from '@/assets/images/reg/info.svg';

import styles from './index.module.less';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { GetTenantDepartmentCodeResponse } from '@/ytt-type/corp';
import { useCorpRegister } from '@xm/hooks';
import { Rule } from 'antd/es/form';
import { getLeafDepartList } from '@/utils';

interface ICorpInfo {
    departId: string;
    code: string;
}

interface JoinCorpProps {
    finishCb?: (data: ICorpInfo) => void;
    style?: CSSProperties;
}

export const JoinCorp: React.FC<JoinCorpProps> = (props) => {
    const { finishCb } = props;
    const [form] = Form.useForm();
    const [departmentOptions, setDepartmentOptions] = useState<{ label: string; value: string }[]>([]);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const { run: getDepartment, loading: getDeparmentLoading } = useRequest(services.user.getDepartment, {
        manual: true,
        throwOnError: true
    });

    const { joinCorp } = useCorpRegister();
    const onRegisterClick = () => {
        setSubmitLoading(true);
        form.validateFields(['departId', 'code', 'policy'])
            .then(async (values) => {
                if (!values.policy) {
                    message.warning('请先同意协议');
                    throw new Error();
                }

                const { policy, code, ...rest } = values;
                const formData = {
                    code: code.trim(),
                    ...rest
                };
                await joinCorp(formData);
                finishCb?.(formData);
                setSubmitLoading(false);
            })
            .catch(() => {
                setSubmitLoading(false);
            });
    };
    const onCodeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        form.resetFields(['departId']);
    };

    const checkCodeValid: Rule = () => ({
        validator: async (_: any, value: string) => {
            try {
                const trimValue = (value ?? '').trim();
                if (trimValue) {
                    const res: GetTenantDepartmentCodeResponse = await getDepartment({ code: trimValue });
                    setDepartmentOptions(
                        getLeafDepartList(res || []).map(({ departId, departName }) => ({
                            label: departName as string,
                            value: departId as string
                        }))
                    );
                } else {
                    setDepartmentOptions([]);
                }
                return Promise.resolve();
            } catch (e: any) {
                return Promise.reject(new Error(e?.data?.response?.message || '网络连接异常'));
            }
        },
        validateTrigger: 'onBlur'
    });
    return (
        <div className={styles.joinCorp} style={props.style}>
            <Form form={form} name="corpForm" autoComplete="off">
                <Form.Item
                    name="code"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                        { required: true, message: '请输入邀请码!', validateTrigger: ['onChange', 'onBlur'] },
                        checkCodeValid
                    ]}>
                    <Input
                        prefix={<Icon component={ShieldIcon} className="input-prefix-icon" type="icon-show-13" />}
                        size="large"
                        placeholder="请输入邀请码"
                        onChange={onCodeChange}
                        suffix={
                            <Tooltip
                                trigger="hover"
                                overlayClassName="black-tooltip"
                                overlayStyle={{ zIndex: 9999 }}
                                title="请输入6位数字+字母组合的邀请码，邀请码中不区分字母大小写"
                                showArrow={false}>
                                <Icon component={InfoIcon} className="input-suffix-icon" type="icon-tishi" />
                            </Tooltip>
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="departId"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                        {
                            required: true,
                            message: '请选择您所在组!',
                            validateTrigger: ['onChange', 'onBlur']
                        }
                    ]}>
                    <CustomSelect
                        prefix={<Icon component={OrgIcon} className="select-prefix-icon" type="icon-show-13" />}
                        size="large"
                        placeholder="请输入您的组"
                        options={departmentOptions}
                        showSearch
                        optionFilterProp="label"
                        getPopupContainer={(node) => {
                            return (node?.parentNode ?? document.body) as HTMLElement;
                        }}
                        notFoundContent={
                            <div className="dropdown-empty-box">
                                <EmptyIcon />
                                <div style={{ marginTop: '4px' }}>暂无数据</div>
                            </div>
                        }
                        loading={getDeparmentLoading}
                    />
                </Form.Item>
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
            </Form>
        </div>
    );
};
