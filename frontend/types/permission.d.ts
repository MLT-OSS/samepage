export declare namespace PERMISSION {
    interface IReadDoc {
        entry?: boolean; // 是否展示入口
        docLink?: { show: boolean }; // 是否展示引导链接
        summaryGuide?: boolean; // 是否展示 summary 下面的跳转按钮
    }

    interface IPrompt {
        show?: boolean;
        add?: boolean; // 添加, for h5
    }

    interface IConv {
        modelCard?: boolean; // 模型卡片
    }

    type IChatConv = IConv & {
        welcome?: boolean; // 欢迎语
        guide?: boolean; // 引导词
        prompt?: boolean | IPrompt; // 提示词
        selection?: boolean; // 文本选择
        readArticle?: boolean; // 阅读文章
        readDoc?: false | IReadDocPermission; // 阅读全文
    };

    type IStatelessChatConv = IConv & {};

    interface IDrawConv {}

    interface ApiFeatConfigItem {
        feature: string;
        [k: string]: any;
    }

    type ApiFeatConfig = ApiFeatConfigItem[];
}
