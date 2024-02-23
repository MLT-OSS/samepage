import { App, Button, Modal, Upload, Typography } from 'antd';
import type { UploadProps } from 'antd';
import styles from './index.module.less';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { ReactComponent as PdfIcon } from '@/assets/images/pdf.svg';
import { useUpload } from '@xm/hooks';
import { formatFileSize, genFileMd5, DOC_CHAT_URL, getDocChatUrl } from '@/utils';
import Icon from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { PostDocUploadConfigResponse } from '@/ytt-type/conversation';
import { ReactComponent as UndoIcon } from '@/assets/images/undo.svg';

const { Dragger } = Upload;
const { Text } = Typography;
export interface IUploadDocInfo {
    docId?: string;
    docName?: string;
}
export type OnCloseFn = (type: 'abort' | 'success', data?: IUploadDocInfo) => any;
interface UploadDocModalProps {
    onClose: OnCloseFn;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = (props) => {
    const { onClose } = props;
    const { message } = App.useApp();
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const { upload, cancel } = useUpload();
    // 上传错误信息
    const [error, setError] = useState<{ code?: number; message: string } | null>(null);

    const { run: getUploadConfig } = useRequest(services.conversation.getUploadConfig, {
        manual: true,
        throwOnError: true
    });

    const isGt50M = (f: File) => {
        if (f.size / 1024 / 1024 > 50) {
            const msg = '只能上传 50M 以内的文件';
            message.error({ key: msg, content: msg });
            return true;
        }
        return false;
    };

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
                const msg = '只能上传一个文件';
                message.error({ key: msg, content: msg });
                return;
            }
            const f = files[0];
            if (f.type !== 'application/pdf') {
                const msg = '请上传 pdf 文件';
                message.error({ key: msg, content: msg });
                return;
            }
            if (isGt50M(f)) {
                return;
            }

            setFile(e.dataTransfer.files[0]);
        }
    };

    const uploadFile = async () => {
        try {
            if (!file) {
                return;
            }
            // 1. 创建任务
            const md5 = await genFileMd5(file);
            const uploadConfig: PostDocUploadConfigResponse = await getUploadConfig({
                fileName: file.name,
                md5,
                size: file.size
            });
            // 2. 判断文件是否已上传
            const isUploaded = !uploadConfig.uploadUrl;
            if (!isUploaded) {
                await upload(uploadConfig.uploadUrl!, file, setProgress);
            }
            onClose('success', {
                docId: uploadConfig.docId,
                docName: file.name
            });
        } catch (e: any) {
            console.log('catch 错误', e);
            setError({
                code: e?.data?.response?.statusCode ?? 500,
                message: e?.data?.response?.message ?? '网络连接异常'
            });
        }
    };

    useEffect(() => {
        if (file) {
            (async () => {
                await uploadFile();
            })();
        }
    }, [file]);
    return (
        <Modal
            wrapClassName={styles.uploadDocModal}
            title={<div style={{ textAlign: 'center' }}>上传</div>}
            width={400}
            open
            footer={null}
            closeIcon={<CloseIcon />}
            onCancel={() => {
                // 选中文件之后，关闭弹窗，需要触发 cancel
                file && cancel();
                onClose('abort');
            }}
            centered
            destroyOnClose
            maskClosable={false}>
            <div className={styles.uploadDoc}>
                <div className={styles.desc}>用PDF聊天，轻松生成文档摘要，并获取与文档相关的问题答案。</div>
                {!file && (
                    <>
                        <Dragger {...uploadProps}>
                            <div className={styles.dragBox}>
                                <div className={styles.icon}>
                                    <span className={styles.inner}>PDF</span>
                                </div>
                                <div className={classNames(styles.desc, styles.active)}>点击或将文件拖拽到这里上传</div>
                                <div className={styles.desc}>支持的文件型别：PDF |最大档案大小：50MB</div>
                            </div>
                        </Dragger>
                        <Button
                            type="primary"
                            className={styles.btn}
                            onClick={async () => {
                                const _docChatUrl = await getDocChatUrl();
                                window.open(_docChatUrl, '_blank');
                            }}>
                            尝试使用网页版查看 PDF详细信息和内容对照
                        </Button>
                    </>
                )}
                {!!file && (
                    <>
                        <div
                            className={styles.file}
                            style={{
                                backgroundImage: `linear-gradient(to right, rgba(113, 113, 238, 10%) ${progress}%, transparent ${
                                    100 - progress
                                }%)`
                            }}>
                            <Icon component={PdfIcon} className={styles.icon} />
                            <div className={styles.fileInfo}>
                                <Text className={styles.title} ellipsis={{ tooltip: file?.name }}>
                                    {file?.name}
                                </Text>
                                <div className={styles.size}>{formatFileSize(file?.size)}</div>
                            </div>
                            {!error && <div className={styles.progress}>{progress}%</div>}
                            {!!error && error.code !== 422 && (
                                <Icon component={UndoIcon} className={styles.retry} onClick={uploadFile} />
                            )}
                        </div>
                        {!!error && <div className={styles.error}>{error.message}</div>}
                    </>
                )}
            </div>
        </Modal>
    );
};
