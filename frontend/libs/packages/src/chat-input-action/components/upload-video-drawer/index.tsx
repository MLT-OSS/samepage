import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { App, Button, Drawer, UploadProps } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as UploadVideo } from '@/assets/images/upload-video.svg';
import { ReactComponent as LoadingSrc } from '@/assets/images/loading.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import styles from './index.module.less';
import Dragger from 'antd/es/upload/Dragger';
import { useImgUpload } from '@xm/hooks';
import services from '@xm/services';
import { genFileMd5, getObjectURL } from '@/utils';

export interface ImageProps {
    imageKey: string;
    imageUrl: string;
}
export interface IUploadDrawerRef {
    openUploadDrawer: (text: string) => any;
}

interface IUploadDrawerProps {
    // onComplete?: (data: ImageProps) => void;
    onComplete?: (data: any) => void;
}
// const UploadDrawer =  (props: IUploadDrawerProps) => {
export const UploadVideoDrawer = forwardRef((props: IUploadDrawerProps, ref: any) => {
    const { onComplete } = props;
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState<number>(0); // 默认是 0
    const { upload, cancel } = useImgUpload();
    const { message } = App.useApp();
    const [fileList, setFileList] = useState<any>([]);
    const [fileDataList, setFileDataList] = useState<any>([]);

    const onSettingClick = () => {
        setOpen(true);
    };

    // 打开弹窗,传入信息
    useImperativeHandle(ref, () => {
        return {
            _showUpload() {
                onSettingClick();
                setFileList(fileDataList);
            },
            _clearUploaVideodData() {
                setFileList([]);
                setFileDataList([]);
            }
        };
    });

    // 支持上传jpg、png格式图片
    const isGt20M = (f: File) => {
        if (f.size / 1024 / 1024 > 10) {
            const msg = '只能上传 10M 以内的视频';
            message.error({ key: msg, content: msg });
            return true;
        }
        return false;
    };
    const uploadprops: UploadProps = {
        name: 'file',
        showUploadList: false,
        accept: 'video/mp4, video/avi, video/x-msvideo, video/quicktime',
        beforeUpload: (file) => {
            if (
                file.type !== 'video/mp4' &&
                file.type !== 'video/avi' &&
                file.type !== 'video/x-msvideo' &&
                file.type !== 'video/quicktime'
            ) {
                const msg = '请上传 mp4/avi/mov 文件';
                message.error({ key: msg, content: msg });
                return;
            }
            if (isGt20M(file)) {
                return;
            }

            setProgress(0);
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
            if (
                f.type !== 'video/mp4' &&
                f.type !== 'video/avi' &&
                f.type !== 'video/x-msvideo' &&
                f.type !== 'video/quicktime'
            ) {
                const msg = '请上传 mp4/avi/mov 文件';
                message.error({ key: msg, content: msg });
                return;
            }
            if (isGt20M(f)) {
                return;
            }
            setProgress(0);
            setFile(f);
        }
    };
    useEffect(() => {
        (async () => {
            if (file) {
                const md5 = await genFileMd5(file);
                const names = file.name.split('.');
                const uploadConfig: any = await services.statelessConversation.getUploadConfig({
                    md5,
                    size: file.size.toString() || '',
                    fileName: file.name,
                    suffix: names[names.length - 1],
                    type: file.type
                });
                const { objId, size, suffix, uploadUrl, bucketName, downloadUrl } = uploadConfig.data;
                const url = getObjectURL(file);
                setFileList([
                    ...fileList,
                    {
                        type: 'video',
                        value: {
                            objId,
                            size,
                            suffix,
                            bucketName,
                            tempUrl: url,
                            downloadUrl: downloadUrl,
                            fileName: file.name
                        }
                    }
                ]);
                if (uploadUrl) {
                    upload(uploadUrl!, file, setProgress).catch((res) => {
                        if (res.name !== 'CanceledError') {
                            setFile(null);
                            message.error('上传失败, 请检查网络环境后重新上传');
                        }
                    });
                }
            }
        })();
    }, [file]);
    useEffect(() => {
        console.log('progress', progress);

        if (progress === 100) {
            setFile(null);
        }
    }, [progress]);

    // 确认
    const onConfirm = () => {
        setOpen(false);
        setFileDataList([...fileList]);
        if (onComplete) onComplete({ type: 'video', file: fileList });
    };
    // 清除视频
    const onDel = () => {
        setFileList([]);
    };
    // 关闭抽屉并清除状态(包含阻断正在上传中的文件)
    const onClose = () => {
        setFile(null);
        setFileList([]);
        cancel();
        setOpen(false);
    };
    return (
        <div className={styles['refer-pic']}>
            <Drawer
                height={(fileList.length > 0 || fileDataList.length > 0) && !file ? 344 : 265}
                rootClassName={styles['upload-drawer']}
                placement="bottom"
                onClose={onClose}
                closeIcon={fileList.length > 0 && !file ? false : <CloseIcon />}
                maskClosable={false}
                open={open}>
                {fileList.length > 0 && !file && (
                    <div style={{ paddingTop: 16 }}>
                        <video height="243" width="100%" controls>
                            <source src={fileList[0].value.tempUrl || fileList[0].value.downloadUrl} type="video/mp4" />
                        </video>
                    </div>
                )}
                {!file && fileList.length === 0 && (
                    <Dragger {...uploadprops} className="custom-upload">
                        <div className="drag-box">
                            <p className="ant-upload-drag-icon">
                                <UploadVideo />
                            </p>
                            <p className="ant-upload-text">点击或将视频拖拽到这里上传</p>
                            <p className="ant-upload-text-des">
                                推荐上传格式为mp4，mov，avi，时长在30s以内，不超过10MB的视频，分辨率最好在448~1024之间
                            </p>
                        </div>
                    </Dragger>
                )}
                {!!file && (
                    <div className="file-box">
                        <div className="loading-icon">
                            <Icon className="icon" component={LoadingSrc} spin />
                        </div>
                        <div className="progress-info">正在上传… （{progress}%）</div>
                    </div>
                )}
                {(fileList.length > 0 || fileDataList.length > 0) && !file && (
                    <div>
                        {!file && fileList.length > 0 && (
                            <Button className="del" type="text" key="del" onClick={onDel} danger>
                                清除
                            </Button>
                        )}
                        <Button className="send" type="primary" key="link" onClick={onConfirm}>
                            确定
                        </Button>
                        <Button className="cancel" key="back" onClick={onClose}>
                            取消
                        </Button>
                    </div>
                )}
            </Drawer>
        </div>
    );
});

// export default UploadDrawer;
