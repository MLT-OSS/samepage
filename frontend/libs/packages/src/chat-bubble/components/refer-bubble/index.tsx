import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';

import { CHAT_BUBBLE } from '@/types';
import { isH5 } from '@/utils';
import { Markdown } from '@xm/components';

type ReferBubbleProps = Pick<CHAT_BUBBLE.ChatBubbleProps, 'type' | 'data' | 'onReferClick'>;

export const ReferBubble: React.FC<ReferBubbleProps> = (props) => {
    const { type = 'normal', data, onReferClick } = props;
    const showReference = !!(data as CHAT_BUBBLE.IRefer)?.reference?.length && (data as CHAT_BUBBLE.IRefer).content;

    return (
        <div className={styles.referBubble}>
            <div className={styles.module} style={{ borderBottom: 'none' }}>
                <Markdown data={(data as CHAT_BUBBLE.IRefer).content} />
            </div>
            {showReference && !isH5 && (
                <div className={classNames(styles.module, styles.referList)}>
                    <span className={styles.label}>来源: </span>
                    {(data as CHAT_BUBBLE.IRefer).reference?.map((i, idx) => (
                        <span
                            key={i.key}
                            className={styles.item}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                onReferClick?.(type, i);
                            }}>
                            [{idx + 1}]
                        </span>
                    ))}
                </div>
            )}
            {showReference && isH5 && (
                <div className={styles.h5ReferList}>
                    {(data as CHAT_BUBBLE.IRefer).reference?.map((i, idx) => (
                        <div
                            key={i.key}
                            className={styles.item}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                onReferClick?.(type, i);
                            }}>
                            来源[{idx + 1}]
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
