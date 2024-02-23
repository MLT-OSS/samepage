import React, { useEffect, useMemo } from 'react';
import styles from './index.module.less';
import { useChatPermission, useModelPermission, useSendInput } from '@xm/hooks';
import { CONV, IChatInputDatas, IChatInputSendDatas, IMessage } from '@/types';
import { TemplateButton } from './components/template-button';
import { ImageAction } from './components/image-action';
import { H5ActionOptions } from '../h5-action-options';
import { H5ActionOptionsItem } from '@xm/components';
import { ReactComponent as ListIcon } from '@/common/assets/images/h5/list.svg';
import Icon from '@ant-design/icons';
import { ReactComponent as HistoryIcon } from '@/assets/images/history.svg';
import { ReactComponent as AddIcon } from '@/assets/images/add-outline.svg';
import { ReactComponent as PromptIcon } from '@/assets/images/prompt.svg';
import { safeStringify } from '@/utils';
import { TextAction } from './components/text-action';
import classNames from 'classnames';

interface InputActionProps {
    newConversation: (options?: CONV.IStatelessConvOptions) => any;
    sendMessage?: (inputData: IChatInputSendDatas) => void;
    openHistory: () => void;
    openPrompts?: () => void;
    sendDisabled?: boolean;
    floatBtn?: React.ReactNode;

    theme?: 'bg' | 'none';
    // 提示词
    showDrawer?: (info: any) => void;
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
}

export const H5ChatInputAction: React.FC<InputActionProps> = (props) => {
    const {
        theme = 'none',
        sendDisabled = false,
        newConversation,
        openHistory,
        openPrompts,
        sendMessage,
        floatBtn,
        showDrawer,
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
        }
    } = props;
    const { textInputPermission, imageInputPermission, templateInputPermission } = useModelPermission();
    const { promptPermission } = useChatPermission();
    const { form, field, sendFn } = inputConfig;
    const sendInputConfig = useSendInput(form, field, sendFn);
    const { setFieldValue } = sendInputConfig;
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
    const Actions = useMemo(() => {
        if (promptPermission.show) {
            return [
                {
                    key: 'newConversation',
                    label: (
                        <H5ActionOptionsItem
                            prefixIcon={<Icon component={AddIcon} />}
                            onClick={() => newConversation()}>
                            新会话
                        </H5ActionOptionsItem>
                    )
                },
                {
                    key: 'history',
                    label: (
                        <H5ActionOptionsItem prefixIcon={<Icon component={HistoryIcon} />} onClick={openHistory}>
                            历史记录
                        </H5ActionOptionsItem>
                    )
                },
                {
                    key: 'prompt',
                    label: (
                        <H5ActionOptionsItem prefixIcon={<Icon component={PromptIcon} />} onClick={openPrompts}>
                            提示词
                        </H5ActionOptionsItem>
                    )
                }
            ];
        } else {
            return [
                {
                    key: 'newConversation',
                    label: (
                        <H5ActionOptionsItem
                            prefixIcon={<Icon component={AddIcon} />}
                            onClick={() => newConversation()}>
                            新会话
                        </H5ActionOptionsItem>
                    )
                },
                {
                    key: 'history',
                    label: (
                        <H5ActionOptionsItem prefixIcon={<Icon component={HistoryIcon} />} onClick={openHistory}>
                            历史记录
                        </H5ActionOptionsItem>
                    )
                }
            ];
        }
    }, [promptPermission]);

    const cancelEdit = () => {
        if (setEditQuestion) setEditQuestion(null);
    };
    // 填充文本
    useEffect(() => {
        if (fillText && setFillText) {
            setFieldValue(fillText);
            setFillText('');
        }
    }, [fillText, setFillText]);

    return (
        <div
            className={classNames(styles['h5-input-action'], {
                [styles.bg]: theme === 'bg'
            })}>
            {floatBtn}
            <div className={styles['h5-input-action-box']}>
                <div className={styles.actions}>
                    {!editQuestion && (
                        <H5ActionOptions style={{ marginBottom: '5px' }} items={Actions}>
                            <ListIcon />
                        </H5ActionOptions>
                    )}
                    {!!editQuestion && <span className={styles.editText}>编辑问题</span>}
                </div>

                <div className={styles['h5-input-action-inner']}>
                    {/* todo:文本 */}
                    {textInputPermission && (
                        <TextAction
                            inputConfig={inputConfig}
                            sendInputConfig={sendInputConfig}
                            editQuestion={editQuestion || null}
                            cancelEdit={cancelEdit}
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
                    {/* 视频 */}
                </div>
            </div>
        </div>
    );
};
