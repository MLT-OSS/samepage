import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Input, App, Form, Switch } from 'antd';
import cl from 'classnames';
import { Button as AmButton, TextArea as AmTextArea } from 'antd-mobile';
import Icon from '@ant-design/icons';

import { STORAGE_KEEP_IMAGE_INPUT } from '@/constants';
import { getSessionValue, setSessionValue, isH5 } from '@/utils';
import { useConversationContext } from '@xm/context';
import SettingModal from '../setting-modal';
import UploadDrawer from '../upload-drawer';
import WeightModal from '../weight-modal';

import { ReactComponent as SendIcon } from '@/common/assets/images/h5/arrow-up.svg';
import { ReactComponent as ListIcon } from '@/common/assets/images/h5/list.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close-circle.svg';
import { ReactComponent as PicIcon } from '@/assets/images/pic.svg';
import { ReactComponent as SettingIcon } from '@/assets/images/setting.svg';
import { ReactComponent as UploadPic } from '@/assets/images/upload-pic.svg';
import { ReactComponent as LoadingSrc } from '@/assets/images/loading.svg';

import type { ISettingModalProps } from '../setting-modal';
import type { TextAreaProps } from 'antd/es/input';
import type { IMAGE_CONVERSATION } from '@/types';
import type { ImageProps } from '../upload-drawer';

import styles from './index.module.less';
import { H5ActionOptions } from '../../../h5-action-options';
import { H5ActionOptionsItem, ImageBtn } from '@xm/components';

