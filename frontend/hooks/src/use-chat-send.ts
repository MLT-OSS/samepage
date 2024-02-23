import { v4 as uuidv4 } from 'uuid';
import type { IMessage } from '@/types';
import { TLanguage } from './use-lang';
import { useConversationContext } from '@xm/context';
import { CONV } from '@/types';
import { useModelPermission } from './use-model-permission';
import { CONV_CHAT_MAX_MSG_LENGTH, STORAGE_ONLINE_SEARCH } from '@/constants';
import { getSessionValue, safeParse, safeStringify } from '@/utils';
const SELECTION_HELP_TEXT = '您希望对文本进行什么操作？';

interface UseChatSendParams {
    model: string;
    conversationId: string | undefined;
    showWebSearch?: boolean;
    lang: TLanguage;
    conversationOptions: CONV.IConversationOptions;

    branchLastMsg: IMessage | undefined;
    messageMap: Map<string, IMessage>;
    showConvList: IMessage[];
    setBranchLastMsg: React.Dispatch<React.SetStateAction<IMessage>>;

    welcome: string;
    virtualRoot: boolean;
    editQuestion: IMessage | null;
    isBlockedError: boolean;

    requestStream: any;
    scrollToBottomAfterSend: any;
    sendValidate: any;
    setCurSendMsg: any;
    setCurrSendSelection: any;
    setEditQuestion: any;
}

interface SendParams {
    messages: IMessage[];
    sendCb?: () => any;
    webSearch?: string | undefined;
}
/**
 * 发送一共有 13 个场景，可以归类为 6 个大类
 * 1. 基础发送：用户输入（非选中文本）,使用提示词，点击引导词， 点击感兴趣的问题
 * 2. 选中页面文本：页面快捷操作，会话区快捷操作，页面选择完用户输入
 * 3. 编辑：编辑问题,报错情况下编辑问题
 * 4. 换个答案：换个答案， 重试（报错情况下换个答案）
 * 5. 阅读文章任务
 * 6. 阅读文档任务
 *
 * 上面 6 个大类，只是构造的消息不一样，发送逻辑是可以复用的，有一些场景下发送后需要一些额外处理
 *
 * 消息发送步骤：
 * 1. 校验当前是否可以发送
 * 2. 发送前清理操作
 * 3. 设置当前被发送的消息： setCurSendMsg, setCurrSendSelection
 * 4. 构造消息
 * 5. 发送
 * 6. 发送后清理
 */
