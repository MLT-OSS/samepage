/**
 * 聊天模型 render conversation list
 */

import { useConversationContext } from '@xm/context';
import { IMessage, CONV, CHAT_BUBBLE } from '@/types';
import { useChatPermission } from './use-chat-permission';
import { safeParse, safeStringify } from '@/utils';

// 后端 contentType 和气泡类型的映射
// 后端的类型考虑一些数据逻辑，所以前后端不做对齐
const CONTENT_TYPE_MAP: Partial<Record<IMessage['contentType'], CHAT_BUBBLE.ChatBubbleProps['type']>> = {
    text: 'normal',
    input: 'input',
    reply_input: 'input',
    web_search: 'web-search',
    intent: 'selection',
    reply_summary: 'summary',
    reply_source: 'refer',
    welcome: 'welcomes',
    doc_link: 'doc-link',
    reply_doc_source: 'doc-refer'
};
const SELECTION_HELP_TEXT = '您希望对文本进行什么操作？';

type BubblePropsWithKey = CHAT_BUBBLE.ChatBubbleProps & { key: string };
type BranchLastMsg = IMessage & { editAnsShowBrnach?: boolean };
interface CurSendMsg {
    text?: string;
    files?: any;
}

interface UseChatRenderParams {
    messageMap: Map<string, IMessage>;
    branchLastMsg: BranchLastMsg | undefined;
    showConvList: IMessage[];

    readArticleFlag: boolean;
    readDocFlag: boolean;

    readArticleTaskLoading: boolean;
    readDocTaskLoading: boolean;
    loading: boolean; // 从 send 到返回第一条 message 记为 true
    contentLoading: boolean; // 从 send 到返回第一条有内容 content 记为 true
    summaryLoading: boolean; // 从 send 到 summaryDone 记为 true
    summaryDoneStatus: boolean; // summaryDone 状态
    messageLoading: boolean; // 从 send 到 "finished" 记为 true
    conversationLoading: boolean; // taskLoading || messageLoading

    welcome: string;
    guideQuestions?: string[];
    curSendMsg: CurSendMsg;
    currSendSelection: string;
    lastQuestion: IMessage | null;
    lastAnswer: IMessage | null;
    conversationOptions: CONV.IConversationOptions;
    loadingMsg: IMessage | null;

    // 方法
    onGuideClick: (text: string) => void;
    onEditQuestion: (message: IMessage) => void;
    onChangeAnswer: (message: IMessage) => void;
    onChangeSearch: (message: IMessage, webSearch: string) => void;
    onAddPrompt: (text: string) => void;
    onEditAnswer: (text: string) => void;
    onFeedback: (message: IMessage, status: boolean) => void;
    onClickSuggest: (text: string) => void;
    onReferClick: (type: CHAT_BUBBLE.ChatBubbleType, data: CHAT_BUBBLE.IRefer['reference']['0']) => void;
    onChangeBranch?: (parentMsgId: string, targetBranchNo: number) => any;
    getWebDocUrl: (params?: { docId?: string | undefined; conversationId?: string | undefined }) => Promise<string>;
}

