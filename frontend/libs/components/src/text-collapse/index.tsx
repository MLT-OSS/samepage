import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash-es';
import Icon from '@ant-design/icons';

import { ReactComponent as DownArrowIcon } from '@/assets/images/down-arrow.svg';

import styles from './index.module.less';

/**
 * TODO: 可能有更好的方案
 * 使用影子节点的方式实现，所有使用该组件的位置渲染了两个组件，对性能有损耗
 */

interface ITextCollapseProps {
    children?: React.ReactNode;
}

export const TextCollapse = (props: ITextCollapseProps) => {
    const referRef = useRef<HTMLDivElement>(null);
    const originRef = useRef<HTMLDivElement>(null);

    const [isShowOption, setIsShowOption] = useState(false);
    const [isCollapse, setIsCollapse] = useState(true);

    useEffect(() => {
        if (isCollapse) {
            const refHeight = referRef?.current?.clientHeight;
            const oriHeight = originRef?.current?.clientHeight;
            if (refHeight && oriHeight && oriHeight > refHeight) {
                setIsShowOption(true);
            }
        }
    }, [referRef?.current, originRef?.current, isCollapse]);

    useEffect(() => {
        const handleResize = () => {
            const refHeight = referRef?.current?.clientHeight;
            const oriHeight = originRef?.current?.clientHeight;
            if (refHeight && oriHeight && oriHeight > refHeight) {
                setIsShowOption(true);
            } else {
                setIsShowOption(false);
            }
        };

        const debounceHandleResize = debounce(handleResize, 500);
        window.addEventListener('resize', debounceHandleResize);
        return () => {
            window.removeEventListener('resize', debounceHandleResize);
        };
    }, []);

    return (
        <div className={styles['text-collapse']}>
            <div ref={originRef} className={styles.refer}>
                {props?.children}
            </div>
            <div ref={referRef} className={[styles.refer, styles.collapse].join(' ')}>
                {props?.children}
            </div>
            <div className={isCollapse ? styles.collapse : ''}>{props?.children}</div>
            {isShowOption && (
                <div className={styles.option}>
                    <Icon
                        className={[styles.icon, isCollapse ? '' : styles.a].join(' ')}
                        component={DownArrowIcon}
                        onClick={() => setIsCollapse(!isCollapse)}
                    />
                </div>
            )}
        </div>
    );
};
