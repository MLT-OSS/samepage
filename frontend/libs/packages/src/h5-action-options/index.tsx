import { Dropdown, Button } from 'antd';

import styles from './index.module.less';

import type { MenuProps } from 'antd';

interface IH5ActionOptionsProps {
    style?: React.CSSProperties;
    items: MenuProps['items'];
    children?: React.ReactNode;
}

export const H5ActionOptions = (props: IH5ActionOptionsProps) => {
    const { items, style } = props;
    return (
        <div className={styles.h5ActionOptions} style={{ ...style }}>
            <Dropdown
                // 防止动画使内部元素抖动
                transitionName=""
                overlayClassName={styles.h5ActionOptionsDropdown}
                menu={{ items }}
                autoAdjustOverflow={false}
                placement="topLeft"
                align={{
                    targetOffset: [0, 0],
                    offset: [0, -22]
                }}>
                {props?.children}
            </Dropdown>
        </div>
    );
};
