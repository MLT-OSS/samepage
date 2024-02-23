import classNames from 'classnames';
import styles from './index.module.less';
import { App } from 'antd';
import copy from 'copy-to-clipboard';

import { CHAT_BUBBLE } from '@/types';
import { useChatPermission, useModelPermission } from '@xm/hooks';
import { isH5, safeParse } from '@/utils';

import Icon from '@ant-design/icons/lib/components/Icon';
import { ReactComponent as AddIcon } from '@/assets/images/add-circle-outline.svg';
import { ReactComponent as AgreeIcon } from '@/assets/images/agree.svg';
import { ReactComponent as AgreeBoldIcon } from '@/assets/images/agree-bold.svg';
import { ReactComponent as DisagreeIcon } from '@/assets/images/disagree.svg';
import { ReactComponent as DisagreeBoldIcon } from '@/assets/images/disagree-bold.svg';
import { ReactComponent as EditIcon } from '@/assets/images/edit.svg';
import { ReactComponent as CopyIcon } from '@/assets/images/copy.svg';

type PopoverContentProps = Pick<
    CHAT_BUBBLE.ChatBubbleProps,
    | 'position'
    | 'type'
    | 'data'
    | 'files'
    | 'feedback'
    | 'message'
    | 'onEditQuestion'
    | 'onAddPrompt'
    | 'onEditAnswer'
    | 'onFeedback'
> & { handleMainBubblePopoverHide: () => any };

export const PopoverContent: React.FC<PopoverContentProps> = (props) => {
    const {
        position,
        type = 'normal',
        data,
        files = [],
        feedback = 'unknown',
        message,
        onEditQuestion,
        onAddPrompt,
        onEditAnswer,
        onFeedback,
        handleMainBubblePopoverHide
    } = props;
    const { promptPermission } = useChatPermission();
    const { editQuestionPermission } = useModelPermission();
    const { message: antdMessage } = App.useApp();

    const onCopy = () => {
        const text = ['summary', 'refer', 'doc-refer', 'web-search'].includes(type)
            ? (data as CHAT_BUBBLE.ISummary).content
            : (data as string);
        copy(text);
        const msg = '复制成功';
        antdMessage.success({
            key: msg,
            content: msg
        });
    };

    const addPrompt = () => {
        let promptText = data as string;
        if (type === 'web-search') {
            promptText = (data as CHAT_BUBBLE.IRefer)?.content;
        }
        onAddPrompt?.(promptText);
    };

    const editAnswer = () => {
        let editText = message?.content ?? (data as string);
        if (['input', 'web-search'].includes(type)) {
            const parseContent = editText && safeParse(editText || '[]');
            editText = parseContent?.[0]?.value;
        }
        onEditAnswer?.(editText);
    };

    // 气泡中存在图片或者视频等多媒体资源则不可编辑
    const hasMultimedia = files?.length > 0;
    const showAddPrompt =
        promptPermission.add && ['normal', 'input', 'web-search'].includes(type) && position === 'right';

    return (
        <span className={styles.popoverContent}>
            {position === 'left' && (
                <>
                    <div
                        className={classNames(
                            styles.item,
                            { [styles.h5Item]: isH5 },
                            { [styles.active]: feedback === 'like' },
                            { [styles.disabled]: feedback !== 'unknown' }
                        )}
                        onClick={() => {
                            if (feedback !== 'unknown') {
                                return;
                            }
                            onFeedback?.(message!, true);
                            handleMainBubblePopoverHide();
                        }}>
                        <Icon
                            component={feedback === 'like' ? AgreeBoldIcon : AgreeIcon}
                            className={classNames(styles.icon)}
                        />
                        {isH5 && <div className={styles.text}>赞</div>}
                    </div>
                    <div
                        className={classNames(
                            styles.item,
                            { [styles.h5Item]: isH5 },
                            { [styles.active]: feedback === 'dislike' },
                            { [styles.disabled]: feedback !== 'unknown' }
                        )}
                        onClick={() => {
                            if (feedback !== 'unknown') {
                                return;
                            }
                            onFeedback?.(message!, false);
                            handleMainBubblePopoverHide();
                        }}>
                        <Icon
                            component={feedback === 'dislike' ? DisagreeBoldIcon : DisagreeIcon}
                            className={classNames(styles.icon)}
                            disabled={feedback !== 'unknown'}
                        />
                        {isH5 && <div className={styles.text}>踩</div>}
                    </div>
                </>
            )}
            {(position === 'left' || (position === 'right' && editQuestionPermission)) && !hasMultimedia && (
                <div
                    className={classNames(styles.item, { [styles.h5Item]: isH5 })}
                    onClick={() => {
                        position === 'left' && editAnswer();
                        position === 'right' && onEditQuestion?.(message!);
                        handleMainBubblePopoverHide();
                    }}>
                    <Icon component={EditIcon} className={styles.icon} />
                    {isH5 && <div className={styles.text}>编辑</div>}
                </div>
            )}
            <div
                className={classNames(styles.item, { [styles.h5Item]: isH5 })}
                onClick={() => {
                    onCopy();
                    handleMainBubblePopoverHide();
                }}>
                <Icon component={CopyIcon} className={styles.icon} />
                {isH5 && <div className={styles.text}>复制</div>}
            </div>
            {showAddPrompt && (
                <div
                    className={classNames(styles.item, { [styles.h5Item]: isH5 })}
                    onClick={() => {
                        addPrompt();
                        handleMainBubblePopoverHide();
                    }}>
                    <Icon component={AddIcon} className={styles.icon} />
                </div>
            )}
        </span>
    );
};
