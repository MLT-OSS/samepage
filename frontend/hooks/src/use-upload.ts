import { useRef } from 'react';
import axios from 'axios';

export const useUpload = () => {
    const controller = useRef<AbortController | null>(null);

    return {
        upload: (url: string, file: File, onProgress?: (progress: number) => any) => {
            const formData = new FormData();
            formData.append('file', file);

            controller.current = new AbortController();
            return axios.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 1 * 60 * 1000, // 1 分钟
                signal: controller?.current?.signal,
                onUploadProgress: (progressEvent) => {
                    const progress = ((progressEvent.loaded / (progressEvent as any).total) * 100).toFixed(0);
                    onProgress?.(+progress);
                }
            });
        },
        cancel: () => {
            controller?.current?.abort();
        }
    };
};
