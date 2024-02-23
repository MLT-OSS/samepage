import { PostBotStreamConvKeyMsgRequest, PostBotConvKeyMsgRequest } from '@/ytt-type/conversation';
import { ReactElement, ReactNode } from 'react';

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.less';
declare module '*.mp4';

declare module 'mockjs-fetch';

declare const VERSION: string;
declare const API_DOMAIN: string;
declare const PACKAGE_DOWNLOAD_PREFIX: string;
declare const wx: any;

declare global {
    type Modifiy<T, R> = Omit<T, keyof R> & R;
    interface Window {
        __wxjs_environment: string;
        __xm_async_scripts__: any;
    }
}

export interface ISelectionItem {
    key: string;
    title: string;
    icon: ReactElement;
}

export type IChatModelSSERequest = PostBotStreamConvKeyMsgRequest;
export type IPoolRequest = PostBotConvKeyMsgRequest;
export type ErrorType = 'timeout' | 'abort' | 'error';

export type IMessage = Omit<IChatModelSSERequest['messages'][0], undefined> & {
    title?: string;
    like?: 'dislike' | 'like' | 'unknown';
    suggest?: { key: string; text: string }[];
    reference?: { key: string; text: string }[];
    isShow?: boolean;
    // status:
    // SUCCESS : 正常
    // FAILED： 异常，失败
    // MSG_AUDIT_FAILED：普通审核失败（parent message 审核失败）;
    // INTENT_MSG_AUDIT_FAILED:审核失败（selected text 审核失败);
    // EXCEED_TOKEN: 超过token 限制
    status?: 'SUCCESS' | 'FAILED' | 'MSG_AUDIT_FAILED' | 'INTENT_MSG_AUDIT_FAILED' | 'EXCEED_TOKEN' | 'RUNNING'; // 标识消息状态
    progress?: number; // 阅读全文进度
    _fe_status?: 'unsend';
    pluse?: boolean;
    feSort?: number;
    children?: IMessage[];
};

export type ModelType = 'chat' | 'draw' | 'stateless_chat' | 'assistant_chat';

export * from './cue-word';
export * from './history-log';
export * from './conversation';
export * from './image-conversation';
export * from './libs/packages/response-error';
export * from './chat-bubble';
export * from './permission';
export * from './chat-input';
export * from './libs/packages/robot-shop';
export * from './external-msg';
export * from './libs/containers/conversation';
export * from './conv-context';
export * from './corp-register';
export * from './user';
