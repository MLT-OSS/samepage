export declare namespace IMAGE_CONVERSATION {
    // 图像权重
    type IImageWeight = number;

    // 生成图片配置
    interface IImageSetting {
        chaos: number;
        stylize: number;
        negative: string;
        seed: string;
        negativeOriginal: string;
    }

    // 所有该图片生成的配置
    interface IParamsConfig extends IImageSetting {
        imageWeight?: IImageWeight;
    }

    interface IUpdateSettingReq extends Partial<IParamsConfig> {}

    interface IImageData {
        status?: string; // 状态：NOT_START（未开始）,SUBMITTED（已提交）,IN_PROGRESS（处理中）,FAILURE（失败）,SUCCESS（成功）
        imageUrl?: string; // 缩略图
        originImageUrl?: string; // 原始图片
        prompt?: string;
        refImageUrl?: string;
        action?: string; // 操作：UPSCALE（放大），VARIATION（变体）, REROLL（重新生成）
        position?: string; // 序号(1~4)
        options?: number; // 图片选项数量 1,4
        originInput?: string; // 原始输入
        failReason?: string; // 失败原因
        refImageKey?: string; // 参考图片的key
    }

    interface IImageReq {
        messageId: string;
    }
    interface IImageDelReq extends IImageReq {
        index: number;
    }

    // 获取单条消息
    interface IImageRes extends IImageData {
        progress: string; // 百分比进度
    }

    interface IImageHistoryReq {
        pageNo: number;
        pageSize: number;
        __xmMark?: string;
        _fe_show_message_error?: boolean;
    }

    // 历史消息
    interface IImageHistoryItem extends IImageData {
        messageId: string;
        paramConfig?: IParamsConfig;
    }

    interface IImageHistoryRes {
        total: number;
        records: IImageHistoryItem[];
        size: number;
    }

    interface IImageAddReq {
        msg: string;
        image?: string;
        imageWeight?: number;
    }

    interface IImageChangeReq {
        messageId: string;
        position?: number;
        action: string; // 操作：UPSCALE（放大），VARIATION（变体）, REROLL（重新生成）
    }
}
