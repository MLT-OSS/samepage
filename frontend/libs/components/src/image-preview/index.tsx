import { useEffect } from 'react';
import Icon from '@ant-design/icons';
import { ReactComponent as PreviewCloseIcon } from '@/assets/images/preview-close.svg';

import styles from './index.module.less';

interface IImagePreviewProps {
    open?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}

export const ImagePreview = (props: IImagePreviewProps) => {
    const { open, onClose } = props;
    useEffect(() => {
        const escKeyDown = (e: any) => {
            if (e.code === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                onClose?.();
            }
        };

        window.addEventListener('keydown', escKeyDown);

        return () => {
            window.removeEventListener('keydown', escKeyDown);
        };
    }, []);
    return open ? (
        <div className={styles['image-preview']}>
            <div className={styles.wapper}>
                <div className={styles.close} onClick={onClose}>
                    <Icon className={styles.icon} component={PreviewCloseIcon} />
                </div>
                {props?.children}
            </div>
        </div>
    ) : (
        <></>
    );
};
