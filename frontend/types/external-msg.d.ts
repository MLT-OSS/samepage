export declare namespace EXTERNAL_MSG {
    type IType = 'request-error'; // 业务类型，目前只有鉴权异常，划分为请求异常一大类， 之后其他的通讯业务可追加

    interface IRequestErrorData {
        code: number;
        message: string;
    }

    interface IData {
        from: string; // 消息来源
        type: IType; // 业务类型
        data: IRequestErrorData; // 暂时只有他自己
    }
}
