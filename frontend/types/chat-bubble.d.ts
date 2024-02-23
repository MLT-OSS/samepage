export declare namespace CHAT_BUBBLE {
    type INormalQuestion = string;

    type INormalAnswer = string;

    type IWelcomes = string;

    interface IRefer {
        content: string;
        reference: { key: string; text: string; position?: number[]; link?: string; title?: string }[];
        question?: string;
    }

    type ISelection = string;

    interface ISummary {
        content: string;
        suggest: { key: string; text: string }[];
        tokenExceed?: boolean; // token 超过最大限制 10w
    }

    type IGuide = string;

    type ChatBubbleType =
        | 'normal'
        | 'input'
        | 'web-search'
        | 'welcomes'
        | 'refer'
        | 'selection'
        | 'selection-help'
        | 'summary'
        | 'guide'
        | 'doc-link'
        | 'doc-refer'
        | 'running';

    interface ChatBubbleProps {
        branchLength?: number;
        branchNo?: number;
        multimodal?: boolean; // 多模态
        position: 'left' | 'right';
        type?: ChatBubbleType;
        last?: boolean;
        data: INormalQuestion | INormalAnswer | IWelcomes | IRefer | ISelection | ISummary | IGuide;
        files?: any[];
        feedback?: IMessage['like'];
        message?: IMessage;
        loading?: boolean;
        closable?: boolean;
        isConversationPending?: boolean;
        error?: 'NORMAL' | 'AUDIT';
        conversationType?: string; // 'DOC' 文档
        summaryLoading?: boolean;
        summaryDoneStatus?: boolean;
        showWebSearch?: boolean;
        webSearch?: string;
        status?: 'done'; // 还有其他
        onClick?: (text: string) => any; // 气泡点击事件，只有文本类型的气泡才可能有该事件
        onSelectionCancel?: () => any;
        onEditQuestion?: (message: IMessage) => any; // 编辑问题
        onChangeAnswer?: (message: IMessage) => any; // 换个答案
        onChangeSearch?: (message: IMessage, webSearch: string) => any; // 联网搜索
        onAddPrompt?: (text: string) => any; // 添加提示词
        onEditAnswer?: (text: string) => any; // 编辑答案
        onFeedback?: (message: IMessage, status: boolean) => any; // 反馈
        onClickSuggest?: (text: string) => any; // 点击总结全文建议
        onReferClick?: (type: ChatBubbleType, data: IRefer['reference']['0']) => any;
        onChangeBranch?: (parentMsgId: string, targetBranchNo: number) => any; // 切换分支
        getWebDocUrl?: ({ docId, conversationId }: { docId?: string; conversationId?: string }) => Promise<string>;
    }
}