// eslint-disable-next-line complexity
export const useChatRender = (params: UseChatRenderParams) => {
    const {
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
        conversationLoading,
        welcome,
        guideQuestions = [],
        curSendMsg,
        currSendSelection,
        lastQuestion,
        lastAnswer,
        conversationOptions,
        loadingMsg,
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
    } = params;
    const { conversationState, dispatch } = useConversationContext();
    const { selectTextToShow } = conversationState;
    const { guidePermission, welcomePermission, readDocPermission, selectionPermission } = useChatPermission();

    const isReadDocSummaryLoading = readDocFlag && messageLoading && !messageMap?.size;
    const showCurrSendMsg = !!curSendMsg?.text || curSendMsg?.files?.length > 0;

    /**
     * 欢迎语
     *
     * welcome 有值的时候显示
     *
     * 1. readDoc 的时候，发消息之前显示
     * 2. 非 readDoc 的时候，一直显示
     */
    const showWelcome = welcomePermission && (!readDocFlag || (readDocFlag && !isReadDocSummaryLoading)) && !!welcome;
    /**
     * 引导问题
     *
     * 1. 阅读全文的时候: taskLoading 的时候显示
     * 2. 阅读文档的时候: taskLoading 的时候显示
     * 3. 其他: 发第一条消息前显示
     */
    const showGuideQuestion =
        guidePermission &&
        ((readDocFlag && readDocTaskLoading) ||
            (readArticleFlag && readArticleTaskLoading) ||
            (!readArticleFlag && !readDocFlag && !showCurrSendMsg && !messageMap.size));
    /** 文档跳转: summary loading 的时候展示 */
    const showConvDocLink = readDocPermission?.docLink?.show;
    const showDocLink = readDocPermission?.docLink?.show && isReadDocSummaryLoading;
    const showCurrSendSelection = selectionPermission && !!currSendSelection;
    const showLoading = contentLoading;
    const showLoadingMsg = !!loadingMsg?.content;
    const showSelection = selectionPermission && !!selectTextToShow;

    const onSelectionCancel = () => {
        dispatch({ type: 's_page_cancel' });
    };

    // 拿到当前节点的所有兄弟节点，计算出当前节点在兄弟分支中第几位作为pageNo，所有兄弟节点作为pageSize
    const getBranchInfoByParent = (message: IMessage | undefined) => {
        const { parentMessageId, messageId } = message || {};
        const curLevelList = messageMap.get(parentMessageId)?.children;

        const branchLength: number = curLevelList?.length || 1;
        const branchIndex = curLevelList?.findIndex((i) => i.messageId === messageId);
        const branchNo = !!branchIndex && branchIndex > 0 ? branchIndex + 1 : 1;

        return { branchNo, branchLength };
    };

    // 拿到最后一条消息的children length
    // 因为默认值及查找的目标不一样，不多做逻辑与getBranchInfoByParent合并为同一个方法
    const getBranchLengthByLast = (message: IMessage | undefined) => {
        const { messageId } = message || {};
        const curLevelList = messageMap.get(messageId)?.children;
        return curLevelList?.length || 0;
    };

    const transformMessageToBubbleProps = (message: IMessage): CHAT_BUBBLE.ChatBubbleProps => {
        const { messageId, role, contentType, content, intentId, suggest, reference, like, status, question } = message;
        let type: CHAT_BUBBLE.ChatBubbleProps['type'] =
            contentType === 'intent'
                ? messageId === intentId
                    ? 'selection'
                    : 'selection-help'
                : CONTENT_TYPE_MAP[contentType as IMessage['contentType']] || 'normal';
        if (status && ['COMPLETED', 'RUNNING'].includes(status)) {
            type = 'running';
        }
        const position: CHAT_BUBBLE.ChatBubbleProps['position'] = role === 'user' ? 'right' : 'left';

        const isLast = !!(lastQuestion?.messageId === messageId || lastAnswer?.messageId === messageId);
        let data: CHAT_BUBBLE.ChatBubbleProps['data'] = content!;
        let files = [];
        if (type === 'summary') {
            data = {
                content: content!,
                suggest: suggest!,
                tokenExceed: status === 'EXCEED_TOKEN'
            };
        }
        if (['refer', 'doc-refer'].includes(type!)) {
            data = {
                content: content!,
                reference: reference!
            };
        }
        if (type === 'web-search') {
            const parseContent = safeParse(content || '[]');
            data = {
                content: parseContent?.[0]?.value,
                reference: reference!,
                question: question!
            };
        }
        if (type === 'input') {
            const parseContent = content && safeParse(content || '[]');
            data = parseContent?.[0]?.value;
            files =
                parseContent?.filter?.((item: any) => {
                    if (item.type === 'image' || item.type === 'video') {
                        item.value = safeParse(item.value);
                    }
                    return item.type === 'image' || item.type === 'video';
                }) || [];
        }

        const { branchNo, branchLength } = getBranchInfoByParent(message);

        return {
            position,
            type,
            data,
            files,
            last: isLast,
            feedback: like,
            branchNo,
            branchLength,
            message,
            closable: false,
            isConversationPending: conversationLoading,
            summaryLoading,
            summaryDoneStatus,
            error: status
                ? ['SUCCESS', 'EXCEED_TOKEN', 'RUNNING', 'COMPLETED'].includes(status)
                    ? undefined
                    : ['MSG_AUDIT_FAILED', 'INTENT_MSG_AUDIT_FAILED'].includes(status || '')
                    ? 'AUDIT'
                    : 'NORMAL'
                : undefined,
            conversationType: readDocFlag ? 'DOC' : conversationOptions.conversationType
        };
    };

    const guideQuestionBubbles = guideQuestions?.map((item) => {
        return {
            key: `_guide_bubble_${item}`,
            position: 'right',
            type: 'guide',
            data: item,
            onClick: onGuideClick
        };
    });

    const genConversationListBubbles = () => {
        const convListBubbles: BubblePropsWithKey[] = [];
        showConvList?.forEach((item: IMessage) => {
            const { messageId, isShow, contentType } = item;
            if (isShow === false) {
                return;
            }
            if (!showConvDocLink && contentType === 'doc_link') {
                return;
            }
            convListBubbles.push({
                key: messageId,
                ...transformMessageToBubbleProps(item),
                status: 'done',
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
        });
        return convListBubbles;
    };
    const genSelectionBubbles = (text: string, closable = false) => {
        const keyPrefix = closable ? '' : '_curr_send';
        return [
            {
                key: `${keyPrefix}_selection_bubble`,
                position: 'left',
                type: 'selection',
                data: text,
                onSelectionCancel,
                closable
            },
            {
                key: `${keyPrefix}_selection_help_bubble`,
                position: 'left',
                type: 'selection-help',
                data: SELECTION_HELP_TEXT
            }
        ];
    };

    // 最后一条消息的分支信息
    const branchLength = getBranchLengthByLast(branchLastMsg);
    const { editAnsShowBrnach } = branchLastMsg || {};
    const renderList: BubblePropsWithKey[] = [
        // 欢迎语
        showWelcome && { key: '_welcome_bubble', position: 'left', type: 'welcomes', data: welcome },
        // 引导问题
        ...(showGuideQuestion ? guideQuestionBubbles : []),
        // doc 跳转
        showDocLink && {
            key: '_doc_link_bubble',
            ...transformMessageToBubbleProps({
                messageId: '', // todo 用不上
                content: safeStringify(conversationOptions?.readDoc),
                contentType: 'doc_link',
                role: 'assistant'
            })
        },
        // 会话列表
        ...genConversationListBubbles(),
        // 当前正在提问的选中文本
        ...(showCurrSendSelection ? genSelectionBubbles(currSendSelection) : []),
        // 当前正在提问的问题
        showCurrSendMsg && {
            key: '_curr_send_bubble',
            type: 'input',
            position: 'right',
            files: curSendMsg?.files,
            data: curSendMsg?.text,
            branchLength: branchLength + 1,
            branchNo: branchLength + 1,
            isConversationPending: conversationLoading
        },
        // loading
        showLoading && {
            key: '_loading_bubble',
            position: 'left',
            loading: true,
            data: '',
            branchLength: editAnsShowBrnach ? 1 : branchLength + 1,
            branchNo: editAnsShowBrnach ? 1 : branchLength + 1
        },
        // 正在返回的法案
        showLoadingMsg && {
            key: '_loading_msg_bubble',
            ...transformMessageToBubbleProps(loadingMsg),
            branchLength: editAnsShowBrnach ? 1 : branchLength + 1,
            branchNo: editAnsShowBrnach ? 1 : branchLength + 1
        },
        // 当前选中的文本
        ...(showSelection ? genSelectionBubbles(selectTextToShow, true) : [])
    ].filter(Boolean) as BubblePropsWithKey[];

    return renderList;
};
