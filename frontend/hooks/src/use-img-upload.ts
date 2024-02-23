import { useRef } from 'react';
import axios from 'axios';

export const useImgUpload = () => {
    const controller = useRef<AbortController | null>(null);

    return {
        upload: (url: string, file: File, onProgress?: (progress: number) => any) => {
            controller.current = new AbortController();
            return axios.put(url, file, {
                headers: {
                    'Content-Type': file.type
                },
                signal: controller.current.signal,
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
