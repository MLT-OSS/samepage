/**
 * TODO: 滚动位置记录 去除console
 */
import { useEffect, useState } from 'react';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { useConversationContext } from '@xm/context';
import { PAGE_SIZE } from '../..';

import styles from './index.module.less';

import type { IMAGE_CONVERSATION } from '@/types';
import type { IImageData } from '../..';

interface ITaskCheckProps {
    datas: IImageData[];
    onDataChange?: (datas: IImageData[]) => void;
}

const TaskCheck = (props: ITaskCheckProps) => {
    const { datas, onDataChange } = props;
    const { conversationState } = useConversationContext();
    const { allVisibilityState } = conversationState;

    const [isChecking, setIsChecking] = useState(false);

    const { run: getImageHistory } = useRequest<IMAGE_CONVERSATION.IImageHistoryRes>(
        services.imageConversation.history,
        {
            manual: true
        }
    );

    const { run: getLastImageHistory } = useRequest<IMAGE_CONVERSATION.IImageHistoryRes>(
        services.imageConversation.history,
        {
            manual: true
        }
    );
    const { run: getFirstImageHistory } = useRequest<IMAGE_CONVERSATION.IImageHistoryRes>(
        services.imageConversation.history,
        {
            manual: true
        }
    );

    const getHeadAndTailTasks = async (lastNo: number) => {
        const result = await Promise.all([
            getLastImageHistory({
                pageNo: 1,
                pageSize: 1,
                __xmMark: 'last',
                _fe_show_message_error: false
            }),
            getFirstImageHistory({
                pageNo: lastNo,
                pageSize: 1,
                __xmMark: 'first',
                _fe_show_message_error: false
            })
        ]);

        return result?.map((_) => _?.records?.[0]);
    };

    const checkTasks = async () => {
        // console.log('检查开始...');
        setIsChecking(true);
        try {
            const res = await getHeadAndTailTasks(Math.max(datas.length, 1));
            if (
                datas?.[datas?.length - 1]?.messageId !== res?.[0]?.messageId ||
                datas?.[0]?.messageId !== res?.[1]?.messageId
            ) {
                console.log('检查发现数据不一致，同步中...');
                const allDatas = await getImageHistory({
                    pageNo: 1,
                    pageSize: datas?.length || PAGE_SIZE,
                    __xmMark: 'sync',
                    _fe_show_message_error: false
                });
                const { records } = allDatas;
                onDataChange?.(records?.reverse());
                console.log('检查发现数据不一致，同步完成！');
            }
            setIsChecking(false);
        } catch (e) {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        if (allVisibilityState === 'visible') {
            checkTasks();
        }
    }, [allVisibilityState]);

    useEffect(() => {
        let updateTask: any = null;
        if (allVisibilityState === 'first' || allVisibilityState === 'visible') {
            updateTask = setInterval(() => {
                if (!isChecking) {
                    checkTasks();
                } else {
                    console.log('当前有检查在进行中...');
                }
            }, 3000);
        } else {
            clearInterval(updateTask);
        }

        return () => {
            clearInterval(updateTask);
        };
    }, [datas, isChecking, allVisibilityState]);

    return <div className={styles['task-check']} />;
};

export default TaskCheck;
