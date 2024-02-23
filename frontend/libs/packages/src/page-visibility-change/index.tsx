/**
 * 页面可见性的组件 需要包在 context 组件内部
 */
import { useEffect } from 'react';
import { useConversationContext } from '@xm/context';

import styles from './index.module.less';

export const PageVisibilityChange = () => {
    const { dispatch } = useConversationContext();
    /**
     * 页面可见性设置
     */
    useEffect(() => {
        const pageVisibilityChange = () => {
            console.log(document.visibilityState, 'pageVisibilityChange');
            dispatch({
                type: 'p_all_visibility_state',
                payload: {
                    allVisibilityState: document.visibilityState
                }
            });
        };

        document.addEventListener('visibilitychange', pageVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', pageVisibilityChange);
        };
    }, []);
    return <></>;
};
