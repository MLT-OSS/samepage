import { Checkbox } from 'antd';
import styles from './index.module.less';
import React from 'react';
import { PRIVACY_POLICY_PATH, USER_POLICY_PATH } from '@/constants';

interface UserPolicyCheckBoxProps {
    value?: boolean;
    onChange?: (v: boolean) => any;
}

export const UserPolicyCheckBox: React.FC<UserPolicyCheckBoxProps> = (props) => {
    const { value, onChange } = props;
    return (
        <div className={styles['user-policy-checkbox']}>
            <Checkbox
                className={styles.checkbox}
                checked={value}
                onChange={(e) => {
                    onChange?.(e.target.checked);
                }}
            />
            <span className={styles['policy-text']}>
                我已阅读并同意遵守
                <span
                    className={styles.policy}
                    onClick={() => {
                        window.open(USER_POLICY_PATH, '_blank');
                    }}>
                    《用户协议》
                </span>
                和
                <span
                    className={styles.policy}
                    onClick={() => {
                        window.open(PRIVACY_POLICY_PATH, '_blank');
                    }}>
                    《隐私协议》
                </span>
            </span>
        </div>
    );
};
