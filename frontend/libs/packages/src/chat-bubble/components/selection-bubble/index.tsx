import React from 'react';
import styles from './index.module.less';
import { CHAT_BUBBLE } from '@/types';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import Icon from '@ant-design/icons/lib/components/Icon';

type SelectionBubbleProps = Pick<CHAT_BUBBLE.ChatBubbleProps, 'data' | 'closable' | 'onSelectionCancel'>;

export const SelectionBubble: React.FC<SelectionBubbleProps> = (props) => {
    const { data, closable = false, onSelectionCancel } = props;

    return (
        <div className={styles.selectionModule}>
            {closable && (
                <span className={styles.close} onClick={onSelectionCancel}>
                    <Icon component={CloseIcon} className={styles.icon} />
                </span>
            )}
            <div className={styles.title}>您选择的文本</div>
            {data as CHAT_BUBBLE.ISelection}
        </div>
    );
};
