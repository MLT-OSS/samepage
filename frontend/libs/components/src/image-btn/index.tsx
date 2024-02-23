import { Button } from 'antd';
import Icon from '@ant-design/icons';

import type { ButtonProps } from 'antd';
import type { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

import styles from './index.module.less';

interface IImageBtnProps extends ButtonProps {
    iconNode?: IconComponentProps['component'];
    children?: React.ReactNode;
}

export const ImageBtn = (props: IImageBtnProps) => {
    const { iconNode, children, ...buttonProps } = props;
    return (
        <div className={styles['image-btn']}>
            <Button className={styles.btn} {...buttonProps}>
                {iconNode && <Icon component={iconNode} className={styles.icon} />}
                {children}
            </Button>
        </div>
    );
};
