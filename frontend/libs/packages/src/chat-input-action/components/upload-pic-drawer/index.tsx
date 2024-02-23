import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { App, Button, Col, Drawer, Row, UploadProps } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as DisabledUploadPic } from '@/assets/images/upload-pic-disabled.svg';

import { ReactComponent as LoadingSrc } from '@/assets/images/loading.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { ReactComponent as CircleCloseIcon } from '@/assets/images/close-circle.svg';

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
export const UploadPicDrawer = forwardRef((props: IUploadDrawerProps, ref: any) => {
    const { onComplete } = props;
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState<number>(0); // 默认是 0
    const { upload, cancel } = useImgUpload();
    const { message } = App.useApp();
    const [temporaryFile, setTemporaryFile] = useState<any>([]);

    const [fileList, setFileList] = useState<any>([]);
    const [fileDataList, setFileDataList] = useState<any>([]);
    const onSettingClick = () => {
        setFileList(fileDataList);
        setOpen(true);
    };
    // 打开弹窗,传入信息
    useImperativeHandle(ref, () => {
        return {
            _showUpload() {
                onSettingClick();
            },
            _clearUploaPicdData() {
                setFileList([]);
                setFileDataList([]);
            }
        };
    });

    // 支持上传jpg、png格式图片
    const isGt20M = (f: File) => {
        if (f.size / 1024 / 1024 > 4) {
            const msg = '只能上传 4M 以内的图片';
            message.error({ key: msg, content: msg });
            return true;
        }
        return false;
    };

    const uploadprops: UploadProps = {
        name: 'file',
        showUploadList: false,
        accept: 'image/png, image/jpeg, image/bmp',
        beforeUpload: (file) => {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/bmp') {
                const msg = '请上传 jpg、jpeg、png、bmp 文件';
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
            if (f.type !== 'image/png' && f.type !== 'image/jpeg' && f.type !== 'image/bmp') {
                const msg = '请上传 jpg、jpeg、png、bmp 文件';
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
                if (uploadUrl) {
                    const url = getObjectURL(file);
                    setTemporaryFile([
                        {
                            type: 'image',
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
        if (progress === 100) {
            setFileList([...fileList, ...temporaryFile]);
            setTemporaryFile([]);
            setFile(null);
        }
    }, [progress]);

    // 删除
    const onHandleClear = (objId: string) => {
        const array = fileList.filter((item: any, key: any) => {
            return item.value.objId + '_' + key !== objId;
        });
        setFileList(array);
    };

    // 确认
    const onConfirm = () => {
        setOpen(false);
        setFileDataList(fileList);
        if (onComplete) onComplete({ type: 'image', file: fileList });
    };

    // 清除file
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
                height={fileList.length > 0 ? 432 : fileDataList.length > 0 ? 328 : 264}
                rootClassName={styles['upload-drawer']}
                placement="bottom"
                onClose={onClose}
                closeIcon={<CloseIcon />}
                maskClosable={false}
                open={open}>
                {fileList.length > 0 && (
                    <Row style={{ marginBottom: 8, marginTop: 10 }}>
                        {fileList.map((item: any, k: any) => {
                            return (
                                <div className="image-preview" key={item.value.objId + '_' + k}>
                                    <div className="img-box">
                                        <img className="img" src={item.value.tempUrl} alt="" />
                                    </div>
                                    <div className="mask">
                                        <CircleCloseIcon
                                            className="close-icon"
                                            onClick={() => onHandleClear(item.value.objId + '_' + k)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </Row>
                )}
                {!file && (
                    <Dragger {...uploadprops} className="custom-upload" disabled={fileList.length > 3}>
                        <div className="drag-box">
                            <p className="ant-upload-drag-icon">
                                <DisabledUploadPic />
                            </p>
                            <p className="ant-upload-text">点击或将图片拖拽到这里上传</p>
                            <p className="ant-upload-text-des">最多支持上传 4 张4M以内JPG、JPEG、PNG、BMP格式的图片</p>
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
                {(fileList.length > 0 || fileDataList.length > 0) && (
                    <div>
                        {fileList.length > 0 && (
                            <Button className="del" key="del" type="text" onClick={onDel} danger>
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
