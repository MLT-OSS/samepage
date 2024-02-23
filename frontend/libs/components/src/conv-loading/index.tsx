import styles from './index.module.less';

export const ConvLoading = () => {
    return (
        <div className={styles.loading}>
            <div className={styles.item} />
            <div className={styles.item} />
            <div className={styles.item} />
        </div>
    );
};
