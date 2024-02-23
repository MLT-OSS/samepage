import { useEffect } from 'react';
import services from '@xm/services';
import useRequest from '@ahooksjs/use-request';

import type { IMAGE_CONVERSATION } from '@/types';
import type { IImageData } from '../..';

import styles from './index.module.less';

interface IImageDoingItemProps {
    id: string;
    children?: React.ReactNode;
    onDataChange?: (data: IImageData) => void;
}

const ImageDoingItem = (props: IImageDoingItemProps) => {
    const { id, children, onDataChange } = props;

    const {
        data: getTaskData,
        loading: getTaskLoading,
        run: getTask,
        error: getTaskError
    } = useRequest(services.imageConversation.result, {
        manual: true,
        onSuccess: (res: IMAGE_CONVERSATION.IImageRes) => {
            onDataChange?.({ messageId: id, ...res });
        }
    });

    useEffect(() => {
        // 首次立刻更新
        getTask({
            messageId: id
        });
        const updateTask = setInterval(() => {
            console.log(`更新任务${id}...${new Date()}`);
            getTask({
                messageId: id
            });
        }, 5000);

        return () => {
            clearInterval(updateTask);
        };
    }, [id]);

    return (
        <div className={styles['image-doing-item']} data-message-id={id}>
            {children}
        </div>
    );
};

export default ImageDoingItem;
