import React, { useEffect } from 'react';

import { Button, Form, Input, Switch, Tooltip } from 'antd';
import { ReactComponent as OnlineSearchIcon } from '@/assets/images/online-search.svg';
import { ReactComponent as QuestionCircleOutLIned } from '@/assets/images/question-circle-outlined.svg';
import Icon from '@ant-design/icons';
import { useChatTokenCheck } from '@xm/hooks';
import styles from './index.module.less';
import classNames from 'classnames';

interface TextActionProps {
    inputConfig: {
        field: 'searchText' | 'editText';
        sendValidate: any; // todo
    };
    sendBtnDisabled: boolean;
    setSendBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    edit: boolean;
    showWebSearch: boolean;
    searchConfig: { webSearch: string; onChangeWebSearch: (v: boolean) => any };
    sendInputConfig: {
        ref: any;
        content: string;
        onCompositionEvent: any;
        onKeyDown: any;
        onInputChange: any;
        onSend: any;
    };
}

export const TextAction: React.FC<TextActionProps> = (props) => {
    const {
        inputConfig,
        sendBtnDisabled,
        setSendBtnDisabled,
        edit = false,
        showWebSearch = false,
        searchConfig,
        sendInputConfig
    } = props;
    const { field, sendValidate } = inputConfig;
    const { webSearch, onChangeWebSearch } = searchConfig;
    const { ref: inputRef, content, onCompositionEvent, onKeyDown, onInputChange, onSend } = sendInputConfig;
    const { isExceed } = useChatTokenCheck(content);

    // 发送按钮禁用

    useEffect(() => {
        const obj = edit ? { loading: true } : { error: true, edit: true, loading: true };
        const btnDisabled = !(content || '').trim() || !sendValidate(obj);
        setSendBtnDisabled(!!btnDisabled);
    }, [content, edit]);
    return (
        <div
            className={classNames(styles.inputInner, {
                [styles.edit]: edit
            })}>
            <div className={styles.inputBox}>
                <div className={styles.inputArea}>
                    <Form.Item name={field} noStyle>
                        <Input.TextArea
                            ref={inputRef}
                            className={styles.input}
                            onCompositionStart={onCompositionEvent}
                            onCompositionEnd={onCompositionEvent}
                            onChange={onInputChange}
                            onKeyDown={(e) => onKeyDown(e, sendBtnDisabled)}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            placeholder="你可以问我任何问题"
                            bordered={false}
                        />
                    </Form.Item>
                    {!edit && (
                        <Button type="primary" className={styles.sendBtn} onClick={onSend} disabled={sendBtnDisabled}>
                            发送
                        </Button>
                    )}
                </div>
                {!edit && showWebSearch && (
                    <div className={styles.onlineSearch}>
                        <Icon component={OnlineSearchIcon} className={styles.icon} />
                        <p className={styles.text}>联网搜索</p>
                        <Switch
                            checked={webSearch === 'SMART'}
                            size="small"
                            className={styles.switch}
                            onChange={onChangeWebSearch}
                        />
                        <Tooltip
                            title={
                                'Samepage将自动判断您的问题是否需要联网搜索，启用联网搜索后，Samepage将在互联网中获取实时的信息数据，提高答案精确性。'
                            }>
                            <Icon component={QuestionCircleOutLIned} className={styles.guidIcon} />
                        </Tooltip>
                    </div>
                )}
            </div>
            {isExceed && (
                <div className={styles.exceedTips}>
                    <span className={styles.text}>输入文字过长，您的问题可能会被截断～</span>
                </div>
            )}
        </div>
    );
};
