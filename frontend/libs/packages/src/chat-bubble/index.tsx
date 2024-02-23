import classNames from 'classnames';
import styles from './index.module.less';
import { useEffect, useMemo, useState } from 'react';
import { Popover } from 'antd';

import { CHAT_BUBBLE } from '@/types';
import { useChatPermission } from '@xm/hooks';
import { useConversationContext } from '@xm/context';
import { isH5, safeParse } from '@/utils';

import { ReactComponent as OnlineSearchIcon } from '@/assets/images/online-search.svg';
import { ReactComponent as RightArrowIcon } from '@/assets/images/right-arrow.svg';
import { ReactComponent as InfoIcon } from '@/assets/images/info.svg';
import Icon from '@ant-design/icons/lib/components/Icon';

import { ConvLoading, Markdown, ImagePreview } from '@xm/components';
import { ReferBubble } from './components/refer-bubble';
import { BranchPagination } from './components/branch-pagination';
import { PopoverContent } from './components/popover-content';
import { SelectionBubble } from './components/selection-bubble';
import { SummaryBubble } from './components/summary-bubble';
import { LastBubbleAction } from './components/last-bubble-action';
import { MultimediaBubble } from './components/multimedia-bubble';

interface IDocLinkNode {
    data: any;
    getWebDocUrl?: (params: { docId?: string }) => Promise<string>;
}
const DocLinkNode = (props: IDocLinkNode) => {
    const { data, getWebDocUrl } = props;
    const [path, setPath] = useState<string | undefined>('');

    const [docName, setDocName] = useState('');

    const getDocInfo = (data: any) => {
        let res: any = {};
        try {
            res = safeParse(data as string);
        } catch {}
        return res as { docId: string; docName: string };
    };

    const getPath = async () => {
        const { docName, docId } = getDocInfo(data);
        const path = await getWebDocUrl?.({ docId });
        setPath(path);
        setDocName(docName);
    };

    useEffect(() => {
        getPath();
    }, [data]);
    return !path ? (
        <span>以下是{docName}文件的摘要</span>
    ) : (
        <span>
            以下是
            <a target="_blank" href={path}>
                {docName}
            </a>
            文件的摘要
        </span>
    );
};

export type IRefer = CHAT_BUBBLE.IRefer;

