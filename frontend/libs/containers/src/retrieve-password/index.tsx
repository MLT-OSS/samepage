/**
 * 找回密码
 */
import { useState, useEffect } from 'react';
import { Button, Form, Input, Tooltip, message } from 'antd';
import Icon from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';

import services from '@xm/services';
import { VERIFY_CODE_PATTERN, pwdPattern } from '@/utils';

import { ReactComponent as mailIcon } from '@/assets/images/reg/mail.svg';
import { ReactComponent as passwordIcon } from '@/assets/images/reg/password.svg';
import { ReactComponent as codeIcon } from '@/assets/images/reg/mail-code.svg';
import { ReactComponent as infoIcon } from '@/assets/images/reg/info.svg';

import { EMAIL_REGEXP, LOGIN_PATH } from '@/constants';

import styles from './index.module.less';
import { useUserNavigate } from '@xm/hooks';

let timerCount = 0; // 默认60秒

let codeInterval: any = null;

export const RetrievePassword = () => {
    const userNavigate = useUserNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [form] = Form.useForm();
    const [count, setCount] = useState(0);
    const cutCount = () => {
        if (timerCount > 0) {
            timerCount -= 1;
            setCount(timerCount);
        } else {
            if (codeInterval) {
                clearInterval(codeInterval);
                codeInterval = null;
            }
        }
    };
    const { run: CodeSmsAccount } = useRequest(services.login.CodeSmsAccount, {
        manual: true,
        onSuccess: (res, req) => {
            if (res === true) {
                message.success('验证码已发送');
                timerCount = 60;
                setCount(timerCount);
                codeInterval = setInterval(cutCount, 1000);
            } else {
                message.warning('验证码发送失败');
            }
            setIsLoading(false);
        }
    });
    const sendCode = () => {
        if (isLoading) {
            return;
        }
        if (timerCount > 0) return;

        form.validateFields(['mail'])
            .then((values) => {
                console.log(values);
                const mail = form.getFieldValue('mail');
                CodeSmsAccount({
                    account: mail,
                    smsType: 2
                });
                setIsLoading(true);
            })
            .catch(() => {
                refreshCode();
            });
    };

    const refreshCode = () => {
        form.setFieldValue('code', '');
    };

    const { run: ResetPassword } = useRequest(services.login.ResetPassword, {
        manual: true,
        onSuccess: (res, req) => {
            console.log(res);
            if (res.status === true) {
                message.success('密码重置成功，请重新登录');
                userNavigate(LOGIN_PATH);
            } else {
                message.error(res?.message);
            }
        }
    });

    const handleSubmitClick = () => {
        form.validateFields(['mail', 'code', 'password', 'confirmPassword']).then((values) => {
            ResetPassword({ code: values.code, account: values.mail, password: values.password });
        });
    };

    const { run: checkAccount } = useRequest(services.login.checkAccount, {
        manual: true,
        throwOnError: true
    });

    const checkMailExist = () => ({
        validator: async (_: any, value: string) => {
            try {
                if (EMAIL_REGEXP.test(value)) {
                    const res = await checkAccount({ account: value });
                    if (res === 'UNREGISTERED') {
                        return Promise.reject(new Error('该邮箱未注册'));
                    }
                    return Promise.resolve();
                }
                return Promise.resolve();
            } catch (e: any) {
                return Promise.reject(new Error(e?.data?.response?.message || '网络连接异常'));
            }
        },
        validateTrigger: 'onBlur'
    });

    useEffect(() => {
        return () => {
            if (codeInterval) {
                clearInterval(codeInterval);
            }
            codeInterval = null;
            timerCount = 0;
        };
    }, []);

    return (
        <div className={styles['update-pwd-panel']}>
            <Form form={form} className="update-pwd-form" name="basic" autoComplete="off">
                <Form.Item
                    name="mail"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                        { required: true, message: '请输入邮箱地址!', validateTrigger: ['onChange', 'onBlur'] },
                        {
                            pattern: EMAIL_REGEXP,
                            message: '邮箱格式错误！',
                            validateTrigger: 'onBlur'
                        },
                        checkMailExist
                    ]}
                    validateFirst>
                    <Input
                        prefix={<Icon component={mailIcon} className="input-prefix-icon" type="icon-show-13" />}
                        className="login-modal-form-input"
                        size="large"
                        placeholder="请输入邮箱地址"
                    />
                </Form.Item>
                <div className="input-box">
                    <Form.Item
                        className="input-box-l"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码!'
                            },
                            {
                                pattern: VERIFY_CODE_PATTERN.pattern,
                                message: VERIFY_CODE_PATTERN.errorMsg
                            }
                        ]}>
                        <Input
                            prefix={<Icon component={codeIcon} className="input-prefix-icon" type="icon-show-3" />}
                            className="login-modal-form-input"
                            placeholder="请输入验证码"
                            size="large"
                        />
                    </Form.Item>
                    <div
                        className={isDisabled ? 'verify-btn right-box disabled' : 'verify-btn right-box'}
                        onClick={sendCode}>
                        {isLoading ? '发送中...' : count === 0 ? '发送验证码' : `(${count}s)后发送`}
                    </div>
                </div>
                {count === 0 ? null : (
                    <div className="code-tips">
                        <div>· 验证码已发送，30分钟有效，请耐心等待并检查垃圾邮箱</div>
                    </div>
                )}
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: '请输入密码！', validateTrigger: 'onChange' },
                        { pattern: pwdPattern.pattern, message: pwdPattern.errMsg }
                    ]}
                    dependencies={['confirmPassword']}
                    validateFirst>
                    <Input.Password
                        prefix={<Icon component={passwordIcon} className="input-prefix-icon" type="icon-show12" />}
                        className="update-pwd-form-input"
                        size="large"
                        iconRender={() => (
                            <Tooltip
                                trigger="hover"
                                overlayClassName="black-tooltip"
                                title={
                                    <div className={styles.tip}>
                                        长度为6~20个字符，支持字母/数字 以及标点符号，不允许有空格、中文
                                    </div>
                                }
                                showArrow={false}>
                                <Icon component={infoIcon} className="input-suffix-icon" type="icon-tishi" />
                            </Tooltip>
                        )}
                        placeholder="请输入新密码"
                    />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    rules={[
                        () => ({
                            validator(_: any, value: string) {
                                if (form.getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('确认密码与新密码不一致'));
                            }
                        })
                    ]}
                    dependencies={['password']}
                    validateFirst>
                    <Input.Password
                        prefix={<Icon component={passwordIcon} className="input-prefix-icon" type="icon-show12" />}
                        className="register-pwd-form-input"
                        size="large"
                        iconRender={() => (
                            <Tooltip
                                trigger="hover"
                                overlayClassName="black-tooltip"
                                title={
                                    <div className={styles.tip}>
                                        长度为6~20个字符，支持字母/数字 以及标点符号，不允许有空格、中文
                                    </div>
                                }
                                // placement="topRight"
                                showArrow={false}>
                                <Icon component={infoIcon} className="input-suffix-icon" type="icon-tishi" />
                            </Tooltip>
                        )}
                        placeholder="请确认新密码"
                    />
                </Form.Item>
                <div className="form-btns-box">
                    <Button type="primary" size="large" className="login-btn" onClick={handleSubmitClick}>
                        确定
                    </Button>
                </div>
            </Form>
            <div className="footer-box">
                <div className="footer-item">
                    <Button
                        type="link"
                        size="small"
                        className="link-btn"
                        onClick={() => {
                            userNavigate(LOGIN_PATH);
                        }}>
                        返回
                    </Button>
                </div>
            </div>
        </div>
    );
};
