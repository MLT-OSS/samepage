import React, { useState } from 'react';
import styles from './index.module.less';
import { App, Button } from 'antd';
import { CONV_PENDING_MSG } from '@/constants';
import classNames from 'classnames';
import { TemplateAddParams } from '../../../template-add-params';
import { IChatInputDatas, IChatParam } from '@/types';

interface TemplateButtonProps {
    disabled: boolean;
    sendMessage: (params: IChatInputDatas) => void;
}

export const TemplateButton: React.FC<TemplateButtonProps> = (props) => {
    const { disabled = false, sendMessage } = props;
    const { message } = App.useApp();
    const [isShowAddPrama, setIsShowAddPrama] = useState(false);
    const handleShowParams = () => {
        if (disabled) {
            message.error({
                key: CONV_PENDING_MSG,
                content: CONV_PENDING_MSG
            });
            return;
        }
        setIsShowAddPrama(true);
    };
    const handleSendMessage = (params: any) => {
        if (disabled) {
            message.error({
                key: CONV_PENDING_MSG,
                content: CONV_PENDING_MSG
            });
            return;
        }
        const arr = params.map((i: IChatParam) => {
            return {
                type: 'template',
                value: i
            };
        });
        sendMessage(arr);
    };

    return (
        <div className={styles.templateBtn}>
            {/* 底部参数 */}
            <Button
                type="primary"
                className={classNames(styles.add, { [styles.disabled]: disabled })}
                onClick={handleShowParams}>
                填写参数
            </Button>
            {/* 增加参数 */}
            <TemplateAddParams
                open={isShowAddPrama}
                sendMessage={handleSendMessage}
                onClose={() => setIsShowAddPrama(false)}
            />
        </div>
    );
};
