/**
 * 数据适配器, 团队根据自己的情况来做适配
 * 文档: https://umijs.org/zh-CN/plugins/plugin-request#errorconfigadaptor
 */
export function adaptor(resData: any) {
    console.log(resData, '执行 adaptor');
    if (resData instanceof Blob || resData instanceof ArrayBuffer) {
        return {
            resData,
            success: true
        };
    }
    if (resData.code === 200 || resData.code === 0) {
        return {
            ...resData,
            success: true
        };
    } else {
        return {
            ...resData,
            success: false,
            errorCode: resData?.code,
            errorMessage: resData?.msg
        };
    }
}
