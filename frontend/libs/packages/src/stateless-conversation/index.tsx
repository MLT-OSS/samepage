import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatelessBubble } from '../stateless-bubble';
import { RobotInfoCard } from '../robot-info-card';
import styles from './index.module.less';
import { App } from 'antd';
import Icon from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useConversationContext } from '@xm/context';
import { TLanguage, useConvChat, useConvRunning, useLangInit } from '@xm/hooks';
import { IMessage, HISTORY_LOG, IChatParams, CONV, IChatInputDatas, IChatInputSendDatas } from '@/types';
import { debounce } from 'lodash-es';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { EditAnswer } from '../edit-answer';
import { GetBotConvKeyConvIdMsgMsgIdResponse, GetBotConvKeyResponse } from '@/ytt-type/conversation';
import { replaceByIdx, isH5, safeParse, safeStringify } from '@/utils';
import { ReactComponent as StopIcon } from '@/assets/images/stop.svg';
import { ChatInputAction } from '../chat-input-action';
import { H5ChatInputAction } from '../h5-chat-input-action';
import { HistoryLog } from '../history-log';
import { DeleteModal } from '@xm/components';

const isParamsEqual = (params1: IChatParams, params2: IChatParams) => {
    if (params1?.length !== params2?.length) {
        return false;
    }
    return (params1 || []).every(({ key, value }, idx) => {
        return key === params2[idx].key && value === params2[idx].value;
    });
};
// 将 API 返回的会话 list(Q1, A1, A1', A1'', Q2, A2, A1''', A2') 转化成标准的 Q, A 结构
const formatApiConvList = (apiList: IMessage[]) => {
    const questionMap: { [k: string]: IMessage } = {};
    const answerList: IMessage[] = [];
    apiList.forEach((i) => {
        if (i.contentType === 'template_params' || i.contentType === 'input') {
            questionMap[i.messageId] = i;
        } else {
            answerList.push(i);
        }
    });

    const res: IMessage[] = [];
    answerList.forEach((i) => {
        res.push(questionMap[i.parentMessageId], i);
    });
    return res;
};

interface ConversationProps {
    model: string;
    newConversation: (options?: CONV.IStatelessConvOptions) => any;
    options: CONV.IStatelessConvOptions;
    langOptions: { lang: TLanguage; setLang: (v: TLanguage, temp: boolean) => void };
    showFixed?: boolean;
}

