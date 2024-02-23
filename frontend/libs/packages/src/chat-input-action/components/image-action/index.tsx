import React, { useEffect, useMemo, useRef, useState } from 'react';
import { App, Button, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { useImgUpload } from '@xm/hooks';
import styles from './index.module.less';
import { ReactComponent as UploadPic } from '@/assets/images/upload-pic.svg';
import services from '@xm/services';
import { abortRequest, genFileMd5, getObjectURL } from '@/utils';
import { IChatInputDatas, IImageLimit } from '@/types';
import classNames from 'classnames';
import Icon from '@ant-design/icons';
import useRequest from '@ahooksjs/use-request';
import { v4 as uuidv4 } from 'uuid';

interface ImageActionProps {
    disabled: boolean;
    limit?: IImageLimit;
    sendMessage: (imageData: IChatInputDatas) => void;
}

export const ImageAction: React.FC<ImageActionProps> = (props) => {
    const { disabled = false, limit, sendMessage } = props;
    const abortObj = useRef<string>();
    const [progress, setProgress] = useState<number>(0);
    const [errorStatus, setErrorStatus] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [imageData, setImageData] = useState<IChatInputDatas | null>(null);
    const { message } = App.useApp();
    const { upload, cancel } = useImgUpload();

    // 图片限制
    const limitUpperType = useMemo(() => {
        if (limit?.fileFormat) {
            return limit.fileFormat.map((i) => i.toUpperCase());
        }
        return [];
    }, [limit]);
    const limitType = useMemo(() => {
        if (limit?.fileFormat) {
            return limit.fileFormat;
        }
        return [];
    }, [limit]);
    const limitSize = useMemo(() => {
        if (limit?.fileSize) {
            return (limit.fileSize / 1024 / 1024).toFixed(2);
        }
        return 0;
    }, [limit]);

    const checkValidNopass = (file: File) => {
        if (limit) {
            const type = file.type.split('image/')[1];
            if (limit.fileFormat?.length && !limit.fileFormat.includes(type)) {
                // 类型判断
                const msg = `请上传 ${limitUpperType.join('、')} 文件`;
                message.error({ key: msg, content: msg });
                return true;
            }
            if (limit.fileSize && file.size > limit.fileSize) {
                const msg = `只能上传 ${limitSize}M 以内的图片`;
                message.error({ key: msg, content: msg });
                return true;
            }
        }

        return false;
    };
    const clearUpload = () => {
        setProgress(0);
        setFile(null);
        setImageData(null);
    };

    const { run: getUploadExists } = useRequest(services.statelessConversation.getUploadExists, {
        manual: true,
        onSuccess: (res) => {
            if (res) {
                sendMessage(imageData!);
                setErrorStatus(false);
                clearUpload();
            } else {
                setErrorStatus(true);
                clearUpload();
            }
        },
        onError: (error: any) => {
            const { data } = error;
            console.log('错误qq', error);
            if (data.type !== 'AbortError') {
                setErrorStatus(true);
                clearUpload();
            }
        }
    });
    const imageUploadprops: UploadProps = {
        name: 'file',
        showUploadList: false,
        maxCount: 1,
        accept: limitType.map((i) => `image/${i}`).join(', '),
        beforeUpload: (file) => {
            if (checkValidNopass(file)) {
                return;
            }
            setProgress(0);
            setFile(file);
            return false;
        },
        onDrop: (e) => {
            const files = e.dataTransfer.files;
            const f = files[0];
            if (checkValidNopass(f)) {
                return;
            }
            setProgress(0);
            setFile(f);
        }
    };
    const handleCancel = () => {
        abortRequest(abortObj.current);
        cancel();
        clearUpload();
    };
    const mainDrag = (
        <div className={styles['drag-box']}>
            <Icon component={UploadPic} className={styles['upload-drag-icon']} />
            <div className={styles['upload-drag-info']}>
                <div className={styles['upload-text']}>点击或将图片拖拽到这里上传</div>
                <div className={styles['upload-hint']}>
                    支持上传{limitSize}M以内{limitUpperType.join('、')}格式的图片
                </div>
            </div>
        </div>
    );
    const loadingDrag = (
        <div className={styles['loadinng-drag']}>
            <div className={styles['loadinng-drag-text']}>上传中… {progress}%</div>
            <Button className={styles['cancel-btn']} type="text" onClick={handleCancel}>
                取消
            </Button>
        </div>
    );
    const errorDrag = (
        <div className={styles['error-drag']}>
            <div className={styles['error-drag-text']}>上传失败，点击重新上传</div>
        </div>
    );

    useEffect(() => {
        (async () => {
            if (file) {
                setErrorStatus(false);
                const md5 = await genFileMd5(file);
                const names = file.name.split('.');
                const uploadConfig: any = await services.statelessConversation.getUploadConfig({
                    md5,
                    size: file.size.toString() || '',
                    fileName: file.name,
                    suffix: names[names.length - 1],
                    type: file.type
                });
                const { objId, size, suffix, uploadUrl, bucketName } = uploadConfig.data;
                const url = getObjectURL(file);
                setImageData([
                    {
                        type: 'image',
                        value: {
                            objId,
                            size,
                            suffix,
                            bucketName,
                            tempUrl: url,
                            fileName: file.name
                        }
                    }
                ]);

                if (uploadUrl) {
                    upload(uploadUrl!, file, setProgress).catch((res) => {
                        console.log('错误qq', res);
                        if (res.name !== 'CanceledError') {
                            setErrorStatus(true);
                            clearUpload();
                        }
                    });
                }
            }
        })();
    }, [file]);
    useEffect(() => {
        if (imageData && progress === 100) {
            const obj: any = imageData[0].value;
            getUploadExists({ objId: obj.objId, bucketName: obj.bucketName }, () => {
                abortObj.current = uuidv4();
                return abortObj.current;
            });
        }
    }, [progress, imageData]);

    return (
        <div className={styles.imageAction}>
            {!file && errorStatus ? (
                <Dragger {...imageUploadprops} className={classNames(styles['custom-upload'], styles.error)}>
                    {errorDrag}
                </Dragger>
            ) : disabled ? (
                <div className={classNames(styles['custom-upload'], styles.disabled)}>
                    <div className="ant-upload-drag">{mainDrag}</div>
                </div>
            ) : !file ? (
                <Dragger {...imageUploadprops} className={styles['custom-upload']}>
                    {mainDrag}
                </Dragger>
            ) : (
                <div className={styles['custom-upload']}>
                    <div className="ant-upload-drag">{loadingDrag}</div>
                </div>
            )}
        </div>
    );
};
