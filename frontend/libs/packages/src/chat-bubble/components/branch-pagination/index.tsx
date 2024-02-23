import React, { useMemo } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';
import { App, Pagination } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { CHAT_BUBBLE } from '@/types';
import { isH5 } from '@/utils';
import { CONV_PENDING_MSG } from '@/constants';

type BranchPaginationProps = Pick<
    CHAT_BUBBLE.ChatBubbleProps,
    'branchLength' | 'branchNo' | 'isConversationPending' | 'loading' | 'message' | 'onChangeBranch'
>;

export const BranchPagination: React.FC<BranchPaginationProps> = (props) => {
    const { branchLength, branchNo, isConversationPending = false, loading, message, onChangeBranch } = props;
    const { message: antdMessage } = App.useApp();

    const chatBranchInfo = useMemo(() => {
        return {
            pageNo: branchNo,
            current: branchNo,
            defaultCurrent: branchNo,
            total: branchLength
        };
    }, [branchNo, branchLength]);

    const onBranchChangeFun = (page: number) => {
        if (isConversationPending || loading) {
            antdMessage.error({
                key: CONV_PENDING_MSG,
                content: CONV_PENDING_MSG
            });
            return;
        } else {
            onChangeBranch?.(message?.parentMessageId, page);
        }
    };

    const disableChange = isConversationPending || loading;

    return (
        <span
            className={classNames({
                [styles.h5BubblePagetation]: isH5,
                [styles.bubblePagetation]: !isH5
            })}>
            <Pagination
                {...chatBranchInfo}
                pageSize={1}
                hideOnSinglePage={!(branchLength && branchLength > 1)}
                itemRender={(current, type, _) => {
                    if (type === 'prev')
                        return (
                            <LeftOutlined
                                className={classNames(styles.paginationIcon, {
                                    [styles.disableIcon]: disableChange || branchNo === 1
                                })}
                            />
                        );
                    if (type === 'next')
                        return (
                            <RightOutlined
                                className={classNames(styles.paginationIcon, {
                                    [styles.disableIcon]: disableChange || branchNo === branchLength
                                })}
                            />
                        );
                    if (type === 'page' && current === chatBranchInfo.pageNo) {
                        return (
                            <span className="current-page">
                                {branchNo}/{branchLength}
                            </span>
                        );
                    }
                    return null;
                }}
                onChange={(page: number) => {
                    onBranchChangeFun(page);
                }}
            />
        </span>
    );
};
