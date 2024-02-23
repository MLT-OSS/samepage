import styles from './index.module.less';

/**
 * TODO: 根据配置生成相关操作
 */
interface IImageActionProps {
    onActionClick?: (type: string) => void;
}

export const ImageAction = (props: IImageActionProps) => {
    const { onActionClick } = props;
    return (
        <div className={styles['image-action']}>
            <div className={styles.action} onClick={() => onActionClick?.('VARIATION')}>
                变体
            </div>
            {/* <div className={styles.action}>测试</div> */}
            <div className={styles.action} onClick={() => onActionClick?.('UPSCALE')}>
                放大
            </div>
        </div>
    );
};
