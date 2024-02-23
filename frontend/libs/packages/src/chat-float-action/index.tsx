/**
 * 悬浮操作项
 */
// import React from 'react';
import { useState } from 'react';
import styles from './index.module.less';
import Icon from '@ant-design/icons';
import { ReactComponent as UndoIcon } from '@/assets/images/undo.svg';
import { ReactComponent as BookIcon } from '@/assets/images/book.svg';
import { ReactComponent as EditIcon } from '@/assets/images/edit.svg';
import { ReactComponent as PdfIcon } from '@/assets/images/pdf.svg';
import { ReactComponent as StopIcon } from '@/assets/images/stop.svg';
import { ReactComponent as OnlineSearchIcon } from '@/assets/images/online-search.svg';
import classNames from 'classnames';
import { Button } from 'antd';
import { Loading } from '@xm/components';
import { useConversationContext } from '@xm/context';
import { useModelPermission } from '@xm/hooks';
import { isH5 } from '@/utils';

type IFloatActionsConfig = Partial<Record<'readArticle' | 'readDoc' | 'webSearch', boolean>>;
interface IReadArticleConfig {
    onClick: () => any;
    loading: boolean;
    progress: number;
    progressStage: string;
}
interface IReadDocConfig {
    onClick: () => any;
    loading: boolean;
    progress: number;
    progressStage: string;
}
interface IErrorConfig {
    showRetry: boolean;
    showEditQuestion: boolean;
    onRetry?: () => any;
    onEditQuestion?: () => any;
}

interface IPauseConfig {
    show: boolean;
    onClick: () => any;
}

interface IWebSearchConfig {
    webSearch: string;
    onChangeWebSearch: (v: boolean) => any;
}

interface ChatFloatActionProps {
    config?: IFloatActionsConfig;
    readArticleConfig?: IReadArticleConfig;
    readDocConfig?: IReadDocConfig;
    errorConfig: IErrorConfig;
    pauseConfig: IPauseConfig;
    webSearchConfig?: IWebSearchConfig;
}

export const ChatFloatAction: React.FC<ChatFloatActionProps> = (props) => {
    const { config = {}, readArticleConfig, readDocConfig, errorConfig, pauseConfig, webSearchConfig } = props;
    const {
        conversationState: { userSetting }
    } = useConversationContext();
    const { editQuestionPermission } = useModelPermission();
    const [showTips, setShowTips] = useState<boolean>(false);
    const expandReadAll = userSetting?.expandReadAll || false;

    const onChangeIsSearch = (isSearch: boolean) => {
        setShowTips(true);
        webSearchConfig?.onChangeWebSearch(!isSearch);
        const timer = setTimeout(() => {
            setShowTips(false);
            clearTimeout(timer);
        }, 2 * 1000);
    };

    const renderTaskLoading = (taskType: 'article' | 'doc') => {
        const taskConfig = taskType === 'article' ? readArticleConfig : readDocConfig;
        const taskStage = taskConfig?.progressStage || '解析';
        const taskProgress = taskConfig?.progress;
        return (
            <span className={styles.taskLoading}>
                <Loading className={styles.icon} />
                <span className={styles.text}>
                    {taskStage}中...（{taskProgress || 0}%）
                </span>
            </span>
        );
    };

    return (
        <div className={classNames(styles.floatActions, { [styles.h5FloatActions]: isH5 })}>
            {/* H5联网搜索 */}
            {!!config.webSearch && (
                <div
                    className={classNames(styles.webSearch, {
                        [styles.webSearchClose]: webSearchConfig?.webSearch !== 'SMART',
                        [styles.webSearchOpen]: webSearchConfig?.webSearch === 'SMART'
                    })}
                    onClick={() => onChangeIsSearch(webSearchConfig?.webSearch === 'SMART')}>
                    <OnlineSearchIcon className={styles.icon} />
                    联网搜索
                </div>
            )}
            {/* 阅读全文 */}
            {!!config.readArticle && (
                <>
                    {readArticleConfig?.loading ? (
                        renderTaskLoading('article')
                    ) : (
                        <span
                            className={classNames({
                                [styles.readPageExpand]: expandReadAll,
                                [styles.readPage]: !expandReadAll
                            })}
                            onClick={readArticleConfig?.onClick}>
                            <span className={styles.icon}>
                                <Icon component={BookIcon} />
                            </span>
                            <span className={styles.text}>阅读此文章</span>
                        </span>
                    )}
                </>
            )}
            {/* 阅读文档 */}
            {!!config.readDoc && (
                <>
                    {readDocConfig?.loading ? (
                        renderTaskLoading('doc')
                    ) : (
                        <span className={styles.readDoc} onClick={readDocConfig?.onClick}>
                            <span className={styles.icon}>
                                <Icon component={PdfIcon} />
                            </span>
                        </span>
                    )}
                </>
            )}
            {/* 错误：重试&编辑问题 */}
            {!!(errorConfig?.showRetry || errorConfig?.showEditQuestion) && (
                <>
                    {/* 重试 */}
                    {!!errorConfig?.showRetry && (
                        <Button className={styles.btn} onClick={errorConfig?.onRetry}>
                            <Icon component={UndoIcon} className={styles.icon} />
                            重试
                        </Button>
                    )}
                    {/* 编辑问题 */}
                    {!!errorConfig?.showEditQuestion && editQuestionPermission && (
                        <Button className={styles.btn} onClick={errorConfig?.onEditQuestion}>
                            <Icon component={EditIcon} className={styles.icon} />
                            编辑问题
                        </Button>
                    )}
                </>
            )}
            {/* 停止响应 */}
            {pauseConfig.show && (
                <div className={styles.stopBox}>
                    <span className={styles.stop} onClick={pauseConfig.onClick}>
                        <Icon component={StopIcon} className={styles.icon} />
                        停止响应
                    </span>
                </div>
            )}

            {showTips && (
                <div className={styles.searchTips}>
                    <span className={styles.text}>
                        {webSearchConfig?.webSearch === 'SMART'
                            ? 'Samepage将自动判断您的问题是否需要联网搜索～'
                            : '联网搜索已关闭'}
                    </span>
                </div>
            )}
        </div>
    );
};
