import { useState } from 'react';
import { Drawer } from 'antd';
import { Loading } from '../loading';
import styles from './index.module.less';

interface IH5SelectOption {
    label: string;
    value: string;
    data?: any;
}

interface IH5SelectProps {
    style?: React.CSSProperties;
    value?: string;
    open?: boolean;
    isClickHidden?: boolean;
    loading?: boolean;
    options?: IH5SelectOption[] | undefined;
    onOpen?: () => void;
    onCancel?: () => void;
    onChange?: (value: string, record?: any) => void;
    children: React.ReactNode;
}

export const H5Select = (props: IH5SelectProps) => {
    const { value, options, onCancel, onChange, style, onOpen, loading, isClickHidden = true } = props;
    const [open, setOpen] = useState(false);
    const handleChoose = (value: string, record?: any) => {
        onChange?.(value, record);
        if (isClickHidden) {
            setOpen(false);
        }
    };
    const handleClose = () => {
        onCancel?.();
        setOpen(false);
    };

    return (
        <>
            <div
                className={styles.h5SelectChildren}
                style={{ ...style }}
                onClick={() => {
                    onOpen?.();
                    setOpen((_) => !_);
                }}>
                {props.children}
            </div>
            <div className={styles.h5Select}>
                <Drawer
                    height={'auto'}
                    rootClassName={styles.h5SelectDrawerWarpper}
                    title={null}
                    placement="bottom"
                    closable={false}
                    onClose={handleClose}
                    open={open}
                    key="h5-select-drawer">
                    {loading ? (
                        <div className={styles.loading}>
                            <Loading />
                        </div>
                    ) : (
                        <div className={styles.h5SelectContainer}>
                            <div className={styles.h5SelectContainerOption}>
                                {options?.map((item) => (
                                    <div
                                        key={item.value}
                                        className={`${styles.h5SelectItem} ${
                                            value === item.value ? styles.active : ''
                                        }`}
                                        onClick={() => handleChoose(item?.value, item)}>
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                            {options?.length && options?.length > 0 && (
                                <div className={`${styles.h5SelectItem} ${styles.cancel}`} onClick={handleClose}>
                                    取消
                                </div>
                            )}
                        </div>
                    )}
                </Drawer>
            </div>
        </>
    );
};
