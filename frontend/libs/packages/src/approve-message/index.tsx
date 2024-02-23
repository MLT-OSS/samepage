import { Badge } from 'antd';
import { ReactComponent as CorpIcon } from '@/assets/images/corp-outline.svg';
import Icon from '@ant-design/icons';
import styles from './index.module.less';
import { useConversationContext } from '@xm/context';
import { useUserInfo } from '@xm/hooks';
import { CTM_APPROVE_URL } from '@/utils';

export const ApproveMessage = () => {
    const { conversationState } = useConversationContext();
    const { userSetting } = conversationState || {};

    const { isCorpAdmin } = useUserInfo();

    const jumpToBe = () => {
        window.open(CTM_APPROVE_URL, '_blank');
    };

    if (!isCorpAdmin) {
        return null;
    }
    const messageCount = userSetting?.pendingAuditNum ?? 0;
    return (
        <Badge count={messageCount} className={styles.approveMessage}>
            <div className={styles.innerBox} onClick={jumpToBe}>
                <Icon component={CorpIcon} className={styles.icon} />
            </div>
        </Badge>
    );
};
