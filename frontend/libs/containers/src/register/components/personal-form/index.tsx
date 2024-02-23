/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * 注册-个人信息
 */
import { Button, Form, Input, Tooltip, message } from 'antd';
import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import Icon from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { ReactComponent as passwordIcon } from '@/assets/images/reg/password.svg';
import { ReactComponent as codeIcon } from '@/assets/images/reg/mail-code.svg';
import { ReactComponent as userIcon } from '@/assets/images/reg/nickname.svg';
import { ReactComponent as infoIcon } from '@/assets/images/reg/info.svg';
import { ReactComponent as mailIcon } from '@/assets/images/reg/mail.svg';
import { EMAIL_REGEXP, LOGIN_PATH } from '@/constants';
import { DisabledBox, UserPolicyCheckBox } from '@xm/components';
import { VERIFY_CODE_PATTERN, pwdPattern } from '@/utils';

let timerCount = 0; // 默认60秒

let codeInterval: any = null;

let captchaGetting = false;

interface PersonalFormProps {
    onReigsterCb: (info: { account: string; password: string }) => void;
}

const PersonalForm: React.FC<PersonalFormProps> = (props) => {
    const { onReigsterCb } = props;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [checkMailTip, setCheckMailTip] = useState<ReactNode>(null); // 报错的时候需要隐藏该消息

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
        throwOnError: true, // 添加 throwOnError 选项
        onSuccess: (res) => {
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
                const mail = form.getFieldValue('mail');

                CodeSmsAccount({
                    account: mail,
                    smsType: 1
                }).catch(() => {
                    setIsLoading(false);
                });

                setIsLoading(true);
            })
            .catch(() => {
                refreshCode();
            });
    };

    const getImgCode = () => {
        if (captchaGetting) {
            return;
        }
        captchaGetting = true;
    };

    const refreshCode = () => {
        form.setFieldValue('code', '');
        getImgCode();
    };

    const { run: signup } = useRequest(services.login.Signup, {
        manual: true
    });
    const handleRegisterClick = () => {
        form.validateFields(['mail', 'code', 'password', 'username']).then(async (values) => {
            try {
                // if (!values.policy) {
                //     message.warning('请先同意协议');
                //     return;
                // }
                const { code, mail, password, username } = values;
                // 调用注册接口
                await signup({
                    code,
                    account: mail,
                    password,
                    username
                });
                // 个人，注册成功，跳转到登录页
                message.success('注册成功');
                onReigsterCb({ account: mail, password });
            } catch {}
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
                    if (res === 'PERSONAL_REGISTERED' || res === 'CORP_REGISTERED') {
                        setCheckMailTip(
                            <span className={styles['mail-exist-info']}>
                                {res === 'PERSONAL_REGISTERED' ? '该邮箱已注册个人版账号' : '该邮箱已注册企业版账号'}
                                ，请
                                <a
                                    onClick={() => {
                                        navigate(LOGIN_PATH, {
                                            state: {
                                                mail: value
                                            }
                                        });
                                    }}>
                                    登录
                                </a>
                            </span>
                        );
                    } else {
                        setCheckMailTip(null);
                    }
                    return Promise.resolve();
                } else {
                    setCheckMailTip(null);
                }
                return Promise.resolve();
            } catch (e: any) {
                return Promise.reject(new Error(e?.data?.response?.message || '网络连接异常'));
            }
        },
        validateTrigger: 'onBlur'
    });

    return (
        <div className={styles['register-form-box']}>
            <Form form={form} className="register-form" name="basic" autoComplete="off">
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
                    style={{ marginBottom: checkMailTip ? '0' : '24px' }}>
                    <Input
                        prefix={<Icon component={mailIcon} className="input-prefix-icon" type="icon-show13" />}
                        className="login-modal-form-input"
                        size="large"
                        placeholder="请输入邮箱地址"
                    />
                </Form.Item>
                {!!checkMailTip && checkMailTip}
                <DisabledBox disabled={!!checkMailTip}>
                    <div className="input-box">
                        <Form.Item
                            className="input-box-l"
                            name="code"
                            rules={[
                                { required: true, message: '请输入验证码!' },
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
                        <div className="verify-btn right-box" onClick={sendCode}>
                            {isLoading ? '发送中...' : count === 0 ? '发送验证码' : `(${count}s)后发送`}
                        </div>
                    </div>

                    {count === 0 ? null : (
                        <div className="code-tips">
                            <div>· 验证码已发送，30分钟有效，请耐心等待并检查垃圾邮箱</div>
                        </div>
                    )}
                    <Form.Item
                        name="username"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                            { required: true, message: '请输入用户昵称!' },
                            { type: 'string', message: '用户昵称最多 15 个字符', max: 15 }
                        ]}>
                        <Input
                            prefix={<Icon component={userIcon} className="input-prefix-icon" type="icon-show-13" />}
                            className="login-modal-form-input"
                            size="large"
                            placeholder="请输入用户昵称"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码!', validateTrigger: 'onChange' },
                            { pattern: pwdPattern.pattern, message: pwdPattern.errMsg }
                        ]}>
                        <Input.Password
                            prefix={<Icon component={passwordIcon} className="input-prefix-icon" type="icon-show12" />}
                            className="register-pwd-form-input"
                            size="large"
                            placeholder="请输入密码"
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
                        />
                    </Form.Item>

                    {/* <Form.Item name="policy" style={{ marginBottom: 0 }}>
                        <UserPolicyCheckBox />
                    </Form.Item> */}

                    <div className="form-btns-box">
                        <Button type="primary" size="large" className="login-btn" onClick={handleRegisterClick}>
                            注册
                        </Button>
                    </div>
                </DisabledBox>
            </Form>
            <div className="footer-box">
                <div className="footer-item">
                    <span>已有账号，</span>
                    <Button
                        type="link"
                        size="small"
                        className="link-btn"
                        onClick={() => {
                            navigate(LOGIN_PATH);
                        }}>
                        点此登录
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PersonalForm;
