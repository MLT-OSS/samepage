import React from 'react';
import { Button, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import { downloadImage } from '@/utils';

import { ImageViewer, ImageBtn, TextCollapse } from '@xm/components';

import { ReactComponent as ApplyIcon } from '@/assets/images/apply.svg';
import { ReactComponent as CopyIcon } from '@/assets/images/copy.svg';
import { ReactComponent as DeleteIcon } from '@/assets/images/delete.svg';
import { ReactComponent as PreviewIcon } from '@/assets/images/preview.svg';
import { ReactComponent as ReferIcon } from '@/assets/images/refer.svg';
import { ReactComponent as ReloadIcon } from '@/assets/images/reload.svg';
import { ReactComponent as ChangeIcon } from '@/assets/images/change.svg';
import { ReactComponent as DownloadIcon } from '@/assets/images/download.svg';

import type { IShowImage } from '../..';

import styles from './index.module.less';

const ACTION_TYPE_CONFIG: Record<string, string> = {
    UPSCALE: '放大',
    VARIATION: '变体',
    REROLL: '重新生成'
};
export interface IReferProps {
    image?: string;
    msg?: string;
}

interface IChatItemProps {
    style?: React.CSSProperties;
    messageId: string;
    actionType?: string; // 操作类型
    refImage?: string; // 参考图片地址
    originText?: string; // 原始文本
    translateText: React.ReactNode; // 翻译 prompt
    genImage?: string; // 图片地址
    originImageUrl?: string; // 高清图片地址
    desc?: React.ReactNode; //
    disableAction?: boolean;
    imgTotal?: number;
    onImageChange?: (messageId: string, position: number | undefined, action: string) => void;
    onShowPreviewImage?: (data: IShowImage) => void;
    onRefer?: (data: IReferProps) => void;
    onShowReferImage?: (data: IShowImage) => void;
    onCopySetting?: () => void;
    onCopyPrompt?: () => void;
    onDelete?: () => void;
}

const ChatItem = (props: IChatItemProps) => {
    const {
        style,
        messageId,
        actionType,
        refImage,
        originText,
        translateText,
        genImage,
        originImageUrl,
        desc,
        disableAction,
        imgTotal,
        onImageChange,
        onShowPreviewImage,
        onRefer,
        onShowReferImage,
        onCopySetting,
        onCopyPrompt,
        onDelete
    } = props;

    const ImagePreviewBtn = () => (
        <ImageBtn
            iconNode={PreviewIcon}
            onClick={() =>
                originImageUrl &&
                onShowPreviewImage?.({ id: messageId, url: originImageUrl, imageTotal: imgTotal, disableAction })
            }>
            高清预览
        </ImageBtn>
    );

    const onHandleImageChange = (position: number | undefined, action: string) => {
        onImageChange?.(messageId, position, action);
    };

    const onHandleImageDownload = (url: string) => {
        const paths = url.split('//')[1].split('/');
        const name = paths[paths.length - 1];
        const type = name.split('.')[1];
        downloadImage(url, name, type);
    };

    const onHandleReferClick = (url: string) => {
        onRefer?.({
            image: url
        });
    };

    const onHandleShowReferImage = (url: string) => {
        onShowReferImage?.({ id: messageId, url, imageTotal: imgTotal, disableAction: true });
    };

    return (
        <div style={{ ...style }} className={styles['chat-item']} data-message-id={messageId}>
            {!disableAction && (
                <div className={styles['hover-action-wapper']}>
                    <div className={styles.placeholder} />
                    <div className={styles['hover-group-btn']}>
                        {/* 应用参数设置接口 底下的设置按钮要加toast提示 3秒消失 */}
                        <Tooltip title="应用参数">
                            <Button
                                className="hover-btn"
                                icon={<Icon className="btn-icon" component={ApplyIcon} />}
                                onClick={onCopySetting}
                            />
                        </Tooltip>
                        {/* 复制英文prompt */}
                        <Tooltip title="复制">
                            <Button
                                className="hover-btn"
                                icon={<Icon className="btn-icon" component={CopyIcon} />}
                                onClick={onCopyPrompt}
                            />
                        </Tooltip>
                        <Tooltip title="删除">
                            <Button
                                className="hover-btn"
                                icon={<Icon className="btn-icon" component={DeleteIcon} />}
                                onClick={onDelete}
                            />
                        </Tooltip>
                    </div>
                </div>
            )}
            {actionType && ACTION_TYPE_CONFIG?.[actionType] && (
                <div className={styles['action-type']}>{ACTION_TYPE_CONFIG?.[actionType] || actionType}</div>
            )}
            {refImage && (
                <div className={styles.refer}>
                    <ImageBtn onClick={() => onHandleShowReferImage(refImage)}>查看参考图片</ImageBtn>
                </div>
            )}
            {originText && (
                <div className={styles['origin-text']}>
                    <TextCollapse>{originText}</TextCollapse>
                </div>
            )}
            {translateText && <TextCollapse>{translateText}</TextCollapse>}
            {genImage && (
                <div className={styles['gen-image']}>
                    <ImageViewer
                        url={genImage}
                        imgTotal={imgTotal}
                        disableAction={imgTotal === 1 || disableAction}
                        onActionClick={onHandleImageChange}
                    />
                </div>
            )}
            {desc && <div className={styles.desc}>{desc}</div>}
            {imgTotal && (
                <div className={styles.options}>
                    {imgTotal === 1 && (
                        <>
                            <ImagePreviewBtn />
                            <ImageBtn
                                iconNode={ReferIcon}
                                onClick={() => originImageUrl && onHandleReferClick(originImageUrl)}>
                                作为参考
                            </ImageBtn>
                            <ImageBtn
                                iconNode={DownloadIcon}
                                onClick={() => originImageUrl && onHandleImageDownload(originImageUrl)}>
                                下载
                            </ImageBtn>
                        </>
                    )}
                    {imgTotal === 4 && (
                        <>
                            <ImageBtn iconNode={ReloadIcon} onClick={() => onHandleImageChange(undefined, 'REROLL')}>
                                重新生成
                            </ImageBtn>
                            <ImagePreviewBtn />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatItem;