interface IChatActionProps {
    referText?: string;
    imageUrl?: string;
    disableBtn?: boolean;
    sendMessage?: (data: IMAGE_CONVERSATION.IImageAddReq) => void;
    settingModalProps?: ISettingModalProps;
}
const middleCount = 100;
const maxCount = 1000;
const ChatAction = (props: IChatActionProps) => {
    const { imageUrl, referText, disableBtn = false, sendMessage, settingModalProps } = props;
    const {
        conversationState: { userinfo }
    } = useConversationContext();
    const { message } = App.useApp();
    const [msg, setMsg] = useState('');
    const [sendDisabled, setSendDisabled] = useState(false);
    const [imageInfo, setImageInfo] = useState<ImageProps>();
    const [imageWeight, setImageWeight] = useState<number>();
    const [checkedBox, setCheckedBox] = useState(false);

    const onHandlePressEnter: TextAreaProps['onPressEnter'] = (e) => {
        e.preventDefault();
        const { value } = e.currentTarget;
        onHandleClickSend(value);
    };
    const onHandleChange: TextAreaProps['onChange'] = (e) => {
        const { value } = e.currentTarget;
        setMsg(value);
    };
    const onHandleClickSend = async (messageName?: string) => {
        // 发送禁用时的收口提示
        if (sendDisabled) {
            message.error({
                key: '__xm_image_task_is_running__',
                content: '已有正在执行的绘图任务'
            });
            return;
        }
        const param: IMAGE_CONVERSATION.IImageAddReq = {
            msg: msg
        };
        if (messageName) {
            param.msg = messageName;
        }
        if (imageInfo?.imageKey) {
            param.image = imageInfo?.imageKey;
        }
        if (imageWeight) {
            param.imageWeight = imageWeight;
        }
        if (sendMessage) {
            // sendMessage(param);
            // if (!checkedBox) {
            //     clearAll();
            // }
            /**
             * 发送失败不清空
             */
            try {
                const sendData = await sendMessage(param);
                console.log(sendData, 'sendData');
                if (!checkedBox) {
                    clearAll();
                }
            } catch (e) {
                console.log(`发送错误: ${e}`);
            }
        }
    };
    const clearAll = () => {
        onHandleClear();
        setMsg('');
    };

    const handleComplete = (data: ImageProps) => {
        setImageInfo(data);
        setImageWeight(undefined);
    };
    const onHandleClear = () => {
        setImageInfo(undefined);
        setImageWeight(undefined);
    };
    const onHandleConfirm = (weight: number) => {
        setImageWeight(weight);
    };
    const onhandleSavePromptChange = (value: boolean) => {
        setCheckedBox(value);
        setSessionValue({ key: STORAGE_KEEP_IMAGE_INPUT + userinfo?.userId, value: value.toString() });
    };
    const onHandleCheckChange = (e: any) => {
        const { checked } = e.target;
        onhandleSavePromptChange(checked);
    };
    useEffect(() => {
        if (!disableBtn && msg && msg.length <= 1000) {
            setSendDisabled(false);
        } else {
            setSendDisabled(true);
        }
    }, [disableBtn, msg]);
    useEffect(() => {
        getSessionValue(STORAGE_KEEP_IMAGE_INPUT + userinfo?.userId).then((res) => {
            setCheckedBox(res === 'true');
        });
    }, []);
    useEffect(() => {
        if (imageUrl) {
            setImageInfo({ imageUrl, imageKey: imageUrl });
        }
        if (referText) {
            setMsg(referText);
        }
    }, [imageUrl, referText]);
    return (
        <div className={styles.options}>
            {msg.length > middleCount && msg.length <= maxCount ? (
                <div className="custom-message-tip info">您输入的提示词过长，建议您精简提示词～</div>
            ) : (
                <></>
            )}
            {msg.length > maxCount ? (
                <div className="custom-message-tip error">您输入的提示词已超过最长字符限制</div>
            ) : (
                <></>
            )}
            {!isH5 ? (
                <div className={styles.normal}>
                    <div className={styles.tools}>
                        <div className={styles.left}>
                            <UploadDrawer onComplete={handleComplete}>
                                <Button className={styles['custom-btn']} size="small" type="primary">
                                    <Icon component={PicIcon} />
                                    {imageInfo?.imageUrl ? '替换图片' : '参考图片'}
                                </Button>
                            </UploadDrawer>
                            <SettingModal {...settingModalProps} />
                        </div>
                        <div className={styles.check}>
                            <Checkbox checked={checkedBox} onChange={onHandleCheckChange}>
                                发送后保留提示词
                            </Checkbox>
                        </div>
                    </div>
                    <div className={cl(styles['textarea-box'], msg.length > maxCount ? styles.error : '')}>
                        {imageInfo?.imageUrl ? (
                            <div className="image-preview">
                                <div className="img-box">
                                    <img className="img" src={imageInfo?.imageUrl} alt="" />
                                </div>
                                <div className="mask">
                                    <WeightModal imgUrl={imageInfo.imageUrl} onConfirm={onHandleConfirm} />
                                    <CloseIcon className="close-icon" onClick={onHandleClear} />
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        <Input.TextArea
                            value={msg}
                            className={styles.input}
                            placeholder="用英语描述您的创作，非英语描述将被自动翻译成英语"
                            rows={4}
                            onPressEnter={onHandlePressEnter}
                            onInput={onHandleChange}
                        />
                        <Button
                            type="primary"
                            size="small"
                            disabled={sendDisabled}
                            className={styles['send-btn']}
                            onClick={() => onHandleClickSend()}>
                            发送
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.uploadImageWarpper}>
                        {imageInfo?.imageUrl ? (
                            <div className="image-preview">
                                <div className="img-box">
                                    <img className="img" src={imageInfo?.imageUrl} alt="" />
                                </div>
                                <div className="setting">
                                    <WeightModal
                                        imgUrl={imageInfo.imageUrl}
                                        onConfirm={onHandleConfirm}
                                        onDelete={onHandleClear}>
                                        <SettingIcon className="setting-icon" />
                                    </WeightModal>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <div className={styles.h5ChatInput}>
                        <H5ActionOptions
                            style={{ marginBottom: '5px' }}
                            items={[
                                {
                                    key: 'uploadImage',
                                    label: (
                                        <UploadDrawer onComplete={handleComplete}>
                                            <H5ActionOptionsItem prefixIcon={<Icon component={PicIcon} />}>
                                                {imageInfo?.imageUrl ? '替换图片' : '参考图片'}
                                            </H5ActionOptionsItem>
                                        </UploadDrawer>
                                    )
                                },
                                {
                                    key: 'setting',
                                    label: (
                                        <SettingModal {...settingModalProps}>
                                            <H5ActionOptionsItem prefixIcon={<Icon component={SettingIcon} />}>
                                                设置
                                            </H5ActionOptionsItem>
                                        </SettingModal>
                                    )
                                },
                                {
                                    key: 'savePrompt',
                                    label: (
                                        <H5ActionOptionsItem>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: '13px',
                                                    fontWeight: 400,
                                                    color: 'rgba(0, 0, 0, 0.45)'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}>
                                                <Switch
                                                    defaultChecked={checkedBox}
                                                    onChange={onhandleSavePromptChange}
                                                />
                                                发送后保留提示词
                                            </div>
                                        </H5ActionOptionsItem>
                                    )
                                }
                            ]}>
                            <ListIcon />
                        </H5ActionOptions>
                        <div className={styles.inputBox}>
                            <AmTextArea
                                value={msg}
                                onChange={(value) => setMsg(value)}
                                rows={1}
                                autoSize={{ minRows: 1, maxRows: 6 }}
                            />
                            <AmButton
                                className={styles.sendBtn}
                                onClick={() => onHandleClickSend()}
                                disabled={sendDisabled}>
                                <Icon component={SendIcon} className={styles.sendIcon} />
                            </AmButton>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatAction;
