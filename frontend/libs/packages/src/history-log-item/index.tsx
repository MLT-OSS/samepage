import { ReactComponent as EditIcon } from '@/assets/images/edit.svg';
import { ReactComponent as DeleteIcon } from '@/assets/images/delete.svg';
import { ReactComponent as PdfIcon } from '@/assets/images/pdf.svg';
import Icon from '@ant-design/icons/lib/components/Icon';

import styles from './index.module.less';

import type { HISTORY_LOG } from '@/types';

const YEAR = 365 * 24 * 60;
const DAY = 24 * 60;
const HOUR = 60;
const MINUTE = 1;

const TIME_CONFIGS = [
    {
        key: 'year',
        count: YEAR,
        unit: '年'
    },
    {
        key: 'day',
        count: DAY,
        unit: '天'
    },
    {
        key: 'hour',
        count: HOUR,
        unit: '小时'
    },
    {
        key: 'minute',
        count: MINUTE,
        unit: '分钟'
    }
];

const getTimes = (time?: number | string) => {
    if (time !== null && time !== undefined) {
        let _time = typeof time === 'number' ? time : Number.parseInt(time, 10);
        if (_time === 0) {
            return '刚刚';
        }
        if (_time < 0) {
            _time = _time * -1;
        }
        for (const { count, unit } of TIME_CONFIGS) {
            if (_time >= count) {
                return `${Math.floor(_time / count)}${unit}前`;
            }
        }
    }
    return '';
};
interface IHistoryLogItemProps {
    currentId?: string;
    data: HISTORY_LOG.Item;
    onDelete?: (item: HISTORY_LOG.Item) => void;
    onEdit?: (item: HISTORY_LOG.Item) => void;
    isUrlClick?: boolean;
    getWebDocUrl?: ({ docId, conversationId }: { docId?: string; conversationId?: string }) => Promise<string>;
}
export const HistoryLogItem = (props: IHistoryLogItemProps) => {
    const { data, onDelete, onEdit, currentId, isUrlClick = true } = props;

    console.log(isUrlClick, onDelete, onEdit, 'isUrlClick');

    const handleOnEdit = (e: any) => {
        e.stopPropagation();
        onEdit?.(data);
    };

    const handleOnDelete = (e: any) => {
        e.stopPropagation();
        onDelete?.(data);
    };

    const isDoc = data?.conversationType === 'DOC';
    return (
        <div className={styles['history-log-item']}>
            <div className={styles.header}>
                <div className={styles['title-wapper']}>
                    {currentId === data?.conversationId && <div className={styles.tag}>当前</div>}
                    <div className={styles.title}>{data?.title}</div>
                    {isUrlClick && (
                        <div className={styles.edit} onClick={handleOnEdit}>
                            <EditIcon className={styles['icon-size']} />
                        </div>
                    )}
                </div>
                <div className={styles.time}>{getTimes(data?.intervalMinute)}</div>
            </div>
            <div className={styles.desc}>{data?.description}</div>
            <div className={styles.footer}>
                {isDoc ? (
                    <div
                        className={styles.fileName}
                        onClick={async (e) => {
                            e.stopPropagation();
                            const path = await props.getWebDocUrl?.({
                                docId: data.docId!,
                                conversationId: data.conversationId
                            });
                            window.open(path, '_blank');
                        }}>
                        <Icon component={PdfIcon} className={styles.icon} />
                        <span className={styles.text}>{data?.name}</span>
                    </div>
                ) : (
                    <div className={styles.url} onClick={(e) => isUrlClick && e.stopPropagation()}>
                        <a target="_blank" href={isUrlClick ? data?.webUrl : undefined}>
                            {data?.webUrl}
                        </a>
                    </div>
                )}
                {currentId !== data?.conversationId && isUrlClick && (
                    <div className={styles.delete}>
                        <DeleteIcon className={styles['icon-size']} onClick={handleOnDelete} />
                    </div>
                )}
            </div>
        </div>
    );
};
