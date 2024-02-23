export type IResponseErrorShowType = 'message' | 'notification';

export interface IResponseErrorEventData {
    code?: string | number;
    showType: IResponseErrorShowType;
    message: string;
}
