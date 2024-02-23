import { ReactNode } from 'react';
import { PostPromptsTypeSearchResponse } from '@/ytt-type/prompt';

export declare namespace CUE_WORD {
    type PromptRecordItem = PostPromptsTypeSearchResponse.records[0]; // 业务类型，目前只有鉴权异常，划分为请求异常一大类， 之后其他的通讯业务可追加

    interface CueWordItem {
        id?: string | number;
        desc?: string;
        name?: string;
    }

    interface PromptType {
        key: string;
        name: string;
    }

    interface IPromptDrawerProps {
        open?: boolean;
        onClose?: () => void;
        showDrawer?: (params: any) => void;
        editCueWord?: (params: any) => void;
    }
}
