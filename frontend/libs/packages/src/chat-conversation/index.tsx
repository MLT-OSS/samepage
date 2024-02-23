/**
 * 会话
 *
 * 1. 聊天区域 + 操作区域
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.less';
import { Button, Form, App } from 'antd';

import { ChatBubble } from '../chat-bubble';
import { Prompt } from '../prompt';
import { HistoryLog } from '../history-log';
import { PromptDrawer } from '../prompt-drawer';
import { CHAT_BUBBLE } from '@/types';
import { useConversationContext } from '@xm/context';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { CONV_EDIT_MODE_MSG, CONV_ERROR_MODE_MSG, CONV_PENDING_MSG, SELECTION_ACTIONS } from '@/constants';
import {
    GetBotConvKeyConvIdMsgMsgIdResponse,
    GetBotConvKeyResponse,
    PostBotChatKeyConvRequest
} from '@/ytt-type/conversation';
import classNames from 'classnames';
import type { IMessage, IChatModelSSERequest, HISTORY_LOG, CONV } from '@/types';
import { EditAnswer } from '../edit-answer';
import {
    useReadTask,
    TLanguage,
    useChatSend,
    useChatRender,
    useChatPermission,
    useConvRunning,
    useModelPermission,
    useWebSearch,
    useLangInit,
    useConvChat
} from '@xm/hooks';
import { debounce, isFunction } from 'lodash-es';
import { ChatFloatAction } from '../chat-float-action';

import { UploadDocModal, OnCloseFn } from '../upload-doc-modal';
import { ChatReferModal } from '@xm/components';
import {
    genWebDocUrl,
    getDocLinkInfo,
    isDocChat,
    getBranchLast,
    getMessageMap,
    getUpdatedMessageMap,
    getShowConvList,
    isH5
} from '@/utils';
import { RobotInfoCard } from '../robot-info-card';
import { GetBotKeyWelcomeResponse } from '@/ytt-type/robot';

import { ChatInputAction } from '../chat-input-action';
import { H5ChatInputAction } from '../h5-chat-input-action';

interface ConversationProps {
    model: PostBotChatKeyConvRequest['model'];
    newConversation: (options?: CONV.IConversationOptions) => any;
    options: CONV.IConversationOptions;
    langOptions: { lang: TLanguage; setLang: (v: TLanguage, temp: boolean) => void };
    showPrompt?: boolean; // 展示提示词
    showFixed?: boolean; // 展示简介固定按钮
}
interface CurSendMsg {
    text?: string;
    files?: any; // todo
}

// 避免编辑问题的时候，问题和答案公用一个branchLength，增加editAnsShowBrnach字段
type BranchLastMsg = IMessage & { editAnsShowBrnach?: boolean };

// eslint-disable-next-line complexity
export const ChatConversation: React.FC<ConversationProps> = (props) => {
    const { message: antdMessage } = App.useApp();
    const { model, newConversation, options, langOptions, showPrompt = true, showFixed = true } = props;
    const { lang, setLang } = useLangInit(langOptions);
    const [webSearch, setWebSearchFun] = useWebSearch(); // 是否联网搜索

    const [readArticleFlag, setReadArticleFlag] = useState<boolean>(options?.readArticle || false); // 阅读全文的标记
    const [readDocFlag, setReadDocFlag] = useState<boolean>(!!options?.readDoc || false);
    const [editQuestionFlag, setEditQuestionFlag] = useState<boolean>(false);
    const [convType, setConvType] = useState<string>('COMMON');
    const { conversationState, dispatch } = useConversationContext();
    const { selectAction, selectTextToShow } = conversationState;
    const [branchLastMsg, setBranchLastMsg] = useState<BranchLastMsg>(); // 当前分支的最后一条消息
    const [messageMap, setMessageMap] = useState<Map<string, IMessage>>(new Map()); // 全量消息map结构

    const {
        welcomePermission,
        readArticlePermission,
        readDocPermission,
        selectionPermission,
        promptPermission,
        modelCardPermission
    } = useChatPermission();
    const {
        webSearchPermission,
        textInputPermission,
        imageInputPermission,
        videoInputPermission,
        templateInputPermission
    } = useModelPermission();
    const showWebSearch = !(readArticleFlag || readDocFlag || convType !== 'COMMON') && webSearchPermission;
    const webSearchInfo = { webSearch, showWebSearch };
    const multimodal = useMemo(
        () =>
            [textInputPermission, imageInputPermission, videoInputPermission, templateInputPermission].filter(Boolean)
                .length > 1,
        [textInputPermission, imageInputPermission, videoInputPermission, templateInputPermission]
    );

    useEffect(() => {
        dispatch({ type: 's_flag', payload: { selectFlag: selectionPermission } });
    }, [dispatch, selectionPermission]);

    const updateMessageMap = (currMessages: IMessage[]) => {
        setMessageMap(getUpdatedMessageMap(currMessages, messageMap));
    };

    // lastQuestion 允许编辑，lastAnswer 允许换个答案 showConvList当前分支所需展示的消息列表
    const [lastQuestion, lastAnswer, showConvList] = useMemo(() => {
        const _showConvList: IMessage[] = getShowConvList(branchLastMsg?.messageId, messageMap);
        let [_lastQuestion, _lastAnswer]: Array<IMessage | null> = [null, null];
        for (let i = _showConvList?.length - 1; i >= 0; i--) {
            const { role } = (_showConvList[i] || {}) as IMessage;
            if (_lastQuestion && _lastAnswer) {
                break;
            }
            if (!_lastQuestion && role === 'user') {
                _lastQuestion = _showConvList[i];
                continue;
            }
            if (!_lastAnswer && role === 'assistant') {
                _lastAnswer = _showConvList[i];
                continue;
            }
        }
        return [_lastQuestion, _lastAnswer, _showConvList];
    }, [messageMap, branchLastMsg]);

    const isBlockedError = lastAnswer?.status === 'FAILED';
    const isRunning = lastAnswer?.status === 'RUNNING';

    const [convId, setConvId] = useState<string | undefined>();
    const messageEnd = useRef<HTMLDivElement>(null);
    const [form] = Form.useForm();
    const [editQuestion, setEditQuestion] = useState<IMessage | null>(null); // 存编辑的问题
    const [fillText, setFillText] = useState<string>(''); // 填充提示词
    const cueWordRef = useRef(null);
    const [editAnswer, setEditAnswer] = useState<string>('');
    const [isShowHistory, setIsShowHistory] = useState<boolean>(false);
    const [isShowPrompt, setIsShowPrompt] = useState<boolean>(false);
    const [uploadDocModalOpen, setUploadDocModalOpen] = useState<boolean>(false);
    const [referInfo, setReferInfo] = useState<CHAT_BUBBLE.IRefer['reference']['0'] | null>(null);

    const [welcome, setWelcome] = useState<string>(''); // 存 welcome 信息，当发送后清空
    const [virtualRoot, setVirtualRoot] = useState<boolean>(false); // 是否需要虚拟根节点，当发送后置为false
    const [curSendMsg, setCurSendMsg] = useState<CurSendMsg>({}); // 存当前发送的 message
    const [currSendSelection, setCurrSendSelection] = useState<string>('');

    const scrollToBottom = () => {
        messageEnd?.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    };
    const debounceScrollToBottom = debounce(scrollToBottom, 100);
    const scrollToBottomAfterSend = () => {
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    /**
     * 校验能否发送，截断后续操作
     * 1. error: 错误中是否截断
     * 2. edit: 编辑中是否截断
     * 3. loading: 问题发送中是否截断
     *
     * @param options 对应的校验项
     * @param showMessage 是否展示 message
     * @returns 是否校验通过
     */
    const sendValidate = (
        options: { error?: boolean; edit?: boolean; loading?: boolean } = {},
        showMessage = false
    ) => {
        const { error, edit, loading } = options;

        // 处理“阻塞的”错误中
        if (error && isBlockedError) {
            showMessage &&
                antdMessage.error({
                    key: CONV_ERROR_MODE_MSG,
                    content: CONV_ERROR_MODE_MSG
                });
            return;
        }

        // 处理编辑中
        if (edit && editQuestion) {
            showMessage &&
                antdMessage.error({
                    key: CONV_EDIT_MODE_MSG,
                    content: CONV_EDIT_MODE_MSG
                });
            return;
        }

        // 处理消息发送中
        if (loading && isConversationPending) {
            showMessage &&
                antdMessage.error({
                    key: CONV_PENDING_MSG,
                    content: CONV_PENDING_MSG
                });
            return;
        }

        return true;
    };

    const {
        loading,
        contentLoading,
        summaryDoneStatus,
        summaryLoading,
        messageLoading,
        pendingMsg,
        playRequest,
        pauseRequest
    } = useConvChat({
        lang,
        finishCb: (res, req) => {
            console.log('useChat 结束回调', req, res);
            // 1. 清空;
            setWelcome('');
            setVirtualRoot(false);
            setCurSendMsg({});
            // 判断如果是 selection 操作，则执行 selection 相关清空
            if ((req as PostBotChatKeyConvRequest)?.messages?.slice(-1)?.[0]?.contentType === 'intent') {
                dispatch({ type: 's_clear' });
                setCurrSendSelection('');
            }

            // 2. 存 conversationId
            setConvId(res.conversationId ?? convId);
            // 3. 存 map
            // a). 正常: 直接存, 存req和res
            // b). 阅读全文 & 阅读 Pdf: 置 isShow 为 false
            // c). 编辑问题、失败-编辑问题: 存req和res，产生新分支
            // d). 换个答案、联网搜索、失败-重试: 存res，产生新分支
            const isError = res.status !== 'SUCCESS';
            const messages: IMessage[] | undefined = (req as IChatModelSSERequest)?.messages?.map((i) => {
                const isShow = ['read_article', 'read_doc', 'virtual_root'].includes(i.contentType) ? false : true;
                const status =
                    i.contentType === 'intent' && res.status === 'INTENT_MSG_AUDIT_FAILED'
                        ? 'INTENT_MSG_AUDIT_FAILED'
                        : undefined;
                return { ...i, isShow, status };
            });

            if (res.status === 'MSG_AUDIT_FAILED' && messages?.length) {
                messages[messages?.length - 1].status = 'MSG_AUDIT_FAILED';
            }

            const isChangeAnswerOrRetry = showConvList.findIndex((i) => i.messageId === messages?.[0]?.messageId) > -1;

            let currMessages = [...(messages || []), res];

            if (isChangeAnswerOrRetry && !editQuestionFlag) {
                // 重试只需将回答加入MessageMap即可，保证MessageMap里的sort序列是正确有序的
                currMessages = [res];
            } else if (editQuestionFlag) {
                // 编辑问题（错误处理也是该逻辑）
                setEditQuestionFlag(false); // 目前无法区分是编辑问题还是换个答案，用于区分是编辑问题还是换个答案
                currMessages = [...(messages || []), res];
            }

            if (isError) {
                currMessages = currMessages.map((i) => ({ ...i, _fe_status: 'unsend' }));
            }
            updateMessageMap(currMessages);

            // 4、存最后一条消息-branchLastMsg
            setBranchLastMsg(res);

            // 5、滚动到底部
            setTimeout(() => {
                scrollToBottom();
            });
        },
        onMessageCb: () => {
            debounceScrollToBottom();
        }
    });

    const { sendBasicMsgs, sendSelectionMsgs, sendEditedMsgs, sendRetryMsgs, sendArticleTaskMsgs, sendDocTaskMsgs } =
        useChatSend({
            model: model as string,
            conversationId: convId,
            showWebSearch,
            lang,
            conversationOptions: options,
            messageMap,
            showConvList,
            branchLastMsg,
            setBranchLastMsg,
            welcome,
            virtualRoot,
            editQuestion,
            isBlockedError,
            requestStream: playRequest,
            scrollToBottomAfterSend,
            sendValidate,
            setCurSendMsg,
            setCurrSendSelection,
            setEditQuestion
        });

    const {
        start: readArticle,
        progress: readArticleProgress,
        progressStage: readArticleProgressStage,
        taskLoading: readArticleTaskLoading,
        taskError: readArticleTaskError
    } = useReadTask('article', lang, sendArticleTaskMsgs);
    useEffect(() => {
        readArticleTaskError && setReadArticleFlag(false);
    }, [readArticleTaskError]);
    const {
        start: readDoc,
        progress: readDocProgress,
        progressStage: readDocProgressStage,
        taskLoading: readDocTaskLoading,
        taskError: readDocTaskError
    } = useReadTask('doc', lang, sendDocTaskMsgs);
    useEffect(() => {
        readDocTaskError && setReadDocFlag(false);
    }, [readDocTaskError]);
    const isConversationPending =
        isRunning ||
        (readDocFlag && readDocTaskLoading) ||
        (readArticleFlag && readArticleTaskLoading) ||
        messageLoading;

    const sendInput = (text: string, files?: []) => {
        if (selectTextToShow) {
            return sendSelectionMsgs(text, false);
        } else {
            return sendBasicMsgs(text, files || []);
        }
    };

    const { run: getWelcome, data: welcomeData } = useRequest(services.conversation.getWelcome, {
        manual: true,
        onSuccess: (res: GetBotKeyWelcomeResponse) => {
            const { welcome } = res;
            setWelcome(welcome);
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    });
    const { run: feedback } = useRequest(services.conversation.feedback, {
        manual: true,
        onSuccess: (res, req) => {
            const message = req[0]?.messageId && messageMap.get(req[0]?.messageId);
            const feedback: IMessage['like'] = req[0]?.like ? 'like' : 'dislike';
            updateMessageMap([{ ...message, like: feedback }]);
        }
    });
    const { run: getConversationInfo } = useRequest(services.conversation.getConversationInfo, {
        manual: true,
        onSuccess: (res: GetBotConvKeyResponse, req) => {
            // 更新当前的会话 id
            setConvId(req[0].convId);
            setConvType(res.conversationType);
            // 更新当前列表信息
            const newMessageMap = getMessageMap(res.messages as IMessage[]);
            setMessageMap(newMessageMap);
            setBranchLastMsg(res.messages[res.messages?.length - 1] as IMessage);

            setTimeout(() => {
                scrollToBottom();
            }, 200);
        }
    });

    useConvRunning(isRunning, convId!, lastAnswer?.messageId, (res: GetBotConvKeyConvIdMsgMsgIdResponse) => {
        updateMessageMap([res as IMessage]);
        setBranchLastMsg(res as IMessage);
    });

    const onSelectionAction = (welcome?: string) => {
        sendSelectionMsgs(selectAction as string, true, welcome);
    };
    useEffect(() => {
        if (selectTextToShow) {
            scrollToBottom();
        }
        if (selectAction) {
            onSelectionAction();
        }
    }, [selectTextToShow, selectAction]);

    // 组件初始化操作
    useEffect(() => {
        (async () => {
            console.log('chat 会话挂载', messageMap.size);
            // 之前已经有会话的情况
            if (messageMap.size) {
                // case：插件关闭后再打开，滚动到底部
                setTimeout(() => {
                    scrollToBottom();
                }, 200);

                return;
            }

            // 其他 case：首次进入, 切换模型，开启新会话，阅读文章，阅读文档，点击历史记录, 快捷操作

            // 点击历史记录
            if (options.conversationId) {
                getConversationInfo({
                    key: model as string,
                    convId: options.conversationId as string,
                    all: 'true' as string
                });
                return;
            }

            if (welcomePermission) {
                // 设置虚拟根节点
                setVirtualRoot(true);
                // 获取 welcome 信息
                await getWelcome({ key: model as string });
            } else {
                // 没有欢迎语权限设置虚拟根节点
                setVirtualRoot(true);
            }

            if (readArticleFlag) {
                readArticle();
            }
            if (readDocFlag) {
                if (isDocChat) {
                    if (options?.readDoc?.taskId) {
                        sendDocTaskMsgs(options?.readDoc?.taskId, 'new');
                    } else {
                        sendDocTaskMsgs(options?.readDoc?.docId as string, 'append');
                    }
                } else {
                    readDoc({ docId: options.readDoc?.docId });
                }
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

    // 气泡操作
    const onEditQuestion = (message: IMessage) => {
        setEditQuestionFlag(true);
        setEditQuestion(message);
    };
    const onGuideClick = (text: string) => {
        sendBasicMsgs(text);
    };
    const onChangeAnswer = (message: IMessage) => {
        sendRetryMsgs(message);
    };
    const onChangeSearch = (message: IMessage, webSearch: string) => {
        sendRetryMsgs(message, webSearch);
    };
    const onRetry = (message: IMessage) => {
        sendRetryMsgs(message);
    };
    const onAddPrompt = (text: string) => {
        showCueWordModal(text);
    };
    const onEditAnswer = (text: string) => {
        setEditAnswer(text);
    };
    const onFeedback = (message: IMessage, status: boolean) => {
        feedback({
            key: model as string,
            conversationId: message.conversationId!,
            messageId: message.messageId,
            like: status
        });
    };
    const onClickSuggest = (text: string) => {
        sendBasicMsgs(text);
    };
    const onReferClick = (type: CHAT_BUBBLE.ChatBubbleType, data: CHAT_BUBBLE.IRefer['reference']['0']) => {
        if (options?.onReferClick) {
            options?.onReferClick(data);
            return;
        }
        setReferInfo(data);
    };
    const getWebDocUrl = async ({
        docId: paramDocId,
        conversationId: paramConversationId
    }: {
        docId?: string;
        conversationId?: string;
    } = {}) => {
        const docId = getDocLinkInfo((showConvList as IMessage[])?.[0]?.content as string).docId;
        return await genWebDocUrl({
            docId: (paramDocId ?? docId) as string,
            conversationId: (paramConversationId ?? convId) as string,
            lang
        });
    };

    const onChangeWebSearch = (webSearch: boolean) => {
        const isSearch = webSearch ? 'SMART' : 'NONE';
        setWebSearchFun?.(isSearch);
    };

    // 历史记录项点击
    const onHistoryClick = (data: HISTORY_LOG.Item) => {
        newConversation({ conversationId: data.conversationId, conversationType: data.conversationType });
    };

    const { _showCueWordModal, _showCueWordDrawer } = cueWordRef?.current || {
        _showDiv: null,
        _hideDiv: null,
        _showCueWordModal: null,
        _showCueWordDrawer: null
    };
    // 打开提示词弹窗
    const showCueWordModal = (info: any) => {
        if (isFunction(_showCueWordModal)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _showCueWordModal(info);
        }
    };
    // 提示词使用
    const showCueWordDrawer = (info: any) => {
        // variableType === 2: 没有变量，将内容填充到输入框
        if (info.variableType === 2) {
            fillInInput(info.content);
            return;
        }
        if (isFunction(_showCueWordDrawer)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _showCueWordDrawer(info);
        }
    };

    const fillInInput = (text: string) => {
        if (sendValidate({ edit: true }))
            if (editQuestion) {
                // 当前是编辑模式，提示用户
                const inputModeConflictMsg = '请完成编辑后再使用提示词';
                antdMessage.error({ key: inputModeConflictMsg, content: inputModeConflictMsg });
                return;
            }
        // 提示词调用,填入到会话输入文本框
        setFillText(text);
    };
    // 提示词调用,会话发送
    const sendByCueWord = (text: string) => {
        sendBasicMsgs(text);
    };

    // pdf 相关方法
    const onUploadDocModalClose: OnCloseFn = (type, data) => {
        setUploadDocModalOpen(false);
        if (type === 'success') {
            // 开启 pdf 新会话
            newConversation({ readDoc: data });
        }
    };

    const onChangeBranch = (parentMsgId: string, targetBranchNo: number) => {
        const lastMsg = getBranchLast(parentMsgId, targetBranchNo, messageMap);
        setBranchLastMsg(lastMsg);

        // 滚动到底部
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const renderList = useChatRender({
        messageMap,
        branchLastMsg,
        showConvList,

        readArticleFlag,
        readDocFlag,

        readArticleTaskLoading,
        readDocTaskLoading,
        loading,
        contentLoading,
        summaryLoading,
        summaryDoneStatus,
        messageLoading,
        conversationLoading: isConversationPending,

        welcome,
        guideQuestions: welcomeData?.questions ?? [],
        curSendMsg,
        currSendSelection,
        lastQuestion,
        lastAnswer,
        conversationOptions: options,
        loadingMsg: pendingMsg,

        // 方法
        onGuideClick,
        onEditQuestion,
        onChangeAnswer,
        onChangeSearch,
        onAddPrompt,
        onEditAnswer,
        onFeedback,
        onClickSuggest,
        onReferClick,
        onChangeBranch,
        getWebDocUrl
    });

    const showReadArticle = readArticlePermission;
    const showReadDoc = readDocPermission?.entry;
    const showRetry = isBlockedError;
    const showEditQuestion = isBlockedError && !['read_article', 'read_doc'].includes(lastQuestion?.contentType || '');
    const showPause = !loading && messageLoading;
    const showFloatActions =
        showReadArticle || showReadDoc || showRetry || showEditQuestion || showPause || showWebSearch;

    return (
        <div className={styles.conversation}>
            <div
                className={classNames(styles.body, {
                    [styles.showFloatActions]: showFloatActions,
                    [styles.paddingBottom]: isH5 && showWebSearch
                })}>
                {/* 模型介绍卡片 */}
                {modelCardPermission && <RobotInfoCard style={{ marginBottom: '16px' }} showFiexd={showFixed} />}
                {/* 提示词 */}
                {promptPermission.show && (
                    <div style={!showPrompt ? { zIndex: -1, opacity: 0, position: 'absolute', width: 0 } : {}}>
                        <Prompt
                            ref={cueWordRef}
                            sendByCueWord={sendByCueWord}
                            fillInInput={fillInInput}
                            showLang={showPrompt}
                            lang={lang}
                            setLang={setLang}
                        />
                    </div>
                )}
                {renderList.map(({ key, ...bubbleProps }) => (
                    <ChatBubble key={key} multimodal={multimodal} {...webSearchInfo} {...bubbleProps} />
                ))}
                {/* selection 会话区快捷操作 */}
                {selectionPermission &&
                    !!selectTextToShow &&
                    !!sendValidate({ error: true, edit: true, loading: true }) && (
                        <div className={styles.selectionActions}>
                            {SELECTION_ACTIONS.map((item) => {
                                const { key, title, icon } = item;
                                return (
                                    <Button key={key} size="small" icon={icon} onClick={() => sendSelectionMsgs(key)}>
                                        {title}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                {/* 占位符，滚动用 */}
                <div ref={messageEnd} style={{ clear: 'both', height: '1px', width: '100%' }} />
            </div>
            {/* 操作项 */}
            <Form form={form} initialValues={{ searchText: '', editText: '' }} preserve>
                {isH5 ? (
                    <H5ChatInputAction
                        theme="bg"
                        floatBtn={
                            showFloatActions ? (
                                <ChatFloatAction
                                    config={{
                                        readArticle: showReadArticle,
                                        readDoc: showReadDoc,
                                        webSearch: showWebSearch && isH5
                                    }}
                                    readArticleConfig={{
                                        onClick: () => newConversation({ readArticle: true }),
                                        loading: readArticleTaskLoading,
                                        progress: readArticleProgress || 0,
                                        progressStage: readArticleProgressStage
                                    }}
                                    readDocConfig={{
                                        onClick: () => setUploadDocModalOpen(true),
                                        loading: readDocTaskLoading,
                                        progress: readDocProgress || 0,
                                        progressStage: readDocProgressStage
                                    }}
                                    errorConfig={{
                                        showRetry,
                                        showEditQuestion,
                                        onRetry: () => onRetry(lastAnswer!),
                                        onEditQuestion: () => onEditQuestion(lastQuestion!)
                                    }}
                                    webSearchConfig={{
                                        webSearch,
                                        onChangeWebSearch
                                    }}
                                    pauseConfig={{
                                        show: showPause,
                                        onClick: () => pauseRequest()
                                    }}
                                />
                            ) : (
                                <></>
                            )
                        }
                        newConversation={() => newConversation()}
                        openHistory={() => setIsShowHistory(true)}
                        openPrompts={() => setIsShowPrompt(true)}
                        showDrawer={showCueWordDrawer}
                        fillText={fillText}
                        setFillText={setFillText}
                        editQuestion={editQuestion}
                        setEditQuestion={setEditQuestion}
                        inputConfig={{
                            form,
                            field: !editQuestion ? 'searchText' : 'editText',
                            sendValidate,
                            sendFn: !editQuestion ? sendInput : sendEditedMsgs
                        }}
                    />
                ) : (
                    <ChatInputAction
                        theme="border"
                        floatBtn={
                            showFloatActions ? (
                                <ChatFloatAction
                                    config={{
                                        readArticle: showReadArticle,
                                        readDoc: showReadDoc,
                                        webSearch: showWebSearch && isH5
                                    }}
                                    readArticleConfig={{
                                        onClick: () => newConversation({ readArticle: true }),
                                        loading: readArticleTaskLoading,
                                        progress: readArticleProgress || 0,
                                        progressStage: readArticleProgressStage
                                    }}
                                    readDocConfig={{
                                        onClick: () => setUploadDocModalOpen(true),
                                        loading: readDocTaskLoading,
                                        progress: readDocProgress || 0,
                                        progressStage: readDocProgressStage
                                    }}
                                    errorConfig={{
                                        showRetry,
                                        showEditQuestion,
                                        onRetry: () => onRetry(lastAnswer!),
                                        onEditQuestion: () => onEditQuestion(lastQuestion!)
                                    }}
                                    webSearchConfig={{
                                        webSearch,
                                        onChangeWebSearch
                                    }}
                                    pauseConfig={{
                                        show: showPause,
                                        onClick: () => pauseRequest()
                                    }}
                                />
                            ) : (
                                <></>
                            )
                        }
                        langOptions={langOptions}
                        newConversation={() => newConversation()}
                        openHistory={() => setIsShowHistory(true)}
                        openPrompts={() => setIsShowPrompt(true)}
                        showWebSearch={showWebSearch}
                        searchConfig={{
                            webSearch,
                            onChangeWebSearch
                        }}
                        fillText={fillText}
                        setFillText={setFillText}
                        editQuestion={editQuestion}
                        setEditQuestion={setEditQuestion}
                        inputConfig={{
                            form,
                            field: !editQuestion ? 'searchText' : 'editText',
                            sendValidate,
                            sendFn: !editQuestion ? sendInput : sendEditedMsgs
                        }}
                    />
                )}
            </Form>
            <HistoryLog
                open={isShowHistory}
                onClose={() => setIsShowHistory(false)}
                model={model}
                conversationId={convId}
                onItemClick={onHistoryClick}
                getWebDocUrl={getWebDocUrl}
                docId={isDocChat ? options?.readDoc?.docId : undefined}
                isUrlClick={showPrompt}
            />
            <PromptDrawer
                open={isShowPrompt}
                onClose={() => setIsShowPrompt(false)}
                editCueWord={showCueWordModal}
                showDrawer={showCueWordDrawer}
            />
            <EditAnswer open={!!editAnswer} onClose={() => setEditAnswer('')} text={editAnswer} />
            <ChatReferModal open={!!referInfo} onCancel={() => setReferInfo(null)} content={referInfo} />
            {uploadDocModalOpen && <UploadDocModal onClose={onUploadDocModalClose} />}
        </div>
    );
};
