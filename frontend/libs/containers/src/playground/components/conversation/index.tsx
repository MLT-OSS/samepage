import React, { useEffect } from 'react';
import { Conversation as BaseConversation } from '../../../conversation';
import { useConversationContext } from '@xm/context';
import { Empty } from '@xm/components';
import { ReactComponent as EmptyIcon } from '@/assets/images/empty.svg';

import styles from './index.module.less';
interface IConversationProps {
    config?: any;
}

const Conversation = (props: IConversationProps) => {
    const {
        conversationState: { modelInfo },
        dispatch
    } = useConversationContext();
    const { config } = props;

    useEffect(() => {
        if (config) {
            dispatch({
                type: 'i_model_info',
                payload: {
                    modelInfo: {
                        ...config,
                        key: config.id
                    }
                }
            });
        }
    }, [config]);

    return (
        <div className={styles.conversation}>
            {!(config && Object.keys(config).length > 0) ? (
                // <div className={styles.emtry}>请保存左侧配置</div>
                <div className={styles.emtry}>
                    <EmptyIcon className={styles.icon}/>
                    <div>点击左侧“保存”即可预览机器人</div>
                    {/* <Empty title={<span>点击左侧“保存”即可预览机器人</span>} /> */}
                </div>
            ) : (
                <BaseConversation showPrompt={false} />
            )}
        </div>
    );
};

export default Conversation;
