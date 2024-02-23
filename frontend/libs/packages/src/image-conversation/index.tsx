import React, { useEffect, useRef, useState } from 'react';
import { App } from 'antd';
import copy from 'copy-to-clipboard';
import services from '@xm/services';
import useRequest from '@ahooksjs/use-request';
import Icon from '@ant-design/icons';
import { loadSrc } from '@/utils';
import { ImagePreview, ImageViewer, ReferImageModal, ImageProgress, TaskLoading, TextCollapse } from '@xm/components';

import ChatItem, { IReferProps } from './components/chat-item';
import ImageDoingItem from './components/image-doing-item';
import ChatAction from './components/chat-action';
import TaskCheck from './components/task-check';
import DeleteModal from './components/delete-modal';

import { ReactComponent as ImageTitleIcon } from '@/assets/images/image-title.svg';
import { ReactComponent as DoubleArrowDownIcon } from '@/assets/images/double-arrow-down.svg';

import type { IMAGE_CONVERSATION } from '@/types';

import styles from './index.module.less';
import { RobotInfoCard } from '../robot-info-card';

export const PAGE_SIZE = 10;
export const DEFAULT_MESSAGE_ID = '__xm_image_chat_default_data__';
const IMAGE_CHAT_GO_TO_BOTTOM = '__xm_image_chat_go_to_bottom__';
/**
 * TODO: 第一次滚动到底标识
 */
const SHOW_GO_TO_BOTTOM_SIZE = Math.max(PAGE_SIZE, 10);

/**
 * 状态：
 * NOT_START（未开始）,SUBMITTED（已提交）,IN_PROGRESS（处理中）,FAILURE（失败）,SUCCESS（成功）
 */

export interface IShowImage {
    id: string;
    url: string;
    imageTotal?: number;
    disableAction?: boolean;
}

export interface IImageData extends Modifiy<IMAGE_CONVERSATION.IImageHistoryItem, { prompt?: React.ReactNode }> {
    desc?: string;
    current?: number;
    disableAction?: boolean;
    progress?: string;
}

const DEFAULT_DATAS: IImageData[] = [
    {
        action: '',
        messageId: DEFAULT_MESSAGE_ID,
        status: 'SUCCESS',
        originInput: '',
        prompt: `欢迎来到「灵感绘图」，在这里您的任何创意灵感都将被转化为真实的艺术创作。只需告诉我您的想法：如“🌆城市霓虹”、“🌅落日晚霞”，我就会为您创作出令人着迷的视觉杰作。例如：易拉罐装的樱桃味汽水的广告图。`,
        imageUrl: loadSrc('./images/image-chat-default.png'),
        desc: `快来释放你的创意，踏上创作之旅！`,
        disableAction: true
    }
];

const getImageChatItemId = (id: string | number) => `__xm_image_chat_item_${id}__`;

const getDefaultImageChat = (id: string, text?: string): IImageData => ({
    messageId: id,
    status: 'NOT_START',
    originInput: text || '发送中...'
});

const consoleScroll = (ele: any, name?: string) => {
    console.log('consoleScroll:', name, ele.scrollTop, ele.clientHeight, ele.scrollHeight);
};

