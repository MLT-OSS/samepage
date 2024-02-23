/**
 * 编辑答案抽屉
 */
import { App, Button, Drawer, Input } from 'antd';
import type { DrawerProps } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import copy from 'copy-to-clipboard';
import { IconWapper } from '@xm/components';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import Icon from '@ant-design/icons';

interface EditAnswerProps extends DrawerProps {
    text: string;
}
export const EditAnswer: React.FC<EditAnswerProps> = (props) => {
    const { text, ...rest } = props;
    const { message } = App.useApp();
    const [value, setValue] = useState<string>('');

    const onCopy = () => {
        copy(value);
        const msg = '复制成功';
        message.success({
            key: msg,
            content: msg
        });
    };

    useEffect(() => {
        setValue(text);
    }, [text]);

    return (
        <Drawer
            className={styles.editAnswerDrawer}
            title="草稿"
            placement="bottom"
            closable={false}
            getContainer={false}
            height="auto"
            extra={
                <IconWapper>
                    <Icon component={CloseIcon} onClick={rest.onClose} />
                </IconWapper>
            }
            style={{
                borderRadius: '20px 20px 0px 0px'
            }}
            headerStyle={{
                textAlign: 'center',
                color: 'rgba(0, 0, 0, 0.75)',
                fontWeight: 600,
                border: 0
            }}
            bodyStyle={{
                padding: '16px',
                paddingTop: 0
            }}
            {...rest}>
            <Input.TextArea
                value={value}
                className={styles.textarea}
                onChange={(e) => setValue(e.target.value)}
                rows={20}
                placeholder="编辑答案"
            />
            <div className={styles.actions}>
                <Button type="primary" onClick={onCopy} size="large" className={styles.action}>
                    复制
                </Button>
            </div>
        </Drawer>
    );
};
