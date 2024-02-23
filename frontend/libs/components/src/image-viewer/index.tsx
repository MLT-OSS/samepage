import { PostImagineMessageChangeRequest } from '@/ytt-type/imagine';
import { ImageAction } from '../image-action';
import styles from './index.module.less';
interface ImagesProps {
    position: PostImagineMessageChangeRequest['position'];
    action: PostImagineMessageChangeRequest['action'];
}

interface IImageViewerProps {
    url: string;
    disableAction?: boolean;
    imgTotal?: number;
    style?: React.CSSProperties;
    onActionClick?: (position: number, action: string) => void;
}

export const ImageViewer = (props: IImageViewerProps) => {
    const { url, disableAction, imgTotal = 4, style, onActionClick } = props;
    const onHandleActionClick = (position: number, action: string) => {
        onActionClick?.(position, action);
    };
    return (
        <div className={styles['image-viewer']}>
            <div
                style={{
                    backgroundImage: `url('${url}')`,
                    backgroundSize: '100% auto',
                    backgroundRepeat: 'no-repeat',
                    ...style
                }}
                className={[styles['gen-image-wapper'], '__xm_square__'].join(' ')}>
                {!disableAction &&
                    imgTotal > 0 &&
                    Array.from({ length: imgTotal }).map((_, index) => {
                        return (
                            <div
                                key={index}
                                className={styles['item-wapper']}
                                style={{ width: `${100 / Math.ceil(imgTotal / 2)}%` }}>
                                <div className="__xm_square__">
                                    <div className={styles['item-action']}>
                                        <ImageAction
                                            onActionClick={(action) => onHandleActionClick(index + 1, action)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