export const useChatSend = (params: UseChatSendParams) => {
    const {
        model,
        conversationId,
        showWebSearch,
        lang,
        conversationOptions,
        messageMap,
        showConvList,
        branchLastMsg,
        setBranchLastMsg,
        welcome,
        virtualRoot,
        editQuestion,
        isBlockedError,
        requestStream,
        scrollToBottomAfterSend,
        sendValidate,
        setCurSendMsg,
        setCurrSendSelection,
        setEditQuestion
    } = params;
    const { conversationState, dispatch } = useConversationContext();
    const { selectText, selectTextToShow, quickActionPrompt = {} } = conversationState;
    const { langOptions } = useModelPermission();

    const webPageUrl = window.location.href;
    const webPageTitle = document.title || webPageUrl;

    const getQuickActionPrompt = (k: string) => {
        const prompt = quickActionPrompt[k] || k;
        if (k === '翻译') {
            const langLabel =
                lang === 'Auto' ? '当前浏览器语言' : langOptions.find((i: any) => i.value === lang)?.label || '-';
            return prompt.replace('$[lang]', langLabel);
        }
        return prompt;
    };

    const genWelcomeMsg = (welcomeText?: string, virtualRootMsg?: IMessage | null) => {
        const _welcome = welcomeText ?? welcome;
        if (!_welcome) {
            return null;
        }

        const msg: IMessage = {
            content: _welcome,
            contentType: 'welcome',
            conversationId,
            messageId: uuidv4(),
            parentMessageId: virtualRootMsg?.messageId,
            role: 'assistant'
        };
        return msg;
    };

    const genVirtualRootMsg = () => {
        if (!virtualRoot) {
            return null;
        }

        const msg: IMessage = {
            content: 'virtual_root',
            contentType: 'virtual_root',
            conversationId,
            messageId: uuidv4(),
            parentMessageId: undefined,
            role: 'assistant'
        };
        return msg;
    };

    const genRootMsg = (welcomeText?: string) => {
        const virtualRootMsg = genVirtualRootMsg();
        const welcomeMsg = genWelcomeMsg(welcomeText, virtualRootMsg);
        // 无论有没有欢迎语都需要拼接虚拟根节点
        const messages = [...(virtualRootMsg ? [virtualRootMsg] : []), ...(welcomeMsg ? [welcomeMsg] : [])];
        return messages;
    };

    const genSelectionMsg = (parendMsgId: string) => {
        const realMessageId = uuidv4();
        const list: IMessage[] = [
            {
                content: selectText,
                contentType: 'intent',
                conversationId,
                intentId: realMessageId,
                messageId: realMessageId,
                parentMessageId: parendMsgId,
                role: 'assistant'
            },
            {
                content: SELECTION_HELP_TEXT,
                contentType: 'intent',
                conversationId,
                intentId: realMessageId,
                messageId: uuidv4(),
                parentMessageId: realMessageId,
                role: 'assistant'
            }
        ];
        return list;
    };

    const getWebSearch = async (webSearch: string | undefined) => {
        let isSearchMsg = 'NONE';
        if (!showWebSearch) {
            return isSearchMsg;
        }

        if (webSearch === 'FORCE' || webSearch === 'NONE') {
            // 气泡上强制转换
            isSearchMsg = webSearch;
        } else {
            // smart
            isSearchMsg = ((await getSessionValue(STORAGE_ONLINE_SEARCH)) as string) || 'NONE';
        }
        return isSearchMsg;
    };

    // 截取 input 类型消息
    // 单个 text 限制 10w, 其他的暂时不做处理
    const sliceInputMsg = (content: string) => {
        const contentObj = safeParse(content);
        const newContentObj = contentObj.map((i: any) => ({
            ...i,
            value: i.value && i.type === 'text' ? i.value.slice(0, CONV_CHAT_MAX_MSG_LENGTH) : i.value
        }));
        return safeStringify(newContentObj);
    };

    // 如果是 input 则按照对应规则截取， 否则直接截取
    const sliceMsg = (message: IMessage) => {
        const { content, contentType } = message;
        const sliceContent = content
            ? contentType === 'input'
                ? sliceInputMsg(content)
                : content.slice(0, CONV_CHAT_MAX_MSG_LENGTH)
            : content;
        return {
            ...message,
            content: sliceContent
        };
    };

    // isSearchMsg 最后一条消息的更换联网搜索还是模型搜索，与全局的isSearch可以互斥，进作用于当前一条消息发送
    const _send = async (sendParams: SendParams) => {
        const { messages, sendCb, webSearch } = sendParams;
        // 将 messages content 统一截取
        const newMessage: IMessage[] = messages.map((i) => sliceMsg(i));
        const isSearchMsg = await getWebSearch(webSearch);

        requestStream({
            conversationId,
            webUrl: webPageUrl,
            title: webPageTitle,
            model,
            language: lang,
            webSearch: isSearchMsg,
            messages: newMessage
        });
        scrollToBottomAfterSend();
        sendCb?.();
    };
    // 生成消息
    const genBasicMsgs = (text: string, files?: []) => {
        const rootMsg = genRootMsg();

        // 计算 parentMsgId
        const parentMsgId = (branchLastMsg as IMessage)?.messageId ?? rootMsg[rootMsg.length - 1]?.messageId;
        const filesObject = !!files && files?.length > 0 ? getMjFiles(files || []) : [];
        const content = safeStringify([
            {
                type: 'text',
                value: text
            },
            ...filesObject
        ]);

        const message: IMessage = {
            content,
            contentType: 'input',
            conversationId,
            messageId: uuidv4(),
            parentMessageId: parentMsgId,
            role: 'user'
        };
        const messages = [...rootMsg, message];

        return messages;
    };
    // 生成明敬消息
    const getMjFiles = (files: []) => {
        const _files = files.map((i: any) => {
            const { type, value } = i;
            return { type, value: safeStringify(value) };
        });
        return _files;
    };

    const genSelectionMsgs = (text: string, welcome?: string) => {
        const rootMsg = genRootMsg(welcome);

        const selectionParentMsgId = (branchLastMsg as IMessage)?.messageId ?? rootMsg[rootMsg.length - 1]?.messageId;
        const selectionMsg = genSelectionMsg(selectionParentMsgId);

        const message: IMessage = {
            content: text,
            contentType: 'intent',
            conversationId,
            intentId: selectionMsg[1].intentId,
            messageId: uuidv4(),
            parentMessageId: selectionMsg[1].messageId,
            role: 'user'
        };
        const messages = [...rootMsg, ...selectionMsg, message];
        return messages;
    };

    const findUnsendMsgs = (messages: IMessage[]) => {
        let unsendMsgs: IMessage[] = [];
        let successFlag = false;
        unsendMsgs = messages
            ?.reverse()
            ?.filter((i) => {
                if (successFlag) {
                    return false;
                }
                if (i._fe_status === 'unsend') {
                    return true;
                } else {
                    successFlag = true;
                    return false;
                }
            })
            ?.reverse()
            ?.map((i) => ({ ...i, _fe_status: undefined, children: undefined }));
        return unsendMsgs;
    };

    const genEditedMsgs = (text: string) => {
        // unsend messages
        let unsendMsgs: IMessage[] = [];
        if (isBlockedError) {
            const parentMessageIdx = showConvList.findIndex((i) => i.messageId === editQuestion?.parentMessageId);
            unsendMsgs = findUnsendMsgs(showConvList?.slice(0, parentMessageIdx + 1));
        }

        const content = editQuestion?.contentType === 'input' ? safeStringify([{ type: 'text', value: text }]) : text;
        const newMessage: IMessage = {
            ...editQuestion!,
            messageId: uuidv4(),
            content
        };
        return [...unsendMsgs, { ...newMessage, children: undefined }];
    };

    const genRetryMsgs = (message: IMessage) => {
        const questionMessage = messageMap.get(message.parentMessageId);
        if (!isBlockedError) {
            return questionMessage ? [{ ...questionMessage, children: undefined }] : [];
        }

        const curMsgIdx = showConvList.findIndex((i) => i.messageId === message.messageId);
        const newConversationList = curMsgIdx > -1 ? [...showConvList.slice(0, curMsgIdx)] : showConvList;

        let messages = findUnsendMsgs(newConversationList);

        // 存在阻塞问题，但是在其他分支已被unsend 置为undefined
        messages =
            messages?.length > 0 ? messages : questionMessage ? [{ ...questionMessage, children: undefined }] : [];

        return messages;
    };

    const genArticleTaskMsgs = (taskId: string) => {
        const rootMsg = genRootMsg(welcome);
        const parentMsgId = rootMsg[rootMsg.length - 1]?.messageId;
        const message: IMessage = {
            taskId,
            contentType: 'read_article',
            messageId: uuidv4(),
            parentMessageId: parentMsgId,
            role: 'user'
        };
        const messages = [...rootMsg, message];
        return messages;
    };

    const genDocTaskMsgs = (id: string, type: 'new' | 'append') => {
        const docLinkMsgId = uuidv4();
        const docLinkMsg: IMessage = {
            content: safeStringify(conversationOptions?.readDoc),
            contentType: 'doc_link',
            messageId: docLinkMsgId,
            role: 'assistant'
        };
        const message: IMessage = {
            [type === 'new' ? 'taskId' : 'docId']: id,
            contentType: 'read_doc',
            messageId: uuidv4(),
            parentMessageId: docLinkMsgId,
            role: 'user'
        };
        const messages = [docLinkMsg, message];
        return messages;
    };

    // 发消息
    const sendBasicMsgs = (text: string, files?: []) => {
        if (!sendValidate({ loading: true, error: true, edit: true }, true)) {
            return true;
        }
        setCurSendMsg({ text, files });
        const messages = genBasicMsgs(text, files);
        _send({
            messages
        });
    };

    const sendSelectionMsgs = (text: string, isQuick = true, welcome?: string) => {
        if (!sendValidate({ loading: true, error: true, edit: true }, true)) {
            return true;
        }
        const sendText = isQuick ? getQuickActionPrompt(text) : text;
        setCurSendMsg({ text: sendText });
        setCurrSendSelection(selectTextToShow);
        const messages = genSelectionMsgs(sendText, welcome);
        _send({
            messages,
            sendCb: () => {
                dispatch({ type: 's_clear' });
            }
        });
    };
    const sendEditedMsgs = (text: string) => {
        if (!sendValidate({ loading: true }, true)) {
            return true;
        }

        setCurSendMsg({ text });
        const messages = genEditedMsgs(text);
        // editAnsShowBrnach -> question, 拼写错误
        _send({
            messages,
            sendCb: () => {
                const lastParentId: string = messages[messages?.length - 1]?.parentMessageId || '';
                // 避免编辑问题的时候，问题和答案公用一个branchLength，增加editAnsShowBrnach字段
                setBranchLastMsg({ ...messageMap.get(lastParentId), editAnsShowBrnach: true });
                setEditQuestion(null);
            }
        });
    };
    const sendRetryMsgs = (message: IMessage, webSearch?: string) => {
        if (!sendValidate({ loading: true }, true)) {
            return true;
        }
        const messages = genRetryMsgs(message);
        _send({
            messages,
            webSearch: webSearch,
            sendCb: () => {
                setBranchLastMsg({ ...messages[messages?.length - 1] });
            }
        });
    };
    const sendArticleTaskMsgs = (taskId: string) => {
        const messages = genArticleTaskMsgs(taskId);
        _send({
            messages
        });
    };
    const sendDocTaskMsgs = (taskId: string, type: 'new' | 'append' = 'new') => {
        const messages = genDocTaskMsgs(taskId, type);
        _send({
            messages
        });
    };

    return {
        sendBasicMsgs,
        sendSelectionMsgs,
        sendEditedMsgs,
        sendRetryMsgs,
        sendArticleTaskMsgs,
        sendDocTaskMsgs
    };
};
