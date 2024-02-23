import { useConversationContext } from '@xm/context';
import { ReactComponent as UserIcon } from '@/common/assets/images/h5/user.svg';
import { Badge } from 'antd';

interface H5HeaderUserProps {
    onClick?: () => void;
}

export const H5HeaderUser = (props: H5HeaderUserProps) => {
    const { conversationState } = useConversationContext();
    const { userSetting } = conversationState;

    const approveMsgCount = userSetting?.pendingAuditNum ?? 0;
    return (
        <Badge count={approveMsgCount}>
            <UserIcon onClick={props.onClick} />
        </Badge>
    );
};
