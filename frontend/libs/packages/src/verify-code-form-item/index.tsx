/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * 验证码
 */
import { Form, Input, message } from 'antd';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import styles from './index.module.less';
import Icon from '@ant-design/icons';
import { ReactComponent as codeIcon } from '@/assets/images/reg/mail-code.svg';
import { VERIFY_CODE_PATTERN } from '@/utils';

type IType = 'mail' | 'phone';
const SENDING_TEXT_MAP: Record<IType, (count: number) => string> = {
    mail: (count) => `验证码已发送，${count}分钟内有效，请耐心等待并检查垃圾邮箱`,
    phone: (count) => `验证码已发送，${count}分钟内有效`
};

interface VerifyCodeFormItemProps {
    type: 'mail' | 'phone';
    validTime?: number;
    field: string;
    sendCode: () => Promise<any>;
    resetField: () => void;
}

export interface VerifyCodeFormItemRef {
    stopTimer?: () => void;
}

export const VerifyCodeFormItem: React.ForwardRefExoticComponent<
    VerifyCodeFormItemProps & React.RefAttributes<VerifyCodeFormItemRef>
> = forwardRef((props, ref) => {
    const { type, validTime = 30, field, sendCode: propsSendCode, resetField } = props;

    const timerIdRef = useRef<NodeJS.Timer | null>(null);
    // 定时器用，定时器里的 state count 不更新
    const timeCountRef = useRef<number>(0);
    const [count, setCount] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const cutCount = () => {
        if (timeCountRef.current > 0) {
            timeCountRef.current -= 1;
            setCount(timeCountRef.current);
        } else {
            if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
                timerIdRef.current = null;
            }
        }
    };

    const sendCode = async () => {
        if (isLoading) {
            return;
        }
        if (timeCountRef.current > 0) {
            return;
        }

        setIsLoading(true);

        try {
            await propsSendCode();
            message.success('验证码已发送');

            timeCountRef.current = 60;
            setCount(timeCountRef.current);
            timerIdRef.current = setInterval(cutCount, 1000);
        } catch (e: any) {
            message.error(e?.data?.response?.message || '验证码发送失败');
            resetField();
        }

        setIsLoading(false);
    };

    useImperativeHandle(ref, () => {
        return {
            stopTimer: () => {
                if (timerIdRef.current) {
                    clearInterval(timerIdRef.current);
                    timerIdRef.current = null;
                }

                timeCountRef.current = 0;
                setCount(0);
            }
        };
    });

    // 正在倒计时
    const isCountdown = count !== 0;
    const btnText = isLoading ? '发送中...' : isCountdown ? `(${count}s)后发送` : '发送验证码';
    const sendingText = useMemo(() => SENDING_TEXT_MAP[type](validTime), [type, validTime]);
    return (
        <div className={styles.verifyCodeFormItem}>
            <div className="input-box">
                <Form.Item
                    className="input-box-l"
                    name={field}
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
                        placeholder="请输入验证码"
                        size="large"
                    />
                </Form.Item>
                <div className="verify-btn right-box" onClick={sendCode}>
                    {btnText}
                </div>
            </div>

            {isCountdown && (
                <div className="code-tips">
                    <div>· {sendingText}</div>
                </div>
            )}
        </div>
    );
});
