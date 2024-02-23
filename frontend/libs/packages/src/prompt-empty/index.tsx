/**
 * 提示词为空
 */
import styles from './index.module.less';
import { ReactComponent as LogoEmptyIcon } from '@/assets/images/logo-empty.svg';
import { useConversationContext } from '@xm/context';
import { isH5 } from '@/utils';

interface PromptEmptyProps {
    type?: string;
    onAddPrompts?: () => void;
    addCb?: () => void;
}
export const PromptEmpty = ({ type, onAddPrompts, addCb }: PromptEmptyProps) => {
    const {
        conversationState: { userinfo }
    } = useConversationContext();
    const { roleType } = userinfo || {};

    const onHandleBtn = () => {
        onAddPrompts?.();
        addCb?.();
    };
    const canCreat = type === 'user_custom' || (type === 'enterprise' && roleType === 'ENTERPRISE_ADMIN');

    return (
        <div className={styles['prompt-empty']}>
            <LogoEmptyIcon className={styles.logo} />
            <span className={styles.info}>
                {type === 'user_custom'
                    ? '您还没有创建过“我的提示词"～'
                    : type === 'enterprise' && roleType === 'ENTERPRISE_ADMIN'
                    ? '暂无企业提示词'
                    : type === 'enterprise'
                    ? '暂无企业提示词，请联系管理员创建'
                    : '暂无提示词'}
            </span>
            {canCreat && isH5 && <span className={styles.info}>请前往电脑端创建</span>}
            {canCreat && !isH5 && (
                <span className={styles.action} onClick={onHandleBtn}>
                    点此创建
                </span>
            )}
        </div>
    );
};
