import services from '@xm/services';
import useRequest from '@ahooksjs/use-request';
import { useEffect, useState } from 'react';
import { TLanguage } from './use-lang';
import { GetTaskInfoResponse, PostTaskCreateResponse } from '@/ytt-type/task';
import { beforeGetBodyText } from '@/utils';
import { ASYNC_SCRIOPTS_ID, READ_PAGE_TEXT } from '@/constants';

/**
 * 阅读任务
 * 目前包含：阅读全文、阅读 pdf
 *
 * 分为 3 步:
 * 1. 创建任务
 * 2. 获取进度
 * 3. 返回消息
 */
export const useReadTask = (taskType: 'article' | 'doc', lang: TLanguage, sendFn: (taskId: string) => any) => {
    const [error, setError] = useState<boolean>(false); // 标记创建任务和获取任务阶段失败状态
    const [taskId, setTaskId] = useState<string | null>(null);
    const [progressStage, setProgressStage] = useState<string>('');
    const [progress, setProgress] = useState<number>(0); // 默认是 0

    const { run: createTask, loading: createTaskLoading } = useRequest(services.conversation.createTask, {
        manual: true,
        throwOnError: true,
        onSuccess(res: PostTaskCreateResponse) {
            setTaskId(res.taskId as string);
        },
        onError: () => {
            setError(true);
        }
    });
    const {
        run: getTaskInfo,
        cancel: cancelTaskInfo,
        loading: getTaskLoading,
        data: taskInfo
    } = useRequest(services.conversation.getTaskInfo, {
        manual: true, // 需要第一次执行 run 后才开始轮询
        pollingInterval: 500, // 轮询间隔，单位为毫秒。设置后，将进入轮询模式
        // pollingWhenHidden: true // 在页面隐藏时，是否继续轮询。默认为 true，即不会停止轮询
        /**
         * FIX ME
         * 该配置 去除了这个错误：Uncaught (in promise) useRequest has caught the exception, if you need to handle the exception yourself, you can set options.throwOnError to true.
         * 但是引入了 Uncaught (in promise) + 错误详情
         * 猜测是 useRequest 的问题： https://github.com/alibaba/hooks/issues/757
         */
        throwOnError: true,
        onSuccess: (res: GetTaskInfoResponse) => {
            setProgressStage(res.stage);
            setProgress((val) => {
                return res?.progress || val;
            });
        },
        onError: () => {
            setError(true);
            cancelTaskInfo();
        }
    });

    const getBodyText = async () => {
        let innerText = document.body.innerText;
        const _pageText = await beforeGetBodyText(location.href, document);
        if (_pageText) {
            innerText = _pageText;
        }
        const text = innerText
            ? innerText
                  .replace(/&#39;/g, "'")
                  .replace(/(\r\n)+/g, '\r\n')
                  .replace(/(\s{2,})/g, ' ')
                  .replace(/^(\s)+|(\s)$/g, '')
            : '';
        return text;
    };

    const start = async (params?: { docId?: string }) => {
        const { docId } = params || {};
        const data = taskType === 'article' ? { text: await getBodyText() } : { docId };
        const taskInfo: PostTaskCreateResponse = await createTask({ language: lang as any, ...data });
        const taskId = taskInfo.taskId;
        // 判断 task 是不是现成的
        if (taskInfo?.complete === true) {
            sendFn(taskId!);
            return;
        }
        // 没有现成的 taskId 需要轮询任务进度接口
        getTaskInfo({ taskId: taskId! });
    };

    useEffect(() => {
        if (taskInfo?.complete) {
            // 1. 关闭轮询请求
            cancelTaskInfo();
            // 2. 发消息
            sendFn(taskId!);
        }
    }, [taskId, progress, taskInfo?.complete]);

    return {
        taskId,
        taskLoading: createTaskLoading || getTaskLoading || taskInfo?.complete === false,
        taskError: error,
        progress,
        progressStage,
        start
    };
};
