import Dragger from 'antd/lib/upload/Dragger';
import styles from './index.module.less';
import Icon from '@ant-design/icons';
import { Button, Progress, Typography, UploadProps, message } from 'antd';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { useUpload, useLang } from '@xm/hooks';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { abortRequest, genFileMd5 } from '@/utils';
import { PostDocUploadConfigResponse } from '@/ytt-type/conversation';
import { ReactComponent as PdfIcon } from '@/assets/images/doc/pdf.svg';
import { ReactComponent as PdfBlueIcon } from '@/assets/images/doc/pdf-blue.svg';
import { GetTaskInfoResponse, PostTaskCreateResponse } from '@/ytt-type/task';
import { ReactComponent as LoadingSrc } from '@/assets/images/loading.svg';
import { ReactComponent as CancelSrc } from '@/assets/images/doc/cancel.svg';
import { ReactComponent as RetrySrc } from '@/assets/images/doc/retry.svg';
const { Text } = Typography;
export interface IDocChatUploadInfo {
    docId: string;
    docName: string;
    taskId: string;
}
interface UploadBoxProps {
    fileData: File | null;
    onDisable: (disabled: boolean) => void;
    uploadComplete: (data: IDocChatUploadInfo) => void;
}

export const DocChatUploadBox: React.FC<UploadBoxProps> = ({ fileData, onDisable, uploadComplete }) => {
    const taskIdRef = useRef<string | null>(null);
    const abortObj = useRef<string>();
    const [file, setFile] = useState<File | null>(null);
    const [docId, setDocId] = useState('');
    const [progressStage, setProgressStage] = useState<string>('上传');
    const [progress, setProgress] = useState<number>(0); // 默认是 0
    const [error, setError] = useState<string>(); // 标记创建任务和获取任务阶段失败状态
    const [errorCode, setErrorCode] = useState<number>();
    const [lang] = useLang();
    const { upload, cancel } = useUpload();
    const { run: getUploadConfig } = useRequest(services.conversation.getUploadConfig, {
        manual: true
    });

    // todo 整理成 util 方法
    const isGt50M = (f: File) => {
        if (f.size / 1024 / 1024 > 50) {
            const msg = '只能上传 50M 以内的文件';
            message.error({ key: msg, content: msg });
            return true;
        }
        return false;
    };
    // todo 整理成一份
    const uploadProps: UploadProps = {
        name: 'file',
        showUploadList: false,
        accept: 'application/pdf',
        beforeUpload: (file) => {
            if (isGt50M(file)) {
                return;
            }
            setFile(file);
            return false;
        },
        onDrop: (e) => {
            const files = e.dataTransfer.files;
            if (files.length !== 1) {
                const msg = '只能上传一个文件'; // todo 问  PM 要提示语
                message.error({ key: msg, content: msg });
                return;
            }
            const f = files[0];
            if (f.type !== 'application/pdf') {
                const msg = '请上传 pdf 文件'; // todo 问  PM 要提示语
                message.error({ key: msg, content: msg });
                return;
            }
            if (isGt50M(f)) {
                return;
            }

            setFile(e.dataTransfer.files[0]);
        }
    };

    const { run: createTask } = useRequest(services.conversation.createTask, {
        manual: true,
        onSuccess: (res: PostTaskCreateResponse, req: any) => {
            taskIdRef.current = res.taskId as string;
            // 判断 task 是不是现成的
            if (res?.complete === true) {
                setProgressStage('阅读');
                setProgress(100);
                const param = { docId: req[0].docId, docName: file!.name, taskId: taskIdRef.current! };
                taskIdRef.current = null;
                setTimeout(() => {
                    uploadComplete(param);
                }, 1000);
                return;
            }
            // 没有现成的 taskId 需要轮询任务进度接口
            getTaskInfo({ taskId: taskIdRef.current! }, () => {
                abortObj.current = uuidv4();
                return abortObj.current;
            });
        },
        onError: (res: any) => {
            if (res.data.type !== 'AbortError') {
                setErrorCode(res.data.response.statusCode);
                if (res.data.response.statusCode === 422) {
                    setError(res.data.response.message);
                } else {
                    setError('上传失败');
                }
            }
        }
    });
    // !! todo 上传，创建任务， 获取任务信息失败之后需要设置 taskIdRef 为 null(失败后点击取消不调用接口)
    const {
        run: getTaskInfo,
        cancel: cancelTaskInfo,
        data: taskInfo
    } = useRequest(services.conversation.getTaskInfo, {
        manual: true, // 需要第一次执行 run 后才开始轮询
        pollingInterval: 500, // 轮询间隔，单位为毫秒。设置后，将进入轮询模式
        onSuccess: (res: GetTaskInfoResponse) => {
            if (res.stage !== progressStage) {
                setProgress(0);
            }
            setProgressStage(res.stage);
            setProgress((val) => {
                return res?.progress || val;
            });
        },
        onError: (res: any) => {
            if (res.data.type !== 'AbortError') {
                taskIdRef.current = null;
                setErrorCode(res.data.response.statusCode);
                if (res.data.response.statusCode === 422) {
                    setError(res.data.response.message);
                } else {
                    setError('上传失败');
                }
                cancelTaskInfo();
            }
        }
    });
    const { run: cancelTask } = useRequest(services.conversation.cancelTask, {
        manual: true,
        onSuccess: (res: GetTaskInfoResponse) => {
            console.log('取消任务成功');
        }
    });

    const handleRetry = () => {
        setProgress(0);
        setProgressStage('上传');
        setErrorCode(undefined);
        setError(undefined);
        setDocId('');
        taskIdRef.current = null;
        if (file) start(file);
    };
    const start = (file: File) => {
        (async () => {
            // 1. 创建任务
            setProgress(0);
            setProgressStage('上传');
            const md5 = await genFileMd5(file);
            const uploadConfig: PostDocUploadConfigResponse = await getUploadConfig({
                fileName: file.name,
                md5,
                size: file.size
            }).catch((res) => {
                setErrorCode(res?.data?.response?.statusCode);
                if (res?.data?.response?.statusCode === 422) {
                    setError(res?.data?.response?.message);
                } else {
                    setError('上传失败');
                }
            });
            if (uploadConfig) {
                setDocId(uploadConfig.docId);
                // 2. 判断文件是否已上传
                const isUploaded = !uploadConfig.uploadUrl;
                let continueF = true;
                if (!isUploaded) {
                    await upload(uploadConfig.uploadUrl!, file, setProgress).catch((res) => {
                        continueF = false;
                        if (res.name !== 'CanceledError') {
                            setErrorCode(500);
                            setError('上传失败, 请检查网络环境后重新上传');
                        }
                    });
                }
                if (!continueF) {
                    return;
                }
                createTask(
                    {
                        language: lang as any,
                        docId: uploadConfig.docId
                    },
                    () => {
                        abortObj.current = uuidv4();
                        return abortObj.current;
                    }
                );
            }
        })();
    };
    const cancelInfo = () => {
        clearInfo();
        console.log('重置变量');
        setFile(null);
        setDocId('');
        setErrorCode(undefined);
        setError(undefined);
        setProgress(0);
        setProgressStage('上传');
    };
    const clearInfo = () => {
        console.log('取消接口');
        if (cancel) cancel();
        if (abortObj.current) abortRequest(abortObj.current);
        if (taskIdRef.current) {
            if (cancelTaskInfo) cancelTaskInfo();
            cancelTask({ taskId: taskIdRef.current });
            taskIdRef.current = null;
        }
        onDisable(false);
        console.log('取消');
    };

    useEffect(() => {
        if (file) {
            start(file);
        }
        onDisable(!!file);
    }, [file]);

    useEffect(() => {
        if (taskIdRef.current && taskInfo?.complete && docId) {
            // 1. 关闭轮询请求
            cancelTaskInfo();
            // 2. 发消息
            const param = { docId: docId, docName: file!.name, taskId: taskIdRef.current! };
            taskIdRef.current = null;
            setTimeout(() => {
                uploadComplete(param);
            }, 1000);
        }
    }, [docId, taskInfo?.complete, file]);

    useEffect(() => {
        if (fileData) {
            setFile(fileData);
        }
    }, [fileData]);

    useEffect(() => {
        return () => {
            clearInfo();
        };
    }, []);
    return (
        <div className={styles.uploadInfo}>
            {!file && (
                <>
                    <Dragger {...uploadProps} className="custom-upload">
                        <div className="drag-box">
                            <p className="ant-upload-drag-icon">
                                <PdfBlueIcon />
                            </p>
                            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                            <p className="ant-upload-hint">支持上传50M以内PDF格式的文件</p>
                        </div>
                    </Dragger>
                </>
            )}

            {!!file && (
                <div className="file-box">
                    <div className="file-icon">
                        <PdfIcon />
                    </div>
                    <Text className="file-name" ellipsis={{ tooltip: file?.name }}>
                        {file?.name}
                    </Text>
                    {error ? (
                        <div className="error-info">{error}</div>
                    ) : (
                        <>
                            <div className="progress-info">
                                <Icon className="icon" component={LoadingSrc} spin />
                                <span className="txt">
                                    正在{progressStage}… （{progress}%）
                                </span>
                            </div>
                            <div className="progress-list">
                                <Progress
                                    size="small"
                                    className="custom-progress"
                                    strokeColor="#7171EE"
                                    trailColor="#F0F0F0"
                                    percent={progressStage === '上传' ? progress : 100}
                                    showInfo={false}
                                />
                                <Progress
                                    size="small"
                                    className="custom-progress"
                                    strokeColor="#7171EE"
                                    trailColor="#F0F0F0"
                                    percent={progressStage === '解析' ? progress : progressStage === '阅读' ? 100 : 0}
                                    showInfo={false}
                                />
                                <Progress
                                    size="small"
                                    className="custom-progress"
                                    strokeColor="#7171EE"
                                    trailColor="#F0F0F0"
                                    percent={progressStage === '阅读' ? progress : 0}
                                    showInfo={false}
                                />
                            </div>
                        </>
                    )}
                    <div className="tool-list">
                        {error && errorCode && ![422].includes(errorCode) ? (
                            <Button
                                className="custom-btn"
                                onClick={handleRetry}
                                icon={<Icon className="btn-icon" component={RetrySrc} />}>
                                重试
                            </Button>
                        ) : (
                            <></>
                        )}
                        <Button
                            className="custom-btn"
                            onClick={cancelInfo}
                            icon={<Icon className="btn-icon" component={CancelSrc} />}>
                            取消
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
