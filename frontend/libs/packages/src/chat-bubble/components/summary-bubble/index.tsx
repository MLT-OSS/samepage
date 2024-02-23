import styles from './index.module.less';

import { CHAT_BUBBLE } from '@/types';
import { ReactComponent as InfoIcon } from '@/assets/images/info.svg';
import Icon from '@ant-design/icons/lib/components/Icon';

import { ConvLoading, Markdown } from '@xm/components';

type SummaryBubbleProps = Pick<
    CHAT_BUBBLE.ChatBubbleProps,
    'data' | 'summaryLoading' | 'summaryDoneStatus' | 'onClickSuggest'
>;

export const SummaryBubble: React.FC<SummaryBubbleProps> = (props) => {
    const { data, summaryLoading = false, summaryDoneStatus = false, onClickSuggest } = props;

    const isSuggestNotEmpty = !!(data as CHAT_BUBBLE.ISummary)?.suggest?.length;

    return (
        <div className={styles.summary}>
            <div className={styles.module}>
                <div className={styles.title}>文章摘要</div>
                <div className={styles.content}>
                    <Markdown data={(data as CHAT_BUBBLE.ISummary).content} />{' '}
                </div>
            </div>
            {(summaryDoneStatus || (!summaryLoading && isSuggestNotEmpty)) && (
                <div className={styles.module}>
                    <div className={styles.title}>你可能感兴趣的问题</div>
                    {summaryDoneStatus ? (
                        <ConvLoading />
                    ) : (
                        <div className={styles.qaList}>
                            {(data as CHAT_BUBBLE.ISummary).suggest?.map((i) => {
                                return (
                                    <div key={i.key} className={styles.qa} onClick={() => onClickSuggest?.(i.text)}>
                                        {i.text}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
            {!!(data as CHAT_BUBBLE.ISummary).tokenExceed && (
                <div className={styles['token-exceed']}>
                    <Icon component={InfoIcon} className={styles.icon} />
                    文本字数过多，我们将根据前面部分内容为您生成摘要和问题。
                </div>
            )}
        </div>
    );
};
