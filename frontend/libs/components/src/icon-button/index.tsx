import { Tooltip } from 'antd';

import styles from './index.module.less';

interface IIconButtonProps {
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

export const IconButton = (
    props: IIconButtonProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
    const { icon, children, className, ...others } = props;
    return (
        <div className={[styles.iconButton, className].join(' ')} {...others}>
            <Tooltip title={children}>
                <div className={styles.icon}>{icon}</div>
            </Tooltip>
        </div>
    );
};
