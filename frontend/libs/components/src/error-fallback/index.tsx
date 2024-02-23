import React from 'react';
import styles from './index.module.less';
import { ReactComponent as CrashIcon } from '@/assets/images/crash.svg';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useConversationContext } from '@xm/context';

interface ErrorFallbackProps {
    errorInfo?: string;
    error?: any;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
    const navigate = useNavigate();
    const { dispatch } = useConversationContext();
    console.log('error fallback 打印', props);
    return (
        <div className={styles.container}>
            <CrashIcon className={styles.img} />
            <div className={styles.text}>此页面已经崩溃，无法正确展示</div>
            <div className={styles.actions}>
                <Button
                    type="primary"
                    className={styles.btn}
                    onClick={() => {
                        dispatch({
                            type: 'i_main_layout_key',
                            payload: {
                                mainLayoutKey: String(+new Date())
                            }
                        });
                        navigate('/');
                    }}>
                    返回首页
                </Button>
            </div>
        </div>
    );
};
