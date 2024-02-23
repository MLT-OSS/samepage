import { IMessage, IPoolRequest, ErrorType, IChatInputSendDatas, IChatInputSendData } from '@/types';
import { useRef, useState } from 'react';
import { TLanguage } from './use-lang';
import services from '@xm/services';
import { useConversationContext } from '@xm/context';
import useRequest from '@ahooksjs/use-request';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MSG_MAP } from '@/constants';
import { abortRequest, safeParse, safeStringify } from '@/utils';

type ISSERequest = IPoolRequest;
interface UseChatParams {
    finishCb?: (message: IMessage, req: ISSERequest) => any;
    lang: TLanguage;
}

/**
 * 轮询
 * 发送消息
 * 轮询
 * 中断
 *  * */
export const useChatPool = (params: UseChatParams) => {
    const abortObj = useRef<string>();
    const stop = useRef<boolean>(false);
    const { lang } = params;
    const {
        conversationState: { modelInfo }
    } = useConversationContext();
    const { key: model, type: modelType } = modelInfo || {};
    const [reqData, setReqData] = useState<IPoolRequest | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // 问题发出之后，第一个 message 回来之前
    const [contentLoading, setContentLoading] = useState<boolean>(false); // 问题发出之后，答案第一个字符回来之前为 true
    const [messageLoading, setMessageLoading] = useState<boolean>(false); // 从消息发出到消息结束的全过程

    // fixme: for: summary 的特殊状态
    const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
    const [summaryDoneStatus, setSummaryDoneStatus] = useState<boolean>(false);

    const [pendingMsg, setPendingMsg] = useState<IMessage | null>(null); // 正在请求的 message

    const genErrorMsg = (_message: IMessage, reqData: ISSERequest | null, type: ErrorType = 'error') => {
        const message = _message || {};
        const errorMsgList = ERROR_MSG_MAP[type] || ERROR_MSG_MAP.error;
        let parentMessageId;
        if (modelType === 'chat') {
            const chatModelReq = reqData as IPoolRequest;
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
    const abortInfo = () => {
        if (!stop.current) return;
        stop.current = false;
        setPendingMsg((oldMsg) => {
            setReqData((oldReqData: any) => {
                const newMessage = genErrorMsg(oldMsg!, oldReqData, 'abort');
                params?.finishCb?.(newMessage!, oldReqData!);
                stopMessage({ ...newMessage!, key: model || '' });
                return null;
            });
            return null;
        });
        setMessageLoading(false);
        setContentLoading(false);
    };
    const handelError = (error: any) => {
        const { data } = error;
        if (data.type === 'AbortError') {
            abortInfo();
        } else if (data.type === 'Timeout') {
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
        } else {
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
        }
    };
    // 发送消息
    const { run: sendMessage } = useRequest(services.conversation.sendMessage, {
        manual: true,
        onSuccess: (res: IMessage) => {
            setLoading(false);
            if (res.status === 'RUNNING') {
                // status要和流式的running返回一致
                setPendingMsg((oldMsg) => ({
                    ...res,
                    content: '',
                    status: 'SUCCESS'
                }));
                getMessageInfo(
                    {
                        key: model || '',
                        convId: res.conversationId || '',
                        msgId: res.messageId || ''
                    },
                    () => {
                        stop.current = true;
                        abortObj.current = uuidv4();
                        return abortObj.current;
                    }
                );
            }
            if (res.status !== 'RUNNING') {
                setContentLoading(false);
                setMessageLoading(false);
                setSummaryDoneStatus(res?.finished === 'SUMMARY_DONE');
                if (res?.finished === 'SUMMARY_DONE') {
                    // message?.finished 有值，设置 loading 为 false
                    // 其他情况，继承之前的状态
                    setSummaryLoading(false);
                }
                setPendingMsg((oldMsg) => {
                    setReqData((oldReqData: any) => {
                        params?.finishCb?.(res!, oldReqData!);
                        return null;
                    });
                    return null;
                });
            }
        },
        onError: (error) => {
            console.log('1111111 错误', error);
            handelError(error);
        }
    });
    // 轮询
    const { run: getMessageInfo, cancel: cancelMessageInfo } = useRequest(services.conversation.getMessageInfo, {
        manual: true,
        pollingInterval: 1000,
        throwOnError: true,
        onSuccess: (res: IMessage) => {
            if (res.status !== 'RUNNING') {
                stopGetMessageInfo();
                setContentLoading(false);
                setMessageLoading(false);
                setSummaryDoneStatus(res?.finished === 'SUMMARY_DONE');
                if (res?.finished === 'SUMMARY_DONE') {
                    // message?.finished 有值，设置 loading 为 false
                    // 其他情况，继承之前的状态
                    setSummaryLoading(false);
                }
                setPendingMsg((oldMsg) => {
                    setReqData((oldReqData: any) => {
                        params?.finishCb?.(res!, oldReqData!);
                        return null;
                    });
                    return null;
                });
            } else {
                setPendingMsg((oldMsg) => ({
                    ...res,
                    content: '',
                    status: 'SUCCESS'
                }));
            }
        },
        onError: (error) => {
            console.log('1111111 错误', error);
            stopGetMessageInfo();
            handelError(error);
        }
    });
    const { run: stopMessage } = useRequest(services.conversation.stopMessage, {
        manual: true,
        onSuccess: () => {
            console.log('取消接口');
        },
        onError: () => {
            console.log('取消失败');
        }
    });

    const stopGetMessageInfo = () => {
        cancelMessageInfo();
    };
    // 中止
    const pauseRequest = (type?: string) => {
        stopGetMessageInfo();
        abortRequest(abortObj.current);
        if (type === 'system') stop.current = false;
        abortInfo();
    };
    // 过滤request的文件tempUrl
    const filterTempUrl = (data: IPoolRequest) => {
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

    const playRequest = (data: IPoolRequest) => {
        setLoading(true);
        setContentLoading(true);
        setMessageLoading(true);

        setReqData(data);
        // 过滤掉图片url
        const newData = filterTempUrl(data);
        // 发请求
        sendMessage({ ...newData, key: model || '' });
    };

    return {
        loading,
        contentLoading,
        messageLoading,

        summaryLoading,
        summaryDoneStatus,

        reqData,
        pendingMsg,

        playRequest,
        pauseRequest
    };
};
