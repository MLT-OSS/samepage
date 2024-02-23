import { IMessage, IChatModelSSERequest, ErrorType, IChatInputSendDatas, IChatInputSendData } from '@/types';
import { useRef, useState } from 'react';
import services from '@xm/services';
import { replaceByIdx, safeParse, safeStringify, sseRequest } from '@/utils';
import { ERROR_MSG_MAP, SSE_ERROR, SSE_ERROR_TIMEOUT, SSE_ERROR_USER_ABORT } from '@/constants';
import { TLanguage } from './use-lang';
import { v4 as uuidv4 } from 'uuid';
import { useConversationContext } from '@xm/context';
import useRequest from '@ahooksjs/use-request';

type ISSERequest = IChatModelSSERequest;
interface UseChatParams {
    finishCb?: (message: IMessage, req: ISSERequest) => any;
    onMessageCb?: (message: IMessage, req: ISSERequest) => any;
    lang: TLanguage;
}
// 重试要区分是前端错误还是后端错误
// 中断需要区分 第一个字符之前还是之后
export const useChat = (params: UseChatParams) => {
    const { lang } = params;
    const stop = useRef<boolean>(false);
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const { key: model, type: modelType } = modelInfo || {};
    const [reqData, setReqData] = useState<ISSERequest | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // 问题发出之后，第一个 message 回来之前
    const [contentLoading, setContentLoading] = useState<boolean>(false); // 问题发出之后，答案第一个字符回来之前为 true
    const [messageLoading, setMessageLoading] = useState<boolean>(false); // 从消息发出到消息结束的全过程

    // fixme: for: summary 的特殊状态
    const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
    const [summaryDoneStatus, setSummaryDoneStatus] = useState<boolean>(false);

    const [pendingMsg, setPendingMsg] = useState<IMessage | null>(null); // 正在请求的 message

    const { run: stopMessage } = useRequest(services.conversation.stopMessage, {
        manual: true,
        onSuccess: () => {
            console.log('取消接口');
        },
        onError: () => {
            console.log('取消失败');
        }
    });
    const transformList = (
        prevList: { key: string; text: string }[] = [],
        curValue?: { key: string; text: string }
    ) => {
        if (!curValue) {
            return prevList;
        }
        const keyIdx = prevList.findIndex((i) => i.key === curValue.key);
        if (keyIdx === -1) {
            return [...prevList, curValue];
        }
        const prevValue = prevList[keyIdx];
        return replaceByIdx(prevList, keyIdx, { key: curValue.key, text: `${prevValue.text}${curValue.text}` });
    };
    const genErrorMsg = (_message: IMessage, reqData: ISSERequest | null, type: ErrorType = 'error') => {
        const message = _message || {};
        const errorMsgList = ERROR_MSG_MAP[type] || ERROR_MSG_MAP.error;
        let parentMessageId;
        if (modelType === 'chat') {
            const chatModelReq = reqData as IChatModelSSERequest;
            parentMessageId = chatModelReq?.messages?.[chatModelReq?.messages?.length - 1]?.messageId;
        }
        const uid = uuidv4();
        return {
            ...message,
            messageId: message.messageId || `${modelType === 'stateless_chat' ? '_fe:' : ''}${uid}`,
            parentMessageId,
            role: 'assistant',
            content: lang === 'Chinese' ? errorMsgList[0] : errorMsgList[1],
            contentType: 'text', // 错误写死类型为 contentType
            status: 'FAILED'
        } as any;
    };

    const concatJsonData = (oldMsg: IMessage, newMsg: IMessage) => {
        let newData = '';
        if (['web_search', 'input', 'reply_input'].includes(newMsg?.contentType)) {
            const newContent = safeParse(newMsg?.content || '[]');
            const oldContent = safeParse(oldMsg?.content || '[]');
            if (oldContent?.[0]?.value || newContent?.[0]?.value) {
                if (newContent?.[0]?.type === 'image' || newContent?.[0]?.type === 'video') {
                    newData = safeStringify([
                        ...oldContent,
                        {
                            type: newContent?.[0]?.type,
                            value: `${newContent?.[0]?.value || ''}`
                        }
                    ]) as string;
                } else {
                    newData = safeStringify([
                        {
                            type: newContent?.[0]?.type,
                            value: `${oldContent?.[0]?.value || ''}${newContent?.[0]?.value || ''}`
                        }
                    ]) as string;
                }
            }
        } else {
            newData = `${oldMsg?.content || ''}${newMsg?.content || ''}`;
        }
        return newData;
    };

    // finished 有下面几种可能的值
    // 1. DONE: 成功。（后端错误消息结构不变，用 status 标识）
    // 2. TIMEOUT: 超时
    // 3. USER_ABORT 用户中止
    // 4. ERROR:xxx: 其他错误
    const onMessage = (message: IMessage & { finished?: string }) => {
        // 开始接收消息

        // 设置 loading 状态
        setLoading(false);
        if (message?.content) {
            // content 有值，设置 loading 为 false
            // 其他情况，继承之前的状态
            setContentLoading(false);
        }

        if (message.pluse) {
            return;
        }

        setSummaryDoneStatus(message?.finished === 'SUMMARY_DONE');
        if (message?.finished === 'SUMMARY_DONE') {
            // message?.finished 有值，设置 loading 为 false
            // 其他情况，继承之前的状态
            setSummaryLoading(false);
        }

        // 正常中止
        if (message.finished === 'DONE') {
            setPendingMsg((oldMsg) => {
                setReqData((oldReqData) => {
                    params?.finishCb?.(oldMsg!, oldReqData!);
                    return null;
                });
                return null;
            });
            setMessageLoading(false);
            setContentLoading(false);
            return;
        }

        // 用户中止
        if (message.finished === SSE_ERROR_USER_ABORT) {
            setPendingMsg((oldMsg) => {
                setReqData((oldReqData) => {
                    // 如果 old pending msg 有内容，用当前的内容 “成功” 回调给外层
                    // 如果 old pending msg 没有内容，填充 abort 文案，将该 “错误” 回调给外层
                    let newMessage: any = null;
                    if (oldMsg?.content) {
                        newMessage = oldMsg;
                    } else {
                        const msg = genErrorMsg(oldMsg!, oldReqData, 'abort');
                        newMessage = msg;
                    }
                    params?.finishCb?.(newMessage!, oldReqData!);
                    if (stop.current) {
                        stop.current = false;
                        stopMessage({
                            ...newMessage,
                            key: model || ''
                        });
                    }
                    return null;
                });
                return null;
            });
            setMessageLoading(false);
            setContentLoading(false);
            return;
        }

        // 前端超时
        if (message.finished === SSE_ERROR_TIMEOUT) {
            setPendingMsg((oldMsg) => {
                setReqData((oldReqData) => {
                    // 填充 timeout 文案，将该 “错误” 回调给外层
                    params?.finishCb?.(genErrorMsg(oldMsg!, oldReqData, 'timeout'), oldReqData!);

                    return null;
                });
                return null;
            });
            setMessageLoading(false);
            setContentLoading(false);
            return;
        }

        // 前端其他错误
        if (message.finished?.indexOf(SSE_ERROR) === 0) {
            setPendingMsg((oldMsg) => {
                setReqData((oldReqData) => {
                    // 填充 错误 文案，将该 “错误” 回调给外层
                    params?.finishCb?.(genErrorMsg(oldMsg!, oldReqData, 'error'), oldReqData!);

                    return null;
                });
                return null;
            });
            setMessageLoading(false);
            setContentLoading(false);
            return;
        }

        // 后端报错
        if (new Set(['FAILED', 'MSG_AUDIT_FAILED', 'INTENT_MSG_AUDIT_FAILED']).has(message.status as any)) {
            setPendingMsg(message);
            return;
        }

        // 正常接收消息
        setPendingMsg((oldMsg) => ({
            ...message,
            content: concatJsonData(oldMsg as IMessage, message),
            title: `${oldMsg?.title || ''}${message.title || ''}`,
            question: `${oldMsg?.question || ''}${message.question || ''}`,
            // 处理 suggest 和 reference
            // 接口返回格式: { key, text }
            // 目标格式: { key, text }[]
            suggest: transformList(oldMsg?.suggest, message?.suggest as any),
            reference: transformList(oldMsg?.reference, message?.reference as any)
        }));
        params?.onMessageCb?.(pendingMsg!, reqData!);
    };
    const isReadTaskReq = (data: IChatModelSSERequest) => {
        const messages: IMessage[] = data.messages || [];
        const lastMessage: IMessage | undefined = messages?.length ? messages[messages?.length - 1] : undefined;
        return ['read_article', 'read_doc'].includes(lastMessage?.contentType);
    };
    // 插件直接回传数据，不区分类型，和开发侧对齐
    const { runSseRequest, cancelSseRequest } = sseRequest(`bot/stream/conv/${model}/msg`, {
        onSuccess: (data) => {
            onMessage(data);
        },
        onError: () => {
            console.log('打印错误');
        }
    });
    // 中止
    const pauseRequest = (type?: string) => {
        if (type === 'system') stop.current = false;
        cancelSseRequest();
    };
    // 过滤request的文件tempUrl
    const filterTempUrl = (data: IChatModelSSERequest) => {
        const { messages } = data;
        const newMessage = messages?.map((i) => {
            if (i.contentType === 'input') {
                const inputs: IChatInputSendDatas = safeParse(i.content);
                const handelArr = inputs.map((item: IChatInputSendData) => {
                    const value: any = safeParse(item.value);
                    if (item.type === 'image' || item.type === 'video') {
                        const { tempUrl, ...rest } = value;
                        return { type: item.type, value: safeStringify(rest) };
                    }
                    return item;
                });
                return {
                    ...i,
                    content: safeStringify(handelArr)
                };
            }
            return i;
        });
        return { ...data, messages: newMessage };
    };
    const requestStream = (data: IChatModelSSERequest) => {
        setLoading(true);
        setContentLoading(true);
        setMessageLoading(true);

        // 判断当前请求是不是 read_article/read_doc 请求，只有这种情况设置 summaryLoading
        if (isReadTaskReq(data)) {
            setSummaryLoading(true);
        }

        setReqData(data);

        // 过滤掉图片url
        const newData = filterTempUrl(data);
        // 发请求
        runSseRequest(newData);
        stop.current = true;
    };

    return {
        loading,
        contentLoading,
        messageLoading,

        summaryLoading,
        summaryDoneStatus,

        reqData,
        pendingMsg,

        // for 插件环境
        playRequest: requestStream,
        pauseRequest
    };
};
