import { useEffect, useState, useRef } from 'react';
import { Drawer, Input, Empty } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash-es';
import useRequest from '@ahooksjs/use-request';
import services from '@xm/services';
import { IconWapper, Loading } from '@xm/components';
import { ReactComponent as LogoIcon } from '@/assets/images/logo.svg';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { ReactComponent as SearchIcon } from '@/assets/images/search.svg';

import { HistoryLogItem } from '../history-log-item';
import { HistoryDeleteModal } from '../history-delete-modal';
import { HistoryUpdateModal } from '../history-update-modal';

import styles from './index.module.less';

import type { HISTORY_LOG } from '@/types';
import type { InputProps } from 'antd';
import Icon from '@ant-design/icons';

const PAGE_SIZE = 10;
interface IHistoryLogProps {
    docId?: string; // for doc-chat
    conversationId?: string;
    model?: string;
    open?: boolean;
    onClose?: () => void;
    onItemClick?: (data: HISTORY_LOG.Item) => any;
    isUrlClick?: boolean;
    getWebDocUrl?: ({ docId, conversationId }: { docId?: string; conversationId?: string }) => Promise<string>;
}

export const HistoryLog = (props: IHistoryLogProps) => {
    const { open, onClose, model, conversationId, docId, onItemClick, isUrlClick = true } = props;

    const scrollDivRef = useRef<HTMLDivElement>(null);

    const [data, setData] = useState<HISTORY_LOG.Item[]>([]);
    const [showMore, setShowMore] = useState(true);
    const [pageNo, setPageNo] = useState(1);

    const [searchValue, setSearchValue] = useState('');

    const [isDeleteShow, setIsDeleteShow] = useState(false);
    const [isUpdateShow, setIsUpdateShow] = useState(false);
    const [shouldDeleteItem, setShouldDeleteItem] = useState<HISTORY_LOG.Item>();
    const [shouldEditItem, setShouldEditItem] = useState<HISTORY_LOG.Item>();

    const { run: getHistory } = useRequest(services.conversation.getHistory, {
        manual: true,
        onSuccess: (res: HISTORY_LOG.IListRes) => {
            const { records, total, pageNo, size, otherTotal } = res;
            if (otherTotal >= total) {
                setShowMore(false);
            } else {
                setShowMore(true);
            }
            setPageNo(pageNo + 1);
            setData([...data, ...records]);
        }
    });

    const getDatas = async (pageNo: number, pageSize?: number, keyword?: string) => {
        if (model) {
            getHistory({
                key: model,
                currentId: conversationId,
                keyword: keyword ? keyword : undefined,
                pageNo: String(pageNo),
                pageSize: String(pageSize || 10),
                docId
            });
        }
    };

    const reset = (isSearch?: boolean) => {
        setData([]);
        setShowMore(true);
        setPageNo(1);
        if (!isSearch) {
            setSearchValue('');
        }
    };

    const reload = () => {
        reset();
        setTimeout(() => {
            getDatas(1, PAGE_SIZE);
        }, 0);
    };

    const handleOnEidt = (item: HISTORY_LOG.Item) => {
        setIsUpdateShow(true);
        setShouldEditItem(item);
    };

    const handleOnDelete = (item: HISTORY_LOG.Item) => {
        setIsDeleteShow(true);
        setShouldDeleteItem(item);
    };

    const handleOnSearch: InputProps['onChange'] = (e) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { value } = e?.target;
        setSearchValue(value);
    };

    const handleOnItemClick = (item: HISTORY_LOG.Item) => {
        onItemClick?.(item);
    };

    useEffect(() => {
        if (open) {
            getDatas(1, PAGE_SIZE);
        } else {
            reset();
        }
    }, [open]);

    const deplayedSearch = debounce((text: string) => {
        setData([]);
        setShowMore(true);
        setPageNo(1);
        setTimeout(() => {
            getDatas(1, PAGE_SIZE, text);
        }, 0);
    }, 500);

    useEffect(() => {
        if (open) {
            deplayedSearch((searchValue || '').trim());
        }
    }, [searchValue]);

    return (
        <div>
            <Drawer
                className={styles['history-log-drawer']}
                title={<span className={styles['drawer-title']}>会话历史记录</span>}
                placement={'bottom'}
                closable={false}
                closeIcon={<CloseIcon />}
                onClose={onClose}
                open={open}
                extra={
                    <IconWapper>
                        <Icon component={CloseIcon} onClick={onClose} />
                    </IconWapper>
                }
                height={'auto'}
                contentWrapperStyle={{
                    height: '80%',
                    maxHeight: '960px',
                    borderRadius: '20px 20px 0px 0px'
                }}
                headerStyle={{
                    textAlign: 'center',
                    color: 'rgba(0, 0, 0, 0.75)',
                    fontWeight: 600,
                    border: 0
                }}
                bodyStyle={{
                    padding: 0,
                    overflow: 'hidden'
                }}
                getContainer={false}>
                <div className={styles.search}>
                    <Input
                        value={searchValue}
                        size="middle"
                        placeholder="搜索会话标题"
                        prefix={<SearchIcon className={styles['icon-size']} />}
                        onChange={handleOnSearch}
                    />
                </div>
                <div id="__xm_history_log_scrollable_div__" ref={scrollDivRef} className={styles['scroll-wapper']}>
                    {!(data?.length > 0) && !showMore ? (
                        <div className={styles['empty-wapper']}>
                            <Empty
                                className={styles.empty}
                                image={<LogoIcon />}
                                imageStyle={{ height: 60 }}
                                description={`没有会话历史记录`}
                            />
                        </div>
                    ) : (
                        <InfiniteScroll
                            scrollableTarget={scrollDivRef?.current as any}
                            height={'100%'}
                            dataLength={data.length}
                            next={() => getDatas(pageNo, PAGE_SIZE, searchValue)}
                            hasMore={showMore}
                            loader={
                                <div style={{ textAlign: 'center' }}>
                                    <Loading />
                                </div>
                            }
                            endMessage={<div className={styles.nothing}>没有更多了</div>}>
                            {data.map((item, index) => (
                                <div
                                    key={item.conversationId}
                                    onClick={() => {
                                        if (item?.conversationId === conversationId) {
                                            onClose?.();
                                            return;
                                        }
                                        handleOnItemClick(item);
                                    }}>
                                    <HistoryLogItem
                                        currentId={conversationId}
                                        data={item}
                                        onDelete={handleOnDelete}
                                        onEdit={handleOnEidt}
                                        getWebDocUrl={props.getWebDocUrl}
                                        isUrlClick={isUrlClick}
                                    />
                                </div>
                            ))}
                        </InfiniteScroll>
                    )}
                </div>
            </Drawer>
            <HistoryDeleteModal
                data={shouldDeleteItem}
                open={isDeleteShow}
                onCancel={() => {
                    setShouldDeleteItem(undefined);
                    setIsDeleteShow(false);
                }}
                onOk={() => {
                    reload();
                    setShouldDeleteItem(undefined);
                    setIsDeleteShow(false);
                }}
            />
            <HistoryUpdateModal
                data={shouldEditItem}
                open={isUpdateShow}
                onCancel={() => {
                    setShouldEditItem(undefined);
                    setIsUpdateShow(false);
                }}
                onOk={() => {
                    reload();
                    setShouldEditItem(undefined);
                    setIsUpdateShow(false);
                }}
            />
        </div>
    );
};
