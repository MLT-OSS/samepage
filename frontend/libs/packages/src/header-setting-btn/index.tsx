import { IconButton } from '@xm/components';
import { useConversationContext } from '@xm/context';
import { ReactComponent as SettingIcon } from '@/assets/images/setting.svg';

import styles from './index.module.less';

export const HeaderSettingBtn = () => {
  const {
      dispatch
  } = useConversationContext();
    const onHandleClick = () => {
        dispatch({ type: 'p_pre_setting_show', payload: { preSettingShow: true } });
    };
    return (
        <div className={styles.headerSettingBtn}>
            <IconButton icon={<SettingIcon />} onClick={onHandleClick} />
        </div>
    );
};
