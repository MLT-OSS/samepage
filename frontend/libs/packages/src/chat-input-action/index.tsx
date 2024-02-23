import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { Button, Select } from 'antd';
import Icon from '@ant-design/icons';
import { TLanguage, useChatPermission, useLangInit, useModelPermission, useSendInput } from '@xm/hooks';
import { CONV, IChatInputDatas, IChatInputSendDatas, IMessage } from '@/types';
import { TemplateButton } from './components/template-button';
import { ImageAction } from './components/image-action';
import { TextAction } from './components/text-action';
import { ReactComponent as AddIcon } from '@/assets/images/add-outline.svg';
import { ReactComponent as HistoryIcon } from '@/assets/images/history.svg';
import { ReactComponent as PromptIcon } from '@/assets/images/prompt.svg';
import { ReactComponent as EditIcon } from '@/assets/images/edit.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/edit-close.svg';
import { ReactComponent as CheckIcon } from '@/assets/images/check.svg';
import { ReactComponent as MjUploadPic } from '@/assets/images/mj-upload-pic.svg';
import { ReactComponent as MjUploadVideo } from '@/assets/images/mj-upload-video.svg';
import { safeParse, safeStringify } from '@/utils';
import classNames from 'classnames';
import { UploadPicDrawer } from './components/upload-pic-drawer';
import { UploadVideoDrawer } from './components/upload-video-drawer';
import { TextOtherCoupleAction } from './components/text-other-couple-action';
import { isFunction } from 'lodash-es';

interface InputActionProps {
    sendDisabled?: boolean;
    showLang?: boolean;
    langOptions?: { lang: TLanguage; setLang: (v: TLanguage, temp: boolean) => void };
    newConversation: (options?: CONV.IStatelessConvOptions) => any;
    sendMessage?: (inputData: IChatInputSendDatas) => void;
    openHistory: () => void;
    openPrompts?: () => void;
    floatBtn?: React.ReactNode;

    theme?: 'border' | 'none';
    // 文字填充
    fillText?: string;
    setFillText?: React.Dispatch<React.SetStateAction<string>>;
    // 编辑
    editQuestion?: IMessage | null;
    setEditQuestion?: React.Dispatch<React.SetStateAction<IMessage | null>>;
    // 输入配置
    inputConfig?: {
        form: any;
        field: 'searchText' | 'editText';
        sendValidate: any; // todo
        sendFn: (text: string) => any;
    };
    // 联网搜索
    showWebSearch?: boolean;
    searchConfig?: { webSearch: string; onChangeWebSearch: (v: boolean) => any };
    showHistory?: boolean;
}

