import { useEffect, useState } from 'react';
import { App, Button, Drawer, UploadProps } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as PicIcon } from '@/assets/images/pic.svg';
import { ReactComponent as UploadPic } from '@/assets/images/upload-pic.svg';
import { ReactComponent as LoadingSrc } from '@/assets/images/loading.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import styles from './index.module.less';
import Dragger from 'antd/es/upload/Dragger';
import { useImgUpload } from '@xm/hooks';
import services from '@xm/services';
import { RcFile } from 'antd/es/upload';
import { getObjectURL, isH5 } from '@/utils';

export interface ImageProps {
    imageKey: string;
    imageUrl: string;
}
interface IUploadDrawerProps {
    onComplete?: (data: ImageProps) => void;
    children?: React.ReactNode;
}
const UploadDrawer = (props: IUploadDrawerProps) => {
    const { onComplete, children } = props;
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState<number>(0); // 默认是 0
    const { upload, cancel } = useImgUpload();
    const { message } = App.useApp();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [key, setKey] = useState<string>();
    const onSettingClick = () => {
        setOpen(true);
    };
    // 支持上传jpg、png格式图片
    const isGt20M = (f: File) => {
        if (f.size / 1024 / 1024 > 20) {
            const msg = '只能上传 20M 以内的图片';
            message.error({ key: msg, content: msg });
            return true;
        }
        return false;
    };
    const uploadprops: UploadProps = {
        name: 'file',
        showUploadList: false,
        accept: 'image/png, image/jpg',
        beforeUpload: (file) => {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                const msg = '请上传 png/jpg 文件';
                message.error({ key: msg, content: msg });
                return;
            }
            if (isGt20M(file)) {
                return;
            }
            const url = getObjectURL(file);
            setImageUrl(url);
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
            if (f.type !== 'image/png' && f.type !== 'image/jpeg' && f.type !== 'image/jpg') {
                const msg = '请上传 png/jpg 文件';
                message.error({ key: msg, content: msg });
                return;
            }
            if (isGt20M(f)) {
                return;
            }
            const url = getObjectURL(f);
            setImageUrl(url);
            setProgress(0);
            setFile(f);
        }
    };
    useEffect(() => {
        if (file) {
            (async () => {
                const uploadConfig: any = await services.imageConversation.getUploadConfig({
                    filename: file.name
                });
                const isUploaded = !uploadConfig.data.preSignUrl;
                if (!isUploaded) {
                    setKey(uploadConfig.data.key);
                    upload(uploadConfig.data.preSignUrl!, file, setProgress).catch(() => {
                        setProgress(0);
                        message.error('上传图片失败，请检查网络环境后重新上传');
                        setFile(null);
                        setKey(undefined);
                        setImageUrl(null);
                    });
                }
            })();
        }
    }, [file]);
    useEffect(() => {
        if (progress === 100) {
            setOpen(false);
            if (onComplete) onComplete({ imageKey: key!, imageUrl: imageUrl! });
            setFile(null);
        }
    }, [progress]);
    return (
        <div className={styles['refer-pic']}>
            <div onClick={onSettingClick}>{children}</div>
            <Drawer
                height={280}
                rootClassName={styles['upload-drawer']}
                placement="bottom"
                onClose={() => setOpen(false)}
                closeIcon={<CloseIcon />}
                open={open}>
                {!file && (
                    <Dragger {...uploadprops} className="custom-upload">
                        <div className="drag-box">
                            <p className="ant-upload-drag-icon">
                                <UploadPic />
                            </p>
                            <p className="ant-upload-text">{isH5 ? '点击上传图片' : '点击或将图片拖拽到这里上传'}</p>
                            <p className="ant-upload-hint">支持上传20M以内jpg、png格式的图片</p>
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
            </Drawer>
        </div>
    );
};

export default UploadDrawer;
