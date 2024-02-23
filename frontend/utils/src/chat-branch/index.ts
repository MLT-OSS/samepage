// 聊天分支信息处理
import type { IMessage } from '@/types';

// 全量消息的Map结构，增加了children字段，用于查找分支信息及节点信息(避免递归使用)
// map结构为key: messageId, value: message + children
export const getMessageMap = (newConvList: IMessage[]) => {
    const newMap = new Map(); // 存messageId,及所在的内存地址
    let tempObj;
    let parentMessageId;
    newConvList?.forEach((item, index) => {
        parentMessageId = item.parentMessageId;
        delete item.children;
        if (newMap.has(parentMessageId)) {
            if (!newMap.get(parentMessageId)?.children) {
                newMap.get(parentMessageId).children = [];
            }

            const obj = { ...item, feSort: index + 1 };
            newMap.get(parentMessageId)?.children.push(obj);
            newMap.set(item?.messageId, obj);
        } else {
            tempObj = { ...item, children: [], feSort: index + 1 };
            newMap.set(item?.messageId, tempObj);
        }
    });
    return newMap;
};

// 聊天分支结构中，链式查找，构建当前在展示的MessageList
export const getShowConvList = (msgId: string, messageMap: Map<string, IMessage>) => {
    // 根据最新的msg, 构建当前需要展示的分支List，用于构建RenderList
    const showConvList: IMessage[] = [];
    let latestMsgId: string = msgId;

    // 根据末梢节点的MessageId的parentMessageId链式查找父级并unshift进RenderList
    do {
        const convItem = messageMap.get(latestMsgId);
        if (convItem) {
            showConvList.unshift(convItem);
        }
        latestMsgId = convItem?.parentMessageId;
    } while (latestMsgId);

    return showConvList;
};

// 分支切换获取最新showList
export const getNewShowList = (parentMsgId: string, targetBranchNo: number, messageMap: Map<string, IMessage>) => {
    // 递归查找最新消息
    const latestMsg: IMessage = getBranchLast(parentMsgId, targetBranchNo, messageMap);

    const newShowConvList = getShowConvList(latestMsg.messageId, messageMap);
    return newShowConvList;
};

// 分支切换
export const getBranchLast = (parentMsgId: string, targetBranchNo: number, messageMap: Map<string, IMessage>) => {
    const parentMsg: IMessage | undefined = messageMap.get(parentMsgId);
    // 拿到切换分支的所有信息
    const targetMsg = (parentMsg?.children && parentMsg?.children[targetBranchNo - 1]) || {};
    // 递归查找最新消息
    const latestMsg: IMessage = findLastMessageId({ ...targetMsg }, messageMap);
    return latestMsg;
};

// 切分支的时候重新查找最新节点的messageId
export const findLastMessageId = (latestMsg: IMessage, messageMap: Map<string, IMessage>) => {
    // children字段会为空，每次都去messageMap拿完整数据
    let latest: IMessage = messageMap.get(latestMsg.messageId) || {};

    latest?.children?.forEach((item) => {
        const convItem = messageMap.get(item.messageId) || {};
        const { children, feSort } = convItem;
        latest = Number(latest.feSort) - Number(feSort) > 0 ? latest : convItem;

        if (children && children?.length > 0) {
            // 存在children递归将所有节点的时间戳进行比较
            latest = findLastMessageId(latest, messageMap);
        }
    });
    return latest;
};

// 将新消息放入messageMap
export const getUpdatedMessageMap = (newMessages: IMessage[], messageMap: Map<string, IMessage>) => {
    const newMap = new Map(messageMap);
    newMessages?.forEach((item) => {
        // 发送和返回的消息都没有children，需去newMap里获取--编辑问题
        const child = newMap.get(item?.messageId)?.children || [];
        const newMapMessage = { ...item, children: child, feSort: newMap.size + 1 };
        newMap.set(item?.messageId, newMapMessage);

        const parent = newMap.get(item?.parentMessageId);
        if (parent) {
            const child = newMap.get(item?.parentMessageId)?.children || [];
            const index = child?.findIndex((i) => i.messageId === item.messageId);
            let newChild = [...child];
            if (index > -1) {
                child?.splice(index, 1, item);
                newChild = [...child];
            } else {
                newChild = [...child, newMapMessage];
            }
            const obj = { ...parent, children: newChild };
            newMap.set(item?.parentMessageId, obj);
        }
    });

    return newMap;
};
