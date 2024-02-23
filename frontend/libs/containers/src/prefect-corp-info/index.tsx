import { Radio, RadioGroupProps } from 'antd';
import styles from './index.module.less';
import { useCallback, useState } from 'react';
import { CorpMarker, JoinCorp, RegisterCorp } from '@xm/packages';
import { navigateToChat } from '@/utils';

type REGISTER_TYPE = 'CODE' | 'NO_CODE';
const REGISTER_TYPE_OPTIONS: { label: string; value: REGISTER_TYPE }[] = [
    { label: '无邀请码', value: 'NO_CODE' },
    { label: '有邀请码', value: 'CODE' }
];

export const PrefectCorpInfo = () => {
    // 初始化为 无邀请码
    const [type, setType] = useState<REGISTER_TYPE>('NO_CODE');
    const onTypeChange: RadioGroupProps['onChange'] = useCallback(
        (e: any) => {
            setType(e.target.value);
        },
        [setType]
    );

    const jumpToApp = () => {
        navigateToChat();
    };

    return (
        <div className={styles.prefectCorpInfo}>
            <CorpMarker />
            <div className={styles.typeSelect}>
                <Radio.Group value={type} onChange={onTypeChange} options={REGISTER_TYPE_OPTIONS} />
            </div>

            {type === 'CODE' && <JoinCorp />}
            {type === 'NO_CODE' && <RegisterCorp finishCb={jumpToApp} />}

            <div className={styles.footer}>
                <span className={styles.link} onClick={jumpToApp}>
                    暂不注册企业版，跳过
                </span>
            </div>
        </div>
    );
};
