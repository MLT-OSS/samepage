import React, { useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import copy from 'copy-to-clipboard';
import { App, Popover } from 'antd';
import Icon from '@ant-design/icons';
import classNames from 'classnames';

import { ReactComponent as AgreeIcon } from '@/assets/images/agree.svg';
import { ReactComponent as AgreeBoldIcon } from '@/assets/images/agree-bold.svg';
import { ReactComponent as DisagreeIcon } from '@/assets/images/disagree.svg';
import { ReactComponent as DisagreeBoldIcon } from '@/assets/images/disagree-bold.svg';
import { ReactComponent as EditIcon } from '@/assets/images/edit.svg';
import { ReactComponent as DeleteIcon } from '@/assets/images/delete.svg';
import { ReactComponent as ReloadIcon } from '@/assets/images/reload.svg';
import { ReactComponent as CopyIcon } from '@/assets/images/copy-param.svg';
import { ReactComponent as CycleIcon } from '@/assets/images/cycle.svg';
import { ReactComponent as TipIcon } from '@/assets/images/tip.svg';
import { ReactComponent as SmileIcon } from '@/assets/images/smile.svg';
import { TextCollapse, ImageBtn, ConvLoading, Markdown } from '@xm/components';

import styles from './index.module.less';
import { GetBotConvKeyResponse } from '@/ytt-type/conversation';
import { useConversationContext } from '@xm/context';
import { useNavigate } from 'react-router-dom';
import { IChatInputSendDatas, IChatMedias, IChatParams } from '@/types';
import { useModelPermission } from '@xm/hooks';
import { safeParse, isH5 } from '@/utils';
interface IChatItemProps {
    isLastEle?: boolean;
    disableAction?: boolean;
    questionInfo: GetBotConvKeyResponse['messages'][0];
    answerInfo: GetBotConvKeyResponse['messages'][0];
    onRetry?: () => void;
    onChangeAnswer?: () => void;
    onFeedback?: (status: boolean) => any; // 反馈
    onDelete?: () => void;
    onEditAnswer?: (message: string) => void;
}

// eslint-disable-next-line complexity
export const StatelessBubble = (props: IChatItemProps) => {
    const { message } = App.useApp();
    const {
        isLastEle = false,
        disableAction = false,
        questionInfo,
        answerInfo,
        onFeedback,
        onDelete,
        onChangeAnswer,
        onRetry,
        onEditAnswer
    } = props;

    const navigator = useNavigate();
    const [qustionParams, setQustionParams] = useState<IChatParams>([]);
    const [qustionMedias, setQustionMedias] = useState<IChatMedias>([]);
    const [qustionData, setQustionData] = useState<IChatInputSendDatas>([]);
    const [answerContent, setAnswerContent] = useState<string>('');
    const { conversationState, dispatch } = useConversationContext();
    const { modelInfo, robotDict } = conversationState;
    const { messageRedirectPermission } = useModelPermission();
    const { params } = modelInfo || {};
    const { bot } = robotDict ?? {};

    const onCopy = () => {
        const str = `${answerInfo.title || ''}${answerInfo.title ? '\n\n' : ''}${answerContent}`;
        copy(str);
        const msg = '复制成功';
        message.success({
            key: msg,
            content: msg
        });
    };
    const redirecKey = messageRedirectPermission?.toBot ?? '';

    const paramName = useCallback(
        (key: string) => {
            if (params?.length) {
                const obj = params.find((i: any) => i.key === key);
                return obj?.name || '';
            }
            return key;
        },
        [params]
    );
    const onHandleScore = () => {
        const item = bot?.find((i: any) => i.key === redirecKey);
        if (item) {
            // 切换 内容更新
            dispatch({
                type: 'i_model_info',
                payload: {
                    modelInfo: {
                        ...item,
                        state: { title: answerInfo.title, content: answerContent }
                    }
                }
            });
            navigator(`/conversation/${item.type}/${redirecKey}`);
        }
    };
    const sourceName = useMemo(() => {
        if (answerInfo.source) {
            const item = bot?.find((i: any) => i.key === answerInfo.source);
            if (item) return item.name;
        }
        return null;
    }, [answerInfo.source]);

    const mainBubble = (
        <div className={styles['chat-item']} data-message-id={questionInfo.messageId}>
            {qustionData.length || qustionParams.length ? (
                <div
                    className={classNames(styles['origin-text'], {
                        [styles.error]: ['FAILED', 'MSG_AUDIT_FAILED'].includes(answerInfo.status!)
                    })}>
                    <TextCollapse>
                        {qustionParams.map((item, index) => (
                            <Fragment key={item.key}>
                                <span className={styles['inner-collapse']}>
                                    {`${paramName(item.key!)}：${item.value ? item.value : '-'}`}
                                </span>
                                <br />
                            </Fragment>
                        ))}
                        {qustionData.map((item: any, index) => (
                            <div className={styles['inner-collapse']} key={`other-${index}`}>
                                {item.value}
                            </div>
                        ))}
                    </TextCollapse>
                </div>
            ) : (
                <></>
            )}
            {/* todo：多图展示 视频展示 */}
            {qustionMedias.length ? (
                <div className={styles['img-box']}>
                    {qustionMedias.map((item: any) => (
                        <img
                            className={classNames({ [styles.h5]: isH5 })}
                            src={item.tempUrl || item.downloadUrl}
                            key={item.objId}
                            alt=""
                        />
                    ))}
                </div>
            ) : (
                <></>
            )}
            {['RUNNING'].includes(answerInfo.status!) ? (
                <div className={styles['loading-text-box']}>
                    {answerContent}
                    <span className={styles.loading}>
                        <span className={styles.dot}>.</span>
                        <span className={styles.dot}>.</span>
                        <span className={styles.dot}>.</span>
                    </span>
                </div>
            ) : ['FAILED', 'MSG_AUDIT_FAILED'].includes(answerInfo.status!) ? (
                <div className={styles['error-info']}>
                    <div className={styles['error-inner']}>
                        <Icon component={TipIcon} className={styles['tip-icon']} />
                        <span className={styles['error-txt']}>
                            {answerInfo.status === 'FAILED' ? answerContent : '内容涉及敏感信息，发送失败'}
                        </span>
                    </div>
                    {answerInfo.status === 'FAILED' ? (
                        <ImageBtn iconNode={CycleIcon} disabled={disableAction || !isLastEle} onClick={onRetry}>
                            重试
                        </ImageBtn>
                    ) : (
                        <></>
                    )}
                </div>
            ) : answerInfo.title || answerContent ? (
                <>
                    {sourceName ? <div className={styles.source}>{`由 ${sourceName} 提供`}</div> : <></>}
                    <div className={styles.answerText}>
                        {answerInfo.title ? <span className={styles.title}>{`${answerInfo.title}\n\n`}</span> : <></>}
                        {answerContent}
                        {/* <Markdown data={answerContent} /> */}
                    </div>
                    <div className={styles.options}>
                        <ImageBtn iconNode={ReloadIcon} disabled={disableAction} onClick={onChangeAnswer}>
                            再次生成
                        </ImageBtn>
                        <ImageBtn iconNode={CopyIcon} disabled={disableAction} onClick={onCopy}>
                            复制文案
                        </ImageBtn>
                        {redirecKey && (
                            <ImageBtn iconNode={SmileIcon} disabled={disableAction} onClick={onHandleScore}>
                                文案评分
                            </ImageBtn>
                        )}
                    </div>
                </>
            ) : (
                <div className={styles['loading-box']}>
                    <ConvLoading />
                </div>
            )}
        </div>
    );
    const popoverContent = (
        <span className={styles.popoverContent}>
            {['SUCCESS'].includes(answerInfo.status!) ? (
                <>
                    {/* 赞 */}
                    <Icon
                        component={answerInfo.like === 'like' ? AgreeBoldIcon : AgreeIcon}
                        className={classNames(
                            styles.icon,
                            { [styles.active]: answerInfo.like === 'like' },
                            { [styles.disabled]: answerInfo.like !== 'unknown' }
                        )}
                        onClick={() => {
                            if (answerInfo.like !== 'unknown') {
                                return;
                            }
                            onFeedback?.(true);
                        }}
                    />
                    {/* 踩 */}
                    <Icon
                        component={answerInfo.like === 'dislike' ? DisagreeBoldIcon : DisagreeIcon}
                        className={classNames(
                            styles.icon,
                            { [styles.active]: answerInfo.like === 'dislike' },
                            { [styles.disabled]: answerInfo.like !== 'unknown' }
                        )}
                        onClick={() => {
                            if (answerInfo.like !== 'unknown') {
                                return;
                            }
                            onFeedback?.(false);
                        }}
                    />
                    {/* 编辑 */}
                    <Icon
                        component={EditIcon}
                        className={styles.icon}
                        onClick={() =>
                            onEditAnswer?.(`${answerInfo.title || ''}${answerInfo.title ? '\n\n' : ''}${answerContent}`)
                        }
                    />
                </>
            ) : (
                <></>
            )}
            {/* 删除 */}
            <Icon component={DeleteIcon} className={styles.icon} onClick={onDelete} />
        </span>
    );
    useEffect(() => {
        if (questionInfo.content) {
            if (questionInfo.contentType === 'template_params') {
                const params: IChatParams = safeParse(questionInfo.content);
                setQustionParams(params);
            } else if (questionInfo.contentType === 'input') {
                const qustion: IChatInputSendDatas = safeParse(questionInfo.content);
                const param = qustion.filter((i) => i.type === 'template');
                const params: any = param.map((i) => safeParse(i.value));
                const medias = qustion.filter((i) => i.type !== 'template' && i.type !== 'text');
                const mediasArr = medias.map((i) => {
                    return {
                        ...safeParse(i.value),
                        type: i.type
                    };
                });
                const otherInfo: IChatInputSendDatas = qustion.filter((i) => i.type === 'text');
                setQustionParams(params);
                setQustionMedias(mediasArr);
                setQustionData(otherInfo);
            }
        }
    }, [questionInfo.content]);
    useEffect(() => {
        if (answerInfo.content) {
            if (
                (answerInfo as any).contentType === 'reply_input' &&
                !['FAILED', 'RUNNING', 'MSG_AUDIT_FAILED'].includes(answerInfo.status!)
            ) {
                const inputInfo: IChatInputSendDatas = safeParse(answerInfo.content);
                const otherInfo: IChatInputSendDatas = inputInfo.filter((i) => i.type === 'text');
                setAnswerContent(otherInfo.map((i) => i.value).join(''));
            } else {
                setAnswerContent(answerInfo.content);
            }
        }
    }, [answerInfo.content]);

    return (
        <>
            {!disableAction ? (
                <Popover
                    placement="topRight"
                    arrow={false}
                    content={popoverContent}
                    className={styles.popover}
                    getPopupContainer={(node) => {
                        return (node?.parentNode ?? document.body) as HTMLElement;
                    }}
                    overlayInnerStyle={{ padding: 0 }}>
                    {mainBubble}
                </Popover>
            ) : (
                mainBubble
            )}
        </>
    );
};