export const StatelessConversation: React.FC<ConversationProps> = (props) => {
    const { message: antdMessage } = App.useApp();
    const { model, newConversation, langOptions, options, showFixed = true } = props;
    const { lang } = useLangInit(langOptions);

    const { conversationState, dispatch } = useConversationContext();
    const { modelInfo } = conversationState;
    const [convList, setConvList] = useState<IMessage[]>([]);

    const [lastQuestion, lastAnswer] = useMemo(() => {
        let [_lastQuestion, _lastAnswer]: Array<IMessage | null> = [null, null];
        for (let i = convList.length - 1; i >= 0; i--) {
            const { role } = (convList[i] || {}) as IMessage;
            if (_lastQuestion && _lastAnswer) {
                break;
            }
            if (!_lastQuestion && role === 'user') {
                _lastQuestion = convList[i];
                continue;
            }
            if (!_lastAnswer && role === 'assistant') {
                _lastAnswer = convList[i];
                continue;
            }
        }
        return [_lastQuestion, _lastAnswer];
    }, [convList]);
    const isRunning = lastAnswer?.status === 'RUNNING';

    const [convId, setConvId] = useState<string | undefined>();
    const messageEnd = useRef<HTMLDivElement>(null);
    const [currSendParams, _setCurrSendParams] = useState<IChatInputDatas | null>();
    const currSendParamsRef = useRef<IChatInputDatas | null>();
    const deleteModalRef = useRef(null);
    const setCurrSendParams = useCallback(
        (p: IChatInputDatas | null) => {
            _setCurrSendParams(p);
            currSendParamsRef.current = p;
        },
        [_setCurrSendParams]
    );
    const [editAnswer, setEditAnswer] = useState<string>('');
    const unsendParamsRef = useRef<IChatParams[]>([]);

    const webPageUrl = window.location.href;
    const webPageTitle = document.title || webPageUrl;

    const retryFlag = useRef<boolean>(false);

    // 删除信息
    const [delOpen, setDelOpen] = useState(false);
    const [delInfo, setDelInfo] = useState<any>();

    const [isShowHistory, setIsShowHistory] = useState(false);

    const scrollToBottom = () => {
        messageEnd?.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    };
    const debounceScrollToBottom = debounce(scrollToBottom, 100);
    const scrollToBottomAfterSend = () => {
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const { loading, messageLoading, pendingMsg, playRequest, pauseRequest } = useConvChat({
        lang,
        finishCb: (_res, req) => {
            const res = _res || {};
            // 1. 构造 request message
            const reqMessage: IMessage = {
                content: safeStringify(currSendParamsRef.current),
                contentType: 'input' as any,
                role: 'user',
                status: res.status === 'MSG_AUDIT_FAILED' ? 'MSG_AUDIT_FAILED' : 'SUCCESS',
                messageId: ''
            };
            // 2. 存 list
            // a). 正常: 直接存
            // b). 失败-重试: replace 当前失败的消息（截断 convList 里面已有的消息，然后 append），
            //     入参， 有 messageId 传 messageId，没有 messageId 传参数列表，但是前端要做成 update 效果
            const currMessages = [reqMessage, res];
            // FIXME convList 没有及时更新，所以这块需要额外处理
            const currConvList = retryFlag?.current ? (convList || []).slice(0, -2) : convList;
            const newList = [...currConvList, ...currMessages];
            setConvList(newList);

            // 3. 如果是错误，记 unsend 手动添加历史参数
            const isError = res.status !== 'SUCCESS';
            const isAuditError = res.status === 'MSG_AUDIT_FAILED';
            if (isError && !isAuditError) {
                unsendParamsRef.current = [...unsendParamsRef.current, currSendParamsRef?.current as any];
            }

            // 4. 清空;
            setCurrSendParams(null);
            retryFlag.current = false;
            // 5. 存 conversationId
            setConvId(res.conversationId ?? convId);

            // 滚动到底部
            setTimeout(() => {
                scrollToBottom();
            });
        },
        onMessageCb: () => {
            debounceScrollToBottom();
        }
    });
    const isConversationLoading = isRunning || messageLoading;
    // 生成消息
    const sendMessage = (data: IChatInputSendDatas, messageId?: string) => {
        setCurrSendParams(data);
        const message: IMessage = {
            content: safeStringify(data),
            contentType: 'input',
            conversationId: convId,
            messageId: uuidv4(),
            role: 'user'
        };
        const messages = [message];
        playRequest({
            conversationId: convId,
            webUrl: webPageUrl,
            title: webPageTitle,
            language: lang,
            messages,
            messageId
        } as any);
        if (data.some((i) => i.type === 'template') && unsendParamsRef.current?.length) {
            addParams({
                key: model,
                params: unsendParamsRef.current
            });
        }

        scrollToBottomAfterSend();
    };
    const deleteInStatelessConvList = (messageId: string) => {
        const messageIdx = convList.findIndex((i) => i.messageId === messageId);
        setConvList([...convList.slice(0, messageIdx - 1), ...convList.slice(messageIdx + 1)]);
    };
    console.log('打印 convList', convList);

    const { run: addParams } = useRequest(services.statelessConversation.addParams, {
        manual: true,
        onSuccess: (_, [req]) => {
            const reqParams = req.params;
            unsendParamsRef.current = unsendParamsRef.current.filter(
                (p) => reqParams.findIndex((i) => isParamsEqual(i, p)) === -1
            );
        }
    });
    const { run: getConversationInfo } = useRequest(services.conversation.getConversationInfo, {
        manual: true,
        onSuccess: (res: GetBotConvKeyResponse, req) => {
            // 更新当前的会话 id
            setConvId(req[0].convId);
            // 更新当前列表信息
            setConvList(formatApiConvList(res.messages as any));
            setTimeout(() => {
                scrollToBottom();
            }, 200);
        }
    });
    useConvRunning(isRunning, convId!, lastAnswer?.messageId, (res: GetBotConvKeyConvIdMsgMsgIdResponse) => {
        setConvList([...(convList || []).slice(0, -1), res as IMessage]);
    });

    // 历史记录项点击
    const onHistoryClick = (data: HISTORY_LOG.Item) => {
        newConversation({ conversationId: data.conversationId });
    };
    // 反馈接口
    const { run: feedback } = useRequest(services.conversation.feedback, {
        manual: true,
        onSuccess: (res, req) => {
            // 更新
            const messageIdx = convList.findIndex((i) => i.messageId === req[0]?.messageId);
            const message = convList[messageIdx];
            const feedback: IMessage['like'] = req[0]?.like ? 'like' : 'dislike';
            setConvList(replaceByIdx(convList, messageIdx, { ...message, like: feedback }));
        }
    });

    const closeDeleteLoading = () => {
        const { _closeLoading } = deleteModalRef?.current || {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            _closeLoading: () => {}
        };
        _closeLoading();
    };

    const { run: delImageTask } = useRequest(services.statelessConversation.delTemplateConv, {
        manual: true,
        onSuccess: (res: any) => {
            delCallback();
        },
        onError: () => {
            closeDeleteLoading();
        }
    });

    const onHanleRetry = (
        questionInfo: GetBotConvKeyResponse['messages'][0],
        answerInfo: GetBotConvKeyResponse['messages'][0]
    ) => {
        // 设置当前标记位
        retryFlag.current = true;
        // 清空当前气泡
        setConvList(convList.slice(0, -2));
        // 失败后重试
        let qustions: IChatInputSendDatas = safeParse(questionInfo.content!);
        if (questionInfo.contentType === 'template_params') {
            qustions = qustions.map((i: any) => {
                const obj = {
                    key: i.key,
                    value: i.value
                };
                return {
                    type: 'template',
                    value: safeStringify(obj)
                };
            });
        }
        if (!answerInfo.messageId?.includes('_fe:')) {
            sendMessage(qustions, answerInfo.messageId);
        } else {
            sendMessage(qustions);
        }
    };
    const onHanleChangeAnswer = (questionInfo: GetBotConvKeyResponse['messages'][0]) => {
        // 底部按钮再来一遍
        let qustions: IChatInputSendDatas = safeParse(questionInfo.content!);
        if (questionInfo.contentType === 'template_params') {
            qustions = qustions.map((i: any) => {
                const obj = {
                    key: i.key,
                    value: i.value
                };
                return {
                    type: 'template',
                    value: safeStringify(obj)
                };
            });
        }
        sendMessage(qustions);
    };
    const onHandleFeedback = (answerInfo: GetBotConvKeyResponse['messages'][0], status: boolean) => {
        // 踩、赞
        feedback({
            key: model,
            conversationId: answerInfo.conversationId!,
            messageId: answerInfo.messageId,
            like: status
        });
    };
    const onHandleEditAnswer = (message: string) => {
        // 编辑文案
        setEditAnswer(message);
    };

    const clearDel = () => {
        closeDeleteLoading();
        setDelOpen(false);
        setDelInfo(undefined);
    };

    const delCallback = async () => {
        // 删除回调
        deleteInStatelessConvList(delInfo.messageId!);
        clearDel();
    };

    const onHandleDelete = (answerInfo: GetBotConvKeyResponse['messages'][0]) => {
        // 删除两个消息id
        setDelInfo(answerInfo);
        setDelOpen(true);
    };

    const handleOnOk = () => {
        if (delInfo?.messageId?.includes('_fe:')) {
            delCallback();
        } else {
            delImageTask({
                key: model,
                convId: delInfo.conversationId!,
                msgId: delInfo.messageId!
            });
        }
    };

    // 切换到打分助手
    useEffect(() => {
        if (modelInfo?.state) {
            // state 没有语义化
            const msg = `已为您切换至${modelInfo.name}`; //  todo 是不是可以取名字
            antdMessage.success({
                key: msg,
                content: msg
            });
            // todo
            const sendData: IChatInputDatas = [
                {
                    type: 'template',
                    value: {
                        key: 'title',
                        value: modelInfo.state.title
                    }
                },
                {
                    type: 'template',
                    value: {
                        key: 'content',
                        value: modelInfo.state.content
                    }
                }
            ];
            const sendDataArr = sendData.map((i) => {
                return {
                    ...i,
                    value: safeStringify(i.value)
                };
            });
            sendMessage(sendDataArr);
            dispatch({
                type: 'i_model_info',
                payload: {
                    modelInfo: {
                        ...modelInfo,
                        state: null
                    }
                }
            });
        }
    }, [modelInfo?.state]);

    useEffect(() => {
        (async () => {
            // 之前已经有会话的情况
            if (convList.length) {
                // case：插件关闭后再打开，滚动到底部
                setTimeout(() => {
                    scrollToBottom();
                }, 200);

                return;
            }

            // 点击历史记录
            if (options.conversationId) {
                getConversationInfo({ key: model, convId: options.conversationId as string });
                return;
            }
        })();
    }, []);
    useEffect(() => {
        return () => {
            // 卸载组件的时候中止当前的回答：系统中止
            try {
                pauseRequest('system');
            } catch {}
        };
    }, []);

    console.log('打印 convList', convList);
    const currSendBubbleProps = useMemo(() => {
        const questionInfo = {
            content: safeStringify(currSendParams),
            title: '',
            contentType: 'input',
            role: 'user'
        };
        const answerInfo =
            !pendingMsg?.content && !pendingMsg?.title
                ? {
                      content: '',
                      title: '',
                      role: 'assistant'
                  }
                : pendingMsg;
        return { questionInfo, answerInfo };
    }, [currSendParams, pendingMsg]);
    const showPause = !loading && messageLoading;
    return (
        <div className={styles['stateless-conversation']}>
            <div className={styles.chats}>
                {/* 顶部加载和模型介绍 */}
                <RobotInfoCard style={{ marginTop: '16px' }} showFiexd={showFixed} />
                {/* 遍历气泡 */}
                {convList.map((item: GetBotConvKeyResponse['messages'][0], index) => {
                    if (index % 2 === 0) {
                        const questionInfo = item;
                        const idx = index + 1;
                        const answerInfo = convList[idx];
                        const isLastEle = idx === convList.length - 1;
                        return (
                            <div key={`messageId-${index}`} className={styles['chat-item-wapper']}>
                                <StatelessBubble
                                    isLastEle={isLastEle}
                                    disableAction={isConversationLoading}
                                    questionInfo={questionInfo}
                                    answerInfo={answerInfo}
                                    onRetry={() => onHanleRetry(questionInfo, answerInfo)}
                                    onChangeAnswer={() => onHanleChangeAnswer(questionInfo)}
                                    onDelete={() => onHandleDelete(answerInfo)}
                                    onFeedback={(status) => onHandleFeedback(answerInfo, status)}
                                    onEditAnswer={onHandleEditAnswer}
                                />
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
                {/* 当前正在发送的问答 */}
                {!!currSendParams && (
                    <StatelessBubble disableAction={isConversationLoading} {...(currSendBubbleProps as any)} />
                )}
                {/* 占位符，滚动用 */}
                <div ref={messageEnd} style={{ clear: 'both', height: '1px', width: '100%' }} />
            </div>
            {isH5 ? (
                <H5ChatInputAction
                    floatBtn={
                        showPause ? (
                            <span className={styles.stop} onClick={() => pauseRequest()}>
                                <Icon component={StopIcon} className={styles.icon} />
                                停止响应
                            </span>
                        ) : (
                            <></>
                        )
                    }
                    sendDisabled={isConversationLoading}
                    newConversation={newConversation}
                    sendMessage={sendMessage}
                    openHistory={() => setIsShowHistory(true)}
                />
            ) : (
                <ChatInputAction
                    floatBtn={
                        showPause ? (
                            <span className={styles.stop} onClick={() => pauseRequest()}>
                                <Icon component={StopIcon} className={styles.icon} />
                                停止响应
                            </span>
                        ) : (
                            <></>
                        )
                    }
                    sendDisabled={isConversationLoading}
                    langOptions={langOptions}
                    newConversation={newConversation}
                    sendMessage={sendMessage}
                    openHistory={() => setIsShowHistory(true)}
                />
            )}

            {/* 编辑 */}
            <EditAnswer open={!!editAnswer} onClose={() => setEditAnswer('')} text={editAnswer} />
            {/* 删除 */}
            <DeleteModal
                ref={deleteModalRef}
                open={delOpen}
                content={'您确定要删除此内容吗？'}
                onCancel={clearDel}
                okText={'删除'}
                onOk={handleOnOk}
            />
            {/* 历史记录 */}
            <HistoryLog
                open={isShowHistory}
                onClose={() => setIsShowHistory(false)}
                model={model}
                conversationId={convId!}
                onItemClick={onHistoryClick}
                isUrlClick={!isH5}
            />
        </div>
    );
};
