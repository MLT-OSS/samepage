/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 * header 上的企业标签
 */
import { ReactComponent as DiamondIcon } from '@/assets/images/diamond.svg';
import styles from './index.module.less';
import { useConversationContext } from '@xm/context';
import classNames from 'classnames';
import { useUserInfo } from '@xm/hooks';
import { onPrefectCorpInfo } from '@/utils';

export const CorpTag = () => {
    const { dispatch } = useConversationContext();
    const { isCorpUser } = useUserInfo();

    return (
        <span
            className={classNames(styles.corpTag, { [styles.corp]: isCorpUser })}
            onClick={() => {
                if (isCorpUser) {
                    return;
                }
                onPrefectCorpInfo();
            }}>
            <DiamondIcon className={styles.icon} />
            {isCorpUser ? '企业VIP' : '开通企业账号'}
        </span>
    );
};
