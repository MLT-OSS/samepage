/**
 * 历史参数弹窗
 */
import { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import useRequest from '@ahooksjs/use-request';
import styles from './index.module.less';

import services from '@xm/services';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { ReactComponent as CopyIcon } from '@/assets/images/copy-param.svg';
import { ReactComponent as DeleteIcon } from '@/assets/images/delete.svg';
import { GetBotTemplateKeyParamsResponse } from '@/ytt-type/robot';
import { Loading, DeleteModal } from '@xm/components';
import { isH5 } from '@/utils';
import classnames from 'classnames';

interface IParamHistoryProps {
    botKey: string;
    open: boolean;
    onClose: () => void;
    backFill: (item: any) => void;
}

export const TemplateParamsHistoryLog = (props: IParamHistoryProps) => {
    const { botKey, backFill, open, onClose } = props;

    const [historyList, setHistoryList] = useState<GetBotTemplateKeyParamsResponse>([]);
    const [isShowDelete, setIsShowDelete] = useState<boolean>(false);
    const [deleteKey, setDeleteKey] = useState<string>('');
    const deleteModalRef = useRef(null);

    // 获取历史参数记录
    const { run: getParamsHistory, loading } = useRequest(services.params.getParamsHistory, {
        manual: true,
        onSuccess: (res: GetBotTemplateKeyParamsResponse) => {
            setHistoryList(res);
        }
    });

    // 删除某条历史记录
    const { run: delParams } = useRequest(services.params.delParams, {
        manual: true,
        onSuccess: () => {
            closeDeleteLoading();
            OnOkCallback();
        },
        onError: () => {
            closeDeleteLoading();
        }
    });

    const closeDeleteLoading = () => {
        const { _closeLoading } = deleteModalRef?.current || {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            _closeLoading: () => {}
        };
        _closeLoading();
    };

    // 初始化请求列表数据
    useEffect(() => {
        if (open) {
            getParamsHistory({ key: botKey });
        }
    }, [open]);

    const sendConverdation = (item: any) => {
        backFill(item);
        onClose();
    };

    const handleDelete = (id: string) => {
        setDeleteKey(id);
        setIsShowDelete(true);
    };

    const OnCancel = () => {
        setIsShowDelete(false);
    };

    const OnOk = () => {
        delParams({
            key: botKey,
            id: deleteKey
        });
    };

    const OnOkCallback = () => {
        // 删除接口调用成功之后更新本地列表
        const newList: GetBotTemplateKeyParamsResponse = [];
        historyList.forEach((item) => {
            if (item.id !== deleteKey) {
                newList.push(item);
            }
        });
        setHistoryList(newList);
        OnCancel();
    };

    return (
        <>
            <Modal
                className={styles['param-history-modal']}
                centered
                width={400}
                title={<span className={styles.title}>历史参数</span>}
                open={open}
                destroyOnClose={true}
                closeIcon={<CloseIcon />}
                footer={null}
                onCancel={onClose}
                bodyStyle={{ height: 'calc(100% - 57px)' }}>
                <div className={styles['history-list-con']}>
                    {loading ? (
                        <div className={styles.noData}>
                            <Loading />
                        </div>
                    ) : historyList.length > 0 ? (
                        historyList?.map((item: any) => {
                            const { updateTime, id, params } = item;
                            return (
                                <div key={id} className={styles['list-item']} onClick={() => sendConverdation(item)}>
                                    <div className={classnames(styles.head, { [styles.h5Head]: isH5 })}>
                                        <p className={styles.time}>{updateTime || '-'}</p>
                                        <CopyIcon onClick={() => sendConverdation(item)} className={styles.icon} />
                                        <DeleteIcon
                                            onClick={(e: any) => {
                                                e.stopPropagation();
                                                handleDelete(id);
                                            }}
                                            className={styles.icon}
                                        />
                                    </div>
                                    {params?.map((paramItem: any) => {
                                        const { key, value, name } = paramItem;
                                        return (
                                            <p key={key} className={styles.info}>
                                                {name}：{value ? value : '-'}
                                            </p>
                                        );
                                    })}
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.noData}>暂无数据</div>
                    )}
                </div>
            </Modal>
            <DeleteModal
                ref={deleteModalRef}
                open={isShowDelete}
                content={'是否删除该历史参数记录？删除后不可恢复'}
                onCancel={OnCancel}
                onOk={OnOk}
            />
        </>
    );
};
