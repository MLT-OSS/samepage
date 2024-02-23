import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { ReactComponent as CircleCloseIcon } from '@/assets/images/close-circle.svg';
import { useMingJingTokenCheck } from '@xm/hooks';
import styles from './index.module.less';
import classNames from 'classnames';

interface TextActionProps {
    inputConfig: {
        field: 'searchText' | 'editText';
        sendValidate: any; // todo
    };
    edit: boolean;
    sendBtnDisabled: boolean;
    setSendBtnDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    sendInputConfig: {
        ref: any;
        files: any;
        content: string;
        onCompositionEvent: any;
        onKeyDown: any;
        onInputChange: any;
        onSend: any;
    };
    fileConfig: {
        mjFile: any;
        onHandleClear: any;
        showPicUpload: any;
        showVideoUpload: any;
    };
}

export const TextOtherCoupleAction: React.FC<TextActionProps> = (props) => {
    const { inputConfig, edit, sendBtnDisabled, setSendBtnDisabled, sendInputConfig, fileConfig } = props;
    const { field, sendValidate } = inputConfig;
    const { ref: inputRef, files, content, onCompositionEvent, onKeyDown, onInputChange, onSend } = sendInputConfig;
    const { mjFile, onHandleClear, showPicUpload, showVideoUpload } = fileConfig;
    const { isExceed } = useMingJingTokenCheck(content, files);

    // 视频或图片
    const renderFile = () => {
        if (edit || !mjFile || mjFile.file.length === 0) return null;
        if (mjFile.type === 'video') {
            return (
                <div className="image-preview">
                    <div className="img-box">
                        <video height="88" width="100%" controls>
                            <source
                                src={mjFile.file[0].value.tempUrl || mjFile.file[0].value.downloadUrl}
                                type="video/mp4"
                            />
                        </video>
                    </div>
                    <div className="mask">
                        <div className="open" onClick={showVideoUpload} />
                        <CircleCloseIcon className="close-icon" onClick={onHandleClear} />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="image-preview">
                    <div className="img-box">
                        <img
                            className="img"
                            src={mjFile.file[0].value.tempUrl || mjFile.file[0].value.downloadUrl}
                            alt=""
                        />
                    </div>
                    <div className="number">{mjFile.file.length}</div>
                    <div className="mask">
                        <div className="open" onClick={showPicUpload} />
                    </div>
                </div>
            );
        }
    };
    const senMj = () => {
        onHandleClear();
        onSend();
    };
    // 发送按钮禁用
    useEffect(() => {
        const obj = edit ? { loading: true } : { error: true, edit: true, loading: true };
        const btnDisabled =
            (!(content || '').trim() && (!mjFile || mjFile.file.length === 0)) || !sendValidate(obj) || isExceed;
        setSendBtnDisabled(!!btnDisabled);
    }, [content, edit, isExceed]);
    return (
        <div
            className={classNames(styles.inputInner, {
                [styles.edit]: edit
            })}>
            <div className={styles.inputBox}>
                {renderFile()}
                <Form.Item name={field} noStyle>
                    <Input.TextArea
                        ref={inputRef}
                        className={styles.input}
                        onCompositionStart={onCompositionEvent}
                        onCompositionEnd={onCompositionEvent}
                        onChange={onInputChange}
                        onKeyDown={(e) => onKeyDown(e, sendBtnDisabled)}
                        style={{ height: '100px', overflow: 'auto' }}
                        placeholder="你可以问我任何问题"
                        bordered={false}
                    />
                </Form.Item>
                {!edit && (
                    <Button type="primary" className={styles.sendBtn} onClick={senMj} disabled={sendBtnDisabled}>
                        发送
                    </Button>
                )}
            </div>
            {isExceed && (
                <div className={styles.exceedTips}>
                    <span className={styles.text}>输入的文字/图片/视频超出最大限度，请删减后进行发送</span>
                </div>
            )}
        </div>
    );
};
