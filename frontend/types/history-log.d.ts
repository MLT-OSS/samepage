import { GetConversationListResponse } from '../ytt-type/conversation';
export declare namespace HISTORY_LOG {
    type Item = Exclude<GetConversationListResponse['records'], undefined>['0'];

    interface IListRes {
        otherTotal: number; // 额外的总数
        pageNo: number; // 当前页码
        records: Item[];
        size: number; // 当前页的详细总数
        total: number; // 总数
    }

    interface IReq {
        keyword?: string;
        model: string;
        pageNo: number;
        pageSize: number;
        currentId?: string; // 当前会话id
    }

    interface IUpdateTitleReq {
        conversationId: string;
        title: string;
    }

    interface IDeleteReq {
        conversationId: string;
    }
}
