/**
 * 顶部模型介绍卡片
 * 1. 多轮对话：有背景色
 * 2. 单轮对话 + midjourney: 无背景色（背景色为白色）
 */
import { CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './index.module.less';

import { useConversationContext } from '@xm/context';
import { ReactComponent as FixedIcon } from '@/assets/images/fixed.svg';
import { ReactComponent as UnFixedIcon } from '@/assets/images/unfixed.svg';
import { useFixed } from '@xm/hooks';
import { isEmpty, omit } from 'lodash-es';

interface ICardProps {
    className?: string;
    style?: CSSProperties;
    showFiexd?: boolean;
}

export const RobotInfoCard: React.FC<ICardProps> = (props) => {
    const { showFiexd = true } = props;
    const { conversationState } = useConversationContext();
    const { modelInfo, sidebarListSet } = conversationState;

    const { iconUrl, icon, system, desc, name, key, type } = modelInfo || {};
    const fixed = sidebarListSet?.has(key as string);

    const { handleFixed } = useFixed();

    // 固定机器人
    const handleOnFix = (fixed: string) => {
        handleFixed({
            fixed,
            key: key!
        });
    };

    if (isEmpty(omit(modelInfo || {}, 'feFeature'))) {
        return null;
    }
    return (
        <div
            className={classNames(styles.robotInfoCard, props.className, {
                [styles.bgHasColor]: ['assistant_chat', 'chat'].includes(type!)
            })}
            style={props.style}>
            <img className={styles['robot-icon']} src={iconUrl || icon} />
            <div className={styles['robot-con']}>
                <h3 className={styles['title']}>{name}</h3>
                <p className={styles['desc']}>{desc}</p>
            </div>
            <div className={styles['fix-box']}>
                {/* 系统类型的模型没有固定和取消固定展示 */}
                {showFiexd && (
                    <>
                        {fixed && !system ? (
                            <FixedIcon onClick={() => handleOnFix('false')} className={styles['fix-icon']} />
                        ) : !system ? (
                            <UnFixedIcon onClick={() => handleOnFix('true')} className={styles['fix-icon']} />
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
};
