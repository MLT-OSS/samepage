import classNames from 'classnames';
import styles from './index.module.less';

import { CHAT_BUBBLE } from '@/types';
import { useConversationContext } from '@xm/context';
import { useModelPermission } from '@xm/hooks';
import { isH5 } from '@/utils';

import { ReactComponent as CycleIcon } from '@/assets/images/cycle.svg';
import { ReactComponent as OnlineSearchIcon } from '@/assets/images/online-search.svg';
import { ReactComponent as LogoModel } from '@/assets/images/logo-model.svg';
import Icon from '@ant-design/icons/lib/components/Icon';

type LastBubbleActionProps = Pick<
    CHAT_BUBBLE.ChatBubbleProps,
    'type' | 'message' | 'error' | 'showWebSearch' | 'webSearch' | 'onChangeAnswer' | 'onChangeSearch'
>;

export const LastBubbleAction: React.FC<LastBubbleActionProps> = (props) => {
    const { type = 'normal', message, error, showWebSearch, webSearch, onChangeAnswer, onChangeSearch } = props;
    const { conversationState } = useConversationContext();
    const { modelInfo } = conversationState;
    const { name } = modelInfo || {};

    const { changeAnswerPermission } = useModelPermission();

    return (
        <div
            className={classNames({
                [styles.h5HandleBox]: isH5,
                [styles.handleBox]: !isH5
            })}>
            {!error && changeAnswerPermission && (
                <div className={styles.changeAnswer} onClick={() => onChangeAnswer?.(message!)}>
                    <Icon component={CycleIcon} className={styles.icon} />
                    换个答案
                </div>
            )}
            {!error && showWebSearch && webSearch === 'SMART' && (
                <div
                    className={styles.onlineSearch}
                    onClick={() => onChangeSearch?.(message!, type === 'web-search' ? 'NONE' : 'FORCE')}>
                    <Icon component={type === 'web-search' ? LogoModel : OnlineSearchIcon} className={styles.icon} />
                    尝试使用{type === 'web-search' ? name + '回答' : '联网搜索'}
                </div>
            )}
        </div>
    );
};
