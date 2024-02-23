/**
 * login 页面
 */
import { useEffect } from 'react';
import { App, Button, Form, Input, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';

import services from '@xm/services';
import { pwdPattern, navigateToChat, isMini } from '@/utils';
import { EMAIL_REGEXP, PRIVACY_POLICY_PATH, USER_POLICY_PATH } from '@/constants';

import { ReactComponent as mailIcon } from '@/assets/images/reg/mail.svg';
import { ReactComponent as passwordIcon } from '@/assets/images/reg/password.svg';
import { ReactComponent as infoIcon } from '@/assets/images/reg/info.svg';

import styles from './index.module.less';
import classNames from 'classnames';
import { useCorpRegister, useUserNavigate } from '@xm/hooks';
import { CORP_REGISTER } from 'types/corp-register';

export const Login = () => {
    const [form] = Form.useForm();
    const { message: antdMessage } = App.useApp();
    const userNavigate = useUserNavigate();
    const location = useLocation();
    const locationState: CORP_REGISTER.LocationState = location?.state || {};
    const inviteKey = locationState?.inviteParams?.inviteKey;
    const isLinkRegister = !!inviteKey;

    const handleForgetClick = () => {
        userNavigate('/retrieve-password');
    };

    const { run: login } = useRequest(services.login.login, {
        manual: true
    });
    const { getInviteKeyInfo } = useCorpRegister();
    const onLogin = async () => {
        const values = await form.validateFields(['mail', 'password']);
        const { mail, password } = values;
        const userinfo = await login({ account: mail, password: password });
        return userinfo;
    };
    /**
     * 普通登录:
     * 1. 校验表单&登录
     * 2. 提示用户&“跳转”
     *
     * 链接注册:
     * 1. 校验表单&登录
     * 2. 加入租户
     * 3. “跳转”到系统/二次“确认”/错误页
     */
    const handleLoginClick = async () => {
        // 1. 校验表单&登录
        const userinfo = await onLogin();

        if (isLinkRegister) {
            // 获取注册链接 key 的信息，进行相应跳转
            await getInviteKeyInfo({
                param: inviteKey,
                userId: userinfo.userId // todo 目前后端接口没有返回
            });
        } else {
            antdMessage.success('登录成功');
            navigateToChat(location?.search);
        }
    };

    /**
     * 正常登录：
     * 1. 跳转到注册页
     *
     * 链接注册：
     * 1. 携带邀请信息注册
     */
    const handleRegisterClick = () => {
        userNavigate('/register');
    };

    const onUserAgreement = () => {
        window.open(USER_POLICY_PATH, '_blank');
    };
    const onPrivacyAgreement = () => {
        window.open(PRIVACY_POLICY_PATH, '_blank');
    };

    const handleBackMini = () => {
        wx.miniProgram.navigateBack();
    };

    useEffect(() => {
        const mail = location?.state?.mail;
        if (mail) {
            form.setFieldValue('mail', mail);
        }
    }, [location?.state?.mail]);

    const submitBtnText = isLinkRegister ? '加入企业租户' : '立即登录';
    return (
        <div className={classNames(styles.pwdLoginFormContainer, { [styles.linkRegister]: isLinkRegister })}>
            {isLinkRegister && (
                <div className={styles.inviteInfo}>
                    <span className={styles.emphasis}>{locationState?.inviteInfo?.inviteUsername}</span> 邀请您加入
                    <span className={styles.emphasis}>【{locationState?.inviteInfo?.corpName}】</span>租户
                </div>
            )}
            <Form form={form} className="pwd-login-form" name="basic">
                <Form.Item
                    name="mail"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                        { required: true, message: '请输入邮箱地址!', validateTrigger: 'onChange' },
                        {
                            pattern: EMAIL_REGEXP,
                            message: '邮箱格式错误！',
                            validateTrigger: 'onBlur'
                        }
                    ]}>
                    <Input
                        prefix={<Icon component={mailIcon} className="input-prefix-icon" type="icon-show13" />}
                        className="login-modal-form-input"
                        size="large"
                        placeholder="请输入邮箱地址"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: '请输入密码!', validateTrigger: 'onChange' },
                        { pattern: pwdPattern.pattern, message: pwdPattern.errMsg, validateTrigger: 'onChange' }
                    ]}>
                    <Input.Password
                        prefix={<Icon component={passwordIcon} className="input-prefix-icon" type="icon-show12" />}
                        className="login-modal-form-input"
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
                        placeholder="请输入密码"
                    />
                </Form.Item>
                <div className="form-btns-box">
                    <Button type="primary" size="large" className="login-btn" onClick={handleLoginClick}>
                        {submitBtnText}
                    </Button>
                    <div className="operate-btns-box">
                        <Button type="link" className="operate-btn" onClick={handleForgetClick}>
                            忘记密码
                        </Button>
                        <div className="right-btn-box">
                            <span>没有账号，</span>
                            <Button type="link" size="small" className="operate-btn" onClick={handleRegisterClick}>
                                点此注册
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
            {isMini && (
                <div className={styles.backMini} onClick={handleBackMini}>
                    返回到
                    <br />
                    小程序
                </div>
            )}
        </div>
    );
};
