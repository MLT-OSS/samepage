import styles from './index.module.less';
import { ReactComponent as LoadingIcon } from '@/assets/images/loading.svg';
import Icon from '@ant-design/icons';
import classNames from 'classnames';
import { CSSProperties } from 'react';

interface LoadingIconProps {
    style?: CSSProperties;
    className?: string;
}

export const Loading: React.FC<LoadingIconProps> = ({ style, className }) => (
    <Icon component={LoadingIcon} className={classNames(styles.icon, className)} style={style} />
);
