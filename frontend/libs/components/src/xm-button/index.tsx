import { Button } from 'antd';

import styles from './index.module.less';

import type { ButtonProps } from 'antd';

/* eslint-disable-next-line */
export interface XmButtonProps extends ButtonProps {}

export function XmButton(props: XmButtonProps) {
    const onHandleClick = () => {
        console.log('点击XmAntdButton按钮！！！');
    };
    return (
        <div className={styles['container']}>
            <Button onClick={onHandleClick}>XmAntdButton按钮</Button>
        </div>
    );
}

export default XmButton;
