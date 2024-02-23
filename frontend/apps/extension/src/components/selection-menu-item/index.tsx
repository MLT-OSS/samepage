import React from 'react';
import { ISelectionItem } from '@/types';
import logo from '@/assets/images/logo/logo-dark-blue.png';
import styles from './index.module.less';
import classNames from 'classnames';

interface SelectionMenuItemProps {
    first?: boolean;
    data: ISelectionItem;
    onClick: (key: string) => any;
}

const SelectionMenuItem: React.FC<SelectionMenuItemProps> = (props) => {
    const { first = false, data } = props;
    const { key, title, icon } = data;

    return (
        <button
            key={key}
            className={classNames(styles.actionItem, { [styles.first]: first })}
            onClick={() => props.onClick(key)}>
            {first && <img src={logo} className={styles.logo} />}
            {React.cloneElement(icon, { className: styles.icon })}
            {title}
        </button>
    );
};

export default SelectionMenuItem;
