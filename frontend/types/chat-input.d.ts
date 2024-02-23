interface IChatParam {
    key: string;
    value: string;
}
export type IChatParams = IChatParam[];
export interface IChatMedia {
    objId: string;
    size: number;
    suffix: string;
    tempUrl?: string | null;
    downloadUrl?: string;
    fileName: string;
    bucketName: string;
}
export type IChatMedias = IChatMedia[];
export interface IChatInputData {
    type: 'text' | 'image' | 'video' | 'template';
    value: IChatMedia | IChatParam | string;
}
export type IChatInputDatas = IChatInputData[];
export interface IChatInputSendData {
    type: 'text' | 'image' | 'video' | 'template';
    value: string;
}
export type IChatInputSendDatas = IChatInputSendData[];
export interface IImageLimit {
    fileFormat?: string[]; // 文件格式
    fileSize?: number; // 支持的文件大小
    maxNum: number; //文件个数
}
