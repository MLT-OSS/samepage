import { useConversationContext } from '@xm/context';
import styles from './index.module.less';
import { ReactComponent as LogoIcon } from '@/assets/images/logo-2.svg';
import { SUPPORT_PLATFORM, UNSUPPORT_PLATFORM } from '@xm/permission';

export const UnsupportConv = () => {
    const {
        conversationState: { modelInfo }
    } = useConversationContext();

    return (
        <div className={styles.container}>
            <div className={styles.modelInfo}>
                <img src={modelInfo?.iconUrl} className={styles.icon} />
                <div className={styles.title}>{modelInfo?.name}</div>
            </div>
            <div className={styles.content}>
                <LogoIcon className={styles.logo} />
                <div className={styles.text}>
                    {UNSUPPORT_PLATFORM}正在开发中，
                    <br />
                    请前往{SUPPORT_PLATFORM}进行体验～
                </div>
            </div>
        </div>
    );
};