// eslint-disable-next-line complexity
export const ChatInputAction: React.FC<InputActionProps> = (props) => {
    const {
        theme = 'none',
        sendDisabled = false,
        showLang = true,
        newConversation,
        sendMessage,
        openHistory,
        openPrompts,
        floatBtn,
        fillText = '',
        setFillText,
        editQuestion,
        setEditQuestion,
        inputConfig = {
            form: null,
            field: 'searchText',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            sendValidate: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            sendFn: (text: string) => {}
        },
        showWebSearch = false,
        searchConfig = {
            webSearch: '',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChangeWebSearch: (v: boolean) => {}
        },
        langOptions = {
            lang: '',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setLang: (v: TLanguage, temp: boolean) => {}
        },
        showHistory = true
    } = props;
    const { lang, setLang } = useLangInit(langOptions);
    const {
        textInputPermission,
        imageInputPermission,
        templateInputPermission,
        videoInputPermission,
        langPermission,
        langOptions: pLangOptions
    } = useModelPermission();
    const { promptPermission } = useChatPermission();
    const { form, field, sendFn } = inputConfig;
    // 多种类型组合
    const [mjFile, setMjFile] = useState<any>();
    const [fileStatus, setFileStatus] = useState<any>(0); // 0 未上传 1 图片 2 视频
    const uploadPicRef = useRef(null);
    const uploadVideoRef = useRef(null);
    // 编辑按钮校验
    const [sendBtnDisabled, setSendBtnDisabled] = useState<boolean>(false);
    // 清除文件
    const clearFileInput = () => {
        if (textInputPermission && (imageInputPermission || videoInputPermission)) {
            onHandleClear();
        }
    };
    const sendInputConfig = useSendInput(form, field, sendFn, clearFileInput);
    const { setFieldValue, setFiles, onSend } = sendInputConfig;

    // 编辑
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
    // 填充文本
    useEffect(() => {
        if (fillText && setFillText) {
            setFieldValue(fillText);
            setFillText('');
        }
    }, [fillText, setFillText]);
    // 图片限制 todo:多图片输入形式
    const imageLimit = imageInputPermission ?? undefined;

    const handleSendMessage = (inputData: IChatInputDatas) => {
        const arr = inputData.map((i) => {
            return {
                ...i,
                value: typeof i.value === 'string' ? i.value : safeStringify(i.value)
            };
        });
        if (sendMessage) sendMessage(arr);
    };

    // 打开图片上传
    const showPicUpload = () => {
        const { _showUpload } = uploadPicRef?.current || {
            _showUpload: null
        };
        if (isFunction(_showUpload)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _showUpload();
        }
    };

    // 打开视频上传
    const showVideoUpload = () => {
        const { _showUpload } = uploadVideoRef?.current || {
            _showUpload: null
        };
        if (isFunction(_showUpload)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _showUpload();
        }
    };

    const handleComplete = (data: any) => {
        setMjFile(data);
        setFiles(getFiles(data.file));
        setFileStatus(data.file.length === 0 ? 0 : data.type === 'video' ? 2 : 1);
    };

    const getFiles = (file: any) => {
        if (!file) return [];
        const _files = file.map((item: any) => {
            return {
                ...item,
                type: item.type === 'video' ? 'video' : 'image',
                value: item.value
            };
        });
        return _files;
    };

    // 素材清除
    const onHandleClear = () => {
        setMjFile(null);
        setFiles([]);
        setFileStatus(0);
        clearUploadData();
    };

    // 清除上传素材
    const clearUploadData = () => {
        const { _clearUploaPicdData } = uploadPicRef?.current || { _clearUploaPicdData: null };
        const { _clearUploaVideodData } = uploadVideoRef?.current || { _clearUploaVideodData: null };

        if (isFunction(_clearUploaPicdData)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _clearUploaPicdData();
        }

        if (isFunction(_clearUploaVideodData)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _clearUploaVideodData();
        }
    };

    return (
        <div
            className={classNames(styles['input-action'], {
                [styles.border]: theme === 'border',
                [styles.edit]: !!editQuestion
            })}>
            {floatBtn}
            {!editQuestion && (
                <div className={styles.action}>
                    <div className={styles.left}>
                        <Button className={styles.btn} type="primary" onClick={() => newConversation()}>
                            <Icon component={AddIcon} className={styles.icon} />
                            新会话
                        </Button>
                        {textInputPermission && imageInputPermission && (
                            <Button onClick={showPicUpload} disabled={fileStatus === 2}>
                                <Icon component={MjUploadPic} className={styles.icon} />
                                添加图片
                            </Button>
                        )}
                        {textInputPermission && videoInputPermission && (
                            <Button onClick={showVideoUpload} disabled={fileStatus === 1}>
                                <Icon component={MjUploadVideo} className={styles.icon} />
                                添加视频
                            </Button>
                        )}
                        {showHistory && (
                            <Button onClick={openHistory}>
                                <Icon component={HistoryIcon} className={styles.icon} />
                                历史记录
                            </Button>
                        )}
                        {promptPermission.show && (
                            <Button onClick={openPrompts} className={styles.btn}>
                                <Icon component={PromptIcon} className={styles.icon} />
                                提示词
                            </Button>
                        )}
                    </div>
                    <div className={styles.right}>
                        {showLang && langPermission && (
                            <Select
                                size="small"
                                style={{ width: '65px' }}
                                options={pLangOptions}
                                value={lang}
                                onChange={setLang}
                            />
                        )}
                    </div>
                </div>
            )}
            {/* 文本编辑 */}
            {!!editQuestion && (
                <div className={styles.action}>
                    <span className={styles.title}>
                        <Icon component={EditIcon} className={styles.icon} />
                        正在编辑问题
                    </span>
                    <span className={styles.editAction}>
                        <Button
                            className={classNames(styles.item, styles.cancel)}
                            onClick={() => (setEditQuestion ? setEditQuestion(null) : '')}>
                            <Icon component={CloseIcon} />
                        </Button>
                        <Button
                            className={classNames(styles.item, styles.confirm)}
                            onClick={onSend}
                            disabled={sendBtnDisabled}>
                            <Icon component={CheckIcon} />
                        </Button>
                    </span>
                </div>
            )}
            {/* 文本和媒体元素组合：例如图片、视频 */}
            {textInputPermission && (imageInputPermission || videoInputPermission) ? (
                <TextOtherCoupleAction
                    edit={!!editQuestion}
                    inputConfig={inputConfig}
                    sendBtnDisabled={sendBtnDisabled}
                    setSendBtnDisabled={setSendBtnDisabled}
                    sendInputConfig={sendInputConfig}
                    fileConfig={{ mjFile, onHandleClear, showPicUpload, showVideoUpload }}
                />
            ) : (
                <>
                    {/* 文本 */}
                    {textInputPermission && (
                        <TextAction
                            inputConfig={inputConfig}
                            sendBtnDisabled={sendBtnDisabled}
                            setSendBtnDisabled={setSendBtnDisabled}
                            showWebSearch={showWebSearch}
                            edit={!!editQuestion}
                            sendInputConfig={sendInputConfig}
                            searchConfig={searchConfig}
                        />
                    )}
                    {/* 模版按钮 */}
                    {templateInputPermission && (
                        <TemplateButton disabled={sendDisabled} sendMessage={handleSendMessage} />
                    )}
                    {/* 图片 */}
                    {imageInputPermission && (
                        <ImageAction disabled={sendDisabled} limit={imageLimit} sendMessage={handleSendMessage} />
                    )}
                </>
            )}
            <UploadPicDrawer ref={uploadPicRef} onComplete={handleComplete} />
            <UploadVideoDrawer ref={uploadVideoRef} onComplete={handleComplete} />
        </div>
    );
};
