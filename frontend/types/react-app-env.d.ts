/** 已转移至 index.d.ts */
declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.less';
declare module '*.json';
declare module '*.mp4';

declare module 'mockjs-fetch';

declare const VERSION: string;
declare const API_DOMAIN: string;
declare const PACKAGE_DOWNLOAD_PREFIX: string;
declare const wx: any;

declare global {
    type Modifiy<T, R> = Omit<T, keyof R> & R;
}
