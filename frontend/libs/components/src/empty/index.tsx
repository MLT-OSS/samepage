/**
 * 自定义空
 */
import { ReactComponent as EmptyIcon } from '@/assets/images/doc/ming.svg';
import styles from './index.module.less';
import { ReactElement } from 'react';

export interface EmptyProps {
    title?: ReactElement;
}

export const Empty = (props: EmptyProps) => {
    return (
        <div className={styles.empty}>
            <EmptyIcon className="empty-icon" />
            <div className="empty-title">{props.title || '暂无内容'}</div>
        </div>
    );
};