const ImageConversation = () => {
    /**
     * TODO: shadowRoot 在最外层扩散进来
     */
    const __xm_root__ = document.getElementById(`_ml_xm_container`);
    const __xm_shadow_root__ = __xm_root__?.shadowRoot;

    const { message } = App.useApp();

    const [datas, setDatas] = useState<IImageData[]>([]);
    const [current, setCurrent] = useState(1);
    const [isEnd, setIsEnd] = useState(false);
    const [isFirstFetchEnd, setIsFirstFetchEnd] = useState(false);
    const [showSettingTip, setShowSettingTip] = useState(false);
    const [showGotoBottom, setShowGotoBottom] = useState(false);
    const [defaultSetting, setDefaultSetting] = useState<IMAGE_CONVERSATION.IParamsConfig>();

    // 预览图片信息存储
    const [previewImage, setPreviewImage] = useState<IShowImage | null>();
    // 查看参考图片信息存储
    const [referImage, setReferImage] = useState<IShowImage | null>();
    // 设置参考图片信息
    const [referInfo, setReferInfo] = useState<IReferProps>();
    // 删除信息
    const [delOpen, setDelOpen] = useState(false);
    const [delInfo, setDelInfo] = useState<IImageData>();

    const wapperRef = useRef<HTMLDivElement>(null);
    const lastRef = useRef<HTMLDivElement>(null);

    /**
     * 任务进行中的判断（最后一个任务是否是终态）
     */
    const taskIsDoing = !['FAILURE', 'SUCCESS'].includes((datas?.[datas.length - 1] as any)?.status);

    // 滚动到底部的另一个实现 只有在第一次加载的时候使用 极大值
    const scrollToBigInt = () => {
        wapperRef?.current?.scrollTo({
            top: 99999,
            behavior: 'smooth'
        });
    };

    const scrollToBottom = () => {
        lastRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    const isBottom = (distance = 13) => {
        return (
            wapperRef?.current &&
            wapperRef?.current?.scrollHeight - wapperRef?.current?.scrollTop - wapperRef?.current?.clientHeight <
                distance
        );
    };

    const { run: getDefaultSetting } = useRequest(services.imageConversation.defaultSetting, {
        manual: true,
        onSuccess: (res: IMAGE_CONVERSATION.IParamsConfig, params) => {
            setDefaultSetting(res);
        }
    });

    const { loading: imageHistoryLoading, run: getImageHistory } = useRequest(services.imageConversation.history, {
        manual: true,
        onSuccess: (res: IMAGE_CONVERSATION.IImageHistoryRes) => {
            const __first_id__ = getImageChatItemId(datas?.[0]?.messageId);
            const __first_ele__ = __xm_shadow_root__?.getElementById(__first_id__);
            const { records = [], total, size } = res;
            // console.log(res, 'ImageConversation-res');
            // if (records?.length > 0) {
            const realRecords = records.reverse();
            let defaultArr: IImageData[] = [];
            if (records?.length < 10) {
                defaultArr = [...DEFAULT_DATAS];
                setIsEnd(true);
            }
            setDatas([...defaultArr, ...realRecords.map((_) => ({ ..._, current })), ...datas]);
            if (current === 1) {
                setTimeout(() => {
                    scrollToBigInt();
                    // 二次滚动
                    setTimeout(() => {
                        if (!isBottom()) {
                            scrollToBigInt();
                        }
                    }, 200);
                }, 0);
            } else {
                setTimeout(() => {
                    __first_ele__?.scrollIntoView({
                        block: 'start',
                        inline: 'nearest'
                    });
                }, 0);
            }
            setCurrent(current + 1);
            setIsFirstFetchEnd(true);
        }
    });

    /**
     * 补充删除节点数据
     */
    const { run: getComplete } = useRequest(services.imageConversation.history, {
        manual: true,
        onSuccess: (res: IMAGE_CONVERSATION.IImageHistoryRes) => {
            const { records } = res;
            setDatas([...records, ...datas]);
        }
    });

    const { loading: addImageTaskLoading, run: addImageTask } = useRequest(services.imageConversation.add, {
        manual: true,
        onSuccess: (res: { messageId: string }, params) => {
            const { messageId } = res;
            const [data] = params;
            const nowDatas = isEnd ? datas : datas.slice(1);
            setDatas([...nowDatas, getDefaultImageChat(messageId, data.msg)]);
            setTimeout(() => {
                if (!isBottom()) {
                    scrollToBottom();
                }
            }, 200);
        }
    });

    // 变化图像
    const { loading: changeImageTaskLoading, run: changeImageTask } = useRequest(services.imageConversation.change, {
        manual: true,
        onSuccess: (res: { messageId: string }) => {
            const { messageId } = res;
            setPreviewImage(null);
            const nowDatas = isEnd ? datas : datas.slice(1);
            setDatas([...nowDatas, { ...getDefaultImageChat(messageId), ...res }]);
            setTimeout(() => {
                scrollToBottom();
            }, 0);
        }
    });

    // 更新配置
    const { run: updateSetting } = useRequest(services.imageConversation.updateSetting, {
        manual: true,
        onSuccess: (res) => {
            setShowSettingTip(true);
            setTimeout(() => {
                setShowSettingTip(false);
            }, 3000);
        }
    });

    const onCopy = (text: string) => {
        copy(text);
        const msg = '复制成功';
        message.success({
            key: msg,
            content: msg
        });
    };

    const handleLoadingMore = () => {
        getImageHistory({
            pageNo: current,
            pageSize: PAGE_SIZE,
            __xmMark: 'pageLoading'
        });
    };

    const onHandleScrollToLast = () => {
        lastRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    const handleOnScroll: React.DOMAttributes<HTMLDivElement>['onScroll'] = (e) => {
        // 顶部加载更多
        if (e.currentTarget.scrollTop <= 2 && !imageHistoryLoading && !isEnd) {
            handleLoadingMore();
        }

        // 展示回到底部
        if (
            1 - (e.currentTarget?.clientHeight + e.currentTarget?.scrollTop) / 1.0 / e.currentTarget?.scrollHeight >=
            SHOW_GO_TO_BOTTOM_SIZE / 1.0 / datas?.length
        ) {
            setShowGotoBottom(true);
        } else {
            setShowGotoBottom(false);
        }
    };

    const onHandlePressEnter = (data: IMAGE_CONVERSATION.IImageAddReq) => {
        return addImageTask(data);
    };

    const onHandleRefer = (data: IReferProps) => {
        setReferInfo(data);
        setTimeout(() => {
            setReferInfo(undefined);
        }, 2000);
    };

    const onHanleImageChange = (messageId: string, position: number | undefined, action: string) => {
        if (addImageTaskLoading || changeImageTaskLoading || taskIsDoing) {
            message.warning('当前有任务正在执行，请在执行完成后进行操作');
            return;
        }
        changeImageTask({ messageId, position, action });
    };

    // eslint-disable-next-line max-params
    const onHanleShowPreviewImage = (data: IShowImage) => {
        setPreviewImage({
            ...data
        });
    };

    const onHanleShowReferImage = (data: IShowImage) => {
        setReferImage({
            ...data
        });
    };

    const onHandleReferImageClose = () => {
        setReferImage(null);
    };

    const onHanleReferImageUse = () => {
        if (referImage) {
            setReferInfo({
                image: referImage?.url
            });
            setReferImage(null);
            setTimeout(() => {
                setReferInfo(undefined);
            }, 2000);
        }
    };

    const clearDel = () => {
        setDelOpen(false);
        setDelInfo(undefined);
    };

    const delCallback = async (data: IImageData) => {
        const newDatas = [...datas.filter((_) => _.messageId !== data.messageId)];
        setDatas(newDatas);
        if (!isEnd) {
            await getComplete({
                pageNo: datas.length,
                pageSize: 1
            });
        }
        clearDel();
    };

    const onHandleDelete = (data: IImageData) => {
        setDelInfo(data);
        setDelOpen(true);
    };

    const onHandleCopySetting = (data: IImageData) => {
        updateSetting({ ...data?.paramConfig });
    };

    /**
     * 调试函数
     */
    const onHandleTest = () => {
        consoleScroll(wapperRef?.current, 'wapperRef-onHandleTest');
    };

    const onUpdateLastData = (data: IImageData) => {
        if (datas[datas.length - 1].status !== data.status || datas[datas.length - 1].imageUrl !== data.imageUrl) {
            const nowIsBottom = isBottom();
            setDatas([...datas.slice(0, -1), data]);
            if (data.imageUrl) {
                if (nowIsBottom) {
                    setTimeout(() => {
                        scrollToBottom();
                    }, 200);
                }
            }
        }
    };

    const onHandleDataChange = (data: IImageData[]) => {
        const nowIsBottom = isBottom();
        const firstDatas = isEnd ? DEFAULT_DATAS : [];
        setDatas([...firstDatas, ...data]);
        if (nowIsBottom) {
            setTimeout(() => {
                scrollToBottom();
            }, 200);
        }
    };

    useEffect(() => {
        getDefaultSetting();
        getImageHistory({
            pageNo: current,
            pageSize: PAGE_SIZE,
            __xmMark: 'firstPageLoading'
        });
    }, []);

    return (
        <div className={styles['image-conversation']}>
            <div ref={wapperRef} className={styles.chats} onScroll={handleOnScroll}>
                {isEnd ? (
                    <>
                        <RobotInfoCard style={{ marginTop: '16px' }} />
                        <div className={styles.title}>
                            <Icon className={styles.icon} component={ImageTitleIcon} />
                            灵感绘图
                        </div>
                    </>
                ) : imageHistoryLoading ? (
                    <TaskLoading spinning={imageHistoryLoading} />
                ) : (
                    <></>
                )}
                {datas.map((item, index) => {
                    const {
                        messageId,
                        imageUrl,
                        refImageUrl,
                        originImageUrl,
                        originInput,
                        prompt,
                        current,
                        desc,
                        options,
                        status,
                        action,
                        progress,
                        disableAction,
                        failReason
                    } = item;
                    return (
                        <div
                            id={getImageChatItemId(messageId)}
                            key={messageId}
                            data-current={current}
                            data-message-id={messageId}
                            className={styles['chat-item-wapper']}>
                            {status && ['SUCCESS'].includes(status) && (
                                <ChatItem
                                    actionType={action}
                                    messageId={messageId}
                                    originText={originInput}
                                    translateText={prompt}
                                    genImage={imageUrl}
                                    originImageUrl={originImageUrl}
                                    refImage={refImageUrl}
                                    desc={desc}
                                    imgTotal={options}
                                    disableAction={disableAction}
                                    onImageChange={onHanleImageChange}
                                    onShowPreviewImage={onHanleShowPreviewImage}
                                    onRefer={onHandleRefer}
                                    onShowReferImage={onHanleShowReferImage}
                                    onCopyPrompt={() => prompt && onCopy(prompt as string)}
                                    onCopySetting={() => onHandleCopySetting(item)}
                                    onDelete={() => onHandleDelete(item)}
                                />
                            )}
                            {status && ['FAILURE'].includes(status) && (
                                <>
                                    <ChatItem
                                        style={{
                                            width: 'auto',
                                            padding: '8px',
                                            color: 'rgba(0, 0, 0, 0.75)',
                                            border: '1px solid #D85A5A',
                                            backgroundColor: '#FFE0E0',
                                            borderRadius: '6px'
                                        }}
                                        messageId={messageId}
                                        translateText={originInput}
                                        onCopyPrompt={() => prompt && onCopy(prompt as string)}
                                        onCopySetting={() => onHandleCopySetting(item)}
                                        onDelete={() => onHandleDelete(item)}
                                    />
                                    <div className={styles['error-reason']}>{failReason}</div>
                                    {/* <ImageErrorItem description={originInput} errorReason={failReason} /> */}
                                </>
                            )}
                            {!['SUCCESS', 'FAILURE'].includes(status!) && (
                                <ImageDoingItem id={messageId} onDataChange={onUpdateLastData}>
                                    {imageUrl ? (
                                        <ChatItem
                                            actionType={action}
                                            messageId={messageId}
                                            originText={originInput}
                                            translateText={prompt}
                                            genImage={imageUrl}
                                            refImage={refImageUrl}
                                            onShowReferImage={onHanleShowReferImage}
                                            desc={<ImageProgress text={`图片生成中...`} progress={progress} />}
                                            disableAction={true}
                                        />
                                    ) : (
                                        originInput && (
                                            <>
                                                <div className={styles['doing-no-image-url-item']}>
                                                    <TextCollapse>{originInput}</TextCollapse>
                                                </div>
                                                <ImageProgress
                                                    text={`${
                                                        ['NOT_START'].includes(status!)
                                                            ? '任务创建中...'
                                                            : '任务已提交，请耐心等待'
                                                    }`}
                                                />
                                            </>
                                        )
                                    )}
                                </ImageDoingItem>
                            )}
                        </div>
                    );
                })}
                <div id="__xm_image_last_div__" ref={lastRef} className={styles.last} />
            </div>
            <div className={styles.action}>
                <ChatAction
                    imageUrl={referInfo?.image}
                    referText={referInfo?.msg}
                    disableBtn={addImageTaskLoading || changeImageTaskLoading || taskIsDoing}
                    sendMessage={onHandlePressEnter}
                    settingModalProps={{
                        tooltipOpen: showSettingTip,
                        initConfig: defaultSetting
                    }}
                />
                <div
                    className={styles['go-to-bottom']}
                    id={IMAGE_CHAT_GO_TO_BOTTOM}
                    key={IMAGE_CHAT_GO_TO_BOTTOM}
                    style={{
                        display: isFirstFetchEnd && showGotoBottom ? 'inline-block' : 'none'
                    }}
                    onClick={onHandleScrollToLast}>
                    <Icon className={styles.icon} component={DoubleArrowDownIcon} />
                    回到最新位置
                </div>
            </div>

            {/* 预览 */}
            <ImagePreview key={previewImage?.id} open={!!previewImage?.id} onClose={() => setPreviewImage(null)}>
                <ImageViewer
                    style={{ borderRadius: '4px' }}
                    url={`${previewImage?.url}`}
                    imgTotal={previewImage?.imageTotal}
                    disableAction={previewImage?.imageTotal === 1 || previewImage?.disableAction}
                    onActionClick={(position, action) =>
                        previewImage?.id && onHanleImageChange(previewImage?.id, position, action)
                    }
                />
            </ImagePreview>

            {/* 参考图片 */}
            <ReferImageModal
                open={!!referImage?.url}
                url={referImage?.url}
                onCancel={onHandleReferImageClose}
                onOk={onHanleReferImageUse}>
                {referImage?.url && <ImageViewer url={referImage?.url} disableAction />}
            </ReferImageModal>

            {/* 删除 */}
            {delInfo && <DeleteModal open={delOpen} data={delInfo} onOk={delCallback} onCancel={clearDel} />}

            {/* 轮询检查数据 */}
            {isFirstFetchEnd && (
                <TaskCheck
                    datas={isEnd ? [...datas.slice(DEFAULT_DATAS.length)] : [...datas]}
                    onDataChange={onHandleDataChange}
                />
            )}
        </div>
    );
};

export { ImageConversation };