// eslint-disable-next-line complexity
export const ChatBubble: React.FC<CHAT_BUBBLE.ChatBubbleProps> = (props) => {
    const {
        branchLength,
        branchNo,
        multimodal = false,
        position,
        type = 'normal',
        last = false,
        data,
        files = [],
        feedback = 'unknown',
        message,
        loading = false,
        closable = false,
        isConversationPending = false,
        error,
        conversationType,
        summaryLoading = false,
        summaryDoneStatus = false,
        showWebSearch,
        webSearch,
        status,
        onClick,
        onSelectionCancel,
        onEditQuestion,
        onChangeAnswer,
        onChangeSearch,
        onAddPrompt,
        onEditAnswer,
        onFeedback,
        onClickSuggest,
        onReferClick,
        onChangeBranch,
        getWebDocUrl
    } = props;
    const { readDocPermission } = useChatPermission();
    const { conversationState } = useConversationContext();
    const { modelInfo } = conversationState;
    const { type: modelType } = modelInfo || {};

    const [mainBubblePopoverOpen, setMainBubblePopoverOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<any | null>();

    const getDocInfo = () => {
        let res: any = {};
        try {
            res = safeParse(data as string);
        } catch {}
        return res as { docId: string; docName: string };
    };
    const gotoDoc = async () => {
        const path = await getWebDocUrl?.({});
        window.open(path, '_blank');
    };

    const handleMainBubblePopoverHide = () => {
        setMainBubblePopoverOpen(false);
    };

    const handleMainBubblePopoverChange = (visible: boolean) => {
        setMainBubblePopoverOpen(visible);
    };

    const onHanleShowPreviewImage = (data: any) => {
        setPreviewImage({
            ...data
        });
    };

    const showBranch = branchLength && branchLength > 1;
    const isAuditErrorQuestion = error === 'AUDIT' && position === 'right';
    const isAuditErrorAnswer =
        error === 'AUDIT' && position === 'left' && !['selection', 'selection-help'].includes(type);

    const bubbleBoxClassName = useMemo(() => {
        return classNames(styles.bubbleBox, {
            [styles.left]: position === 'left',
            [styles.right]: position === 'right' || isAuditErrorAnswer
        });
    }, [position]);

    const bubbleClassName = useMemo(() => {
        return classNames(styles.bubble, {
            [styles.left]: position === 'left',
            [styles.right]: position === 'right',
            [styles.lightColor]: multimodal && position === 'right',
            [styles.error]: !!error,
            [styles['audit-error-question']]: isAuditErrorQuestion,
            [styles.guide]: type === 'guide',
            [styles.rich]: ['summary', 'selection', 'refer', 'doc-refer'].includes(type) // 渲染成富文本的类型
        });
    }, [position, type]);

    const getBranchPagination = () => {
        return (
            <BranchPagination
                branchLength={branchLength}
                branchNo={branchNo}
                isConversationPending={isConversationPending}
                loading={loading}
                message={message}
                onChangeBranch={onChangeBranch}
            />
        );
    };

    // 审核失败的消息和其他气泡差异性比较大，单独处理
    if (isAuditErrorAnswer) {
        return (
            <div className={bubbleBoxClassName}>
                {showBranch && getBranchPagination()}
                <div className={bubbleBoxClassName}>
                    <span className={styles['audit-error']}>
                        <Icon component={InfoIcon} className={styles.icon} />
                        {data as string}
                    </span>
                </div>
            </div>
        );
    }

    // running 特殊处理
    if (type === 'running') {
        return (
            <div className={bubbleBoxClassName}>
                {showBranch && getBranchPagination()}
                <div className={bubbleBoxClassName}>
                    <span className={classNames(bubbleClassName, styles.running)}>
                        {data as string}
                        <span className={styles.loading}>
                            <span className={styles.dot}>.</span>
                            <span className={styles.dot}>.</span>
                            <span className={styles.dot}>.</span>
                        </span>
                    </span>
                </div>
            </div>
        );
    }

    const showPopover =
        !error &&
        !isConversationPending &&
        ['normal', 'refer', 'doc-refer', 'summary', 'input', 'web-search'].includes(type);

    const getBubbleByType = () => {
        switch (type) {
            case 'summary':
                return (
                    <SummaryBubble
                        data={data}
                        summaryLoading={summaryLoading}
                        summaryDoneStatus={summaryDoneStatus}
                        onClickSuggest={onClickSuggest}
                    />
                );
            case 'refer':
            case 'doc-refer':
            case 'web-search':
                return <ReferBubble type={type} data={data} onReferClick={onReferClick} />;
            case 'selection':
                return <SelectionBubble data={data} closable={closable} onSelectionCancel={onSelectionCancel} />;
            case 'doc-link':
                return <DocLinkNode data={data} getWebDocUrl={getWebDocUrl} />;
            case 'input':
                return <MultimediaBubble data={data} files={files} onHanleShowPreviewImage={onHanleShowPreviewImage} />;
            case 'normal':
                return <Markdown data={data as string} />;
            default:
                return data as string;
        }
    };

    const mainBubble = (
        <span
            className={bubbleClassName}
            onClick={() => {
                // 按需加
                if (type === 'guide') {
                    onClick?.(data as string);
                }
            }}>
            {getBubbleByType()}
        </span>
    );

    return (
        <div className={bubbleBoxClassName}>
            {showBranch && getBranchPagination()}
            <div className={bubbleBoxClassName}>
                {loading && (
                    <span className={bubbleClassName}>
                        <ConvLoading />
                    </span>
                )}
                {!loading && (
                    <>
                        {position === 'left' && type === 'web-search' && !!(data as CHAT_BUBBLE.IRefer)?.question && (
                            <div className={styles['seach-title']}>
                                <Icon component={OnlineSearchIcon} className={styles.icon} />
                                联网搜索：{(data as CHAT_BUBBLE.IRefer)?.question}
                            </div>
                        )}
                        {showPopover ? (
                            <Popover
                                open={mainBubblePopoverOpen}
                                onOpenChange={handleMainBubblePopoverChange}
                                arrow={false}
                                content={
                                    <PopoverContent
                                        position={position}
                                        type={type}
                                        data={data}
                                        files={files}
                                        feedback={feedback}
                                        message={message}
                                        onEditQuestion={onEditQuestion}
                                        onAddPrompt={onAddPrompt}
                                        onEditAnswer={onEditAnswer}
                                        onFeedback={onFeedback}
                                        handleMainBubblePopoverHide={handleMainBubblePopoverHide}
                                    />
                                }
                                className={styles.popover}
                                getPopupContainer={(node) => {
                                    return (node?.parentNode ?? document.body) as HTMLElement;
                                }}
                                overlayInnerStyle={{ padding: 0 }}
                                trigger={isH5 ? 'click' : 'hover'}>
                                {mainBubble}
                            </Popover>
                        ) : (
                            mainBubble
                        )}
                        {readDocPermission.summaryGuide &&
                            type === 'summary' &&
                            conversationType === 'DOC' &&
                            status === 'done' && (
                                <div className={styles['goto-doc-box']}>
                                    <div className={styles.gotoDoc} onClick={gotoDoc}>
                                        尝试使用网页版查看 PDF详细信息和内容对照
                                        <Icon component={RightArrowIcon} className={styles.icon} />
                                    </div>
                                </div>
                            )}
                        {!isConversationPending &&
                            last &&
                            position === 'left' &&
                            ['normal', 'refer', 'doc-refer', 'summary', 'input', 'web-search'].includes(type) && (
                                <LastBubbleAction
                                    type={type}
                                    message={message}
                                    error={error}
                                    showWebSearch={showWebSearch}
                                    webSearch={webSearch}
                                    onChangeAnswer={onChangeAnswer}
                                    onChangeSearch={onChangeSearch}
                                />
                            )}
                    </>
                )}
            </div>

            {/* 预览 */}
            <div style={{ textAlign: 'initial' }}>
                <ImagePreview key={previewImage?.id} open={!!previewImage?.id} onClose={() => setPreviewImage(null)}>
                    <div style={{ maxHeight: '90vh', overflow: 'auto' }}>
                        <img src={previewImage?.url} alt="Preview" style={{ width: '100%' }} />
                    </div>
                </ImagePreview>
            </div>
        </div>
    );
};
