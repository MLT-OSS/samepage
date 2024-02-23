import React, { useEffect, useState } from 'react';

import { Form } from 'antd';
import { Button as AmButton, TextArea as AmTextArea } from 'antd-mobile';
import { ReactComponent as CloseIcon } from '@/common/assets/images/h5/close-circle.svg';
import { ReactComponent as SendIcon } from '@/common/assets/images/h5/arrow-up.svg';
import Icon from '@ant-design/icons';
import { useChatTokenCheck } from '@xm/hooks';
import styles from './index.module.less';
import classNames from 'classnames';
import { IMessage } from '@/types';
import { debounce } from 'lodash-es';
import { safeParse } from '@/utils';

interface TextActionProps {
    inputConfig: {
        field: 'searchText' | 'editText';
        sendValidate: any; // todo
    };
    sendInputConfig: {
        ref: any;
        content: string;
        onCompositionEvent: any;
        onKeyDown: any;
        onInputChange: any;
        onSend: any;
        setFieldValue: any;
        setContent: any;
    };
    editQuestion: IMessage | null;
    cancelEdit: () => void;
}

export const TextAction: React.FC<TextActionProps> = (props) => {
    const { inputConfig, editQuestion, cancelEdit, sendInputConfig } = props;
    const { field, sendValidate } = inputConfig;
    const { content, onCompositionEvent, onSend, setFieldValue, setContent } = sendInputConfig;
    const { isExceed } = useChatTokenCheck(content);
    // 编辑按钮校验
    const [sendBtnDisabled, setSendBtnDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (editQuestion?.content) {
            const { content, contentType } = editQuestion;
            const inputDataType = ['input', 'reply_input', 'web_search'].includes(contentType);
            let showContent = content;
            if (inputDataType) {
                showContent = safeParse(content || '[]')?.[0]?.value;
            }
            setFieldValue(showContent);
        } else {
            setFieldValue('');
        }
    }, [editQuestion, setFieldValue]);

    const onInputChange = debounce((text: string) => {
        setContent(text);
    }, 200);

    // 发送按钮禁用
    useEffect(() => {
        const obj = editQuestion ? { loading: true } : { error: true, edit: true, loading: true };
        const btnDisabled = !(content || '').trim() || !sendValidate(obj);
        setSendBtnDisabled(!!btnDisabled);
    }, [content, editQuestion]);
    return (
        <div
            className={classNames(styles.inputInner, {
                [styles.edit]: !!editQuestion
            })}>
            <div className={styles.inputBox}>
                {/* 不使用AmForm，因为其他端使用了antd的setFieldValue，在antm不生效,暂时先试用antd的Form */}
                <Form.Item name={field} noStyle>
                    <AmTextArea
                        onCompositionStart={onCompositionEvent}
                        onCompositionEnd={onCompositionEvent}
                        onChange={onInputChange}
                        rows={1}
                        autoSize={{ minRows: 1, maxRows: 6 }}
                    />
                </Form.Item>
                <AmButton className={styles.sendBtn} onClick={onSend} disabled={sendBtnDisabled}>
                    <Icon component={SendIcon} className={styles.sendIcon} />
                </AmButton>
            </div>
            {!!editQuestion && (
                <div className={styles.editCancle}>
                    <span className={styles.stop} onClick={cancelEdit}>
                        <CloseIcon className={styles.icon} />
                        <span>取消编辑</span>
                    </span>
                </div>
            )}
            {isExceed && (
                <div className={styles.exceedTips}>
                    <span className={styles.text}>输入文字过长，您的问题可能会被截断～</span>
                </div>
            )}
        </div>
    );
};
