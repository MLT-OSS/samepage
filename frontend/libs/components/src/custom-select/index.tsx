/**
 * 自定义 Select 基础组件
 *
 * 包括
 * 1. prefix 图标
 * 2. Samepage样式
 */
import { Select, SelectProps } from 'antd';
import React from 'react';
import styles from './index.module.less';
import { Loading } from '../loading';

type CustomSelectProps = SelectProps & {
    prefix: any;
};

export const CustomSelect: React.FC<CustomSelectProps> = (props) => {
    const { prefix, loading, notFoundContent, ...restSelectProps } = props;
    return (
        <div className={styles['custom-select']}>
            <span className={styles.prefix}>{prefix}</span>
            <Select
                {...restSelectProps}
                bordered={false}
                className={styles.select}
                loading={loading}
                notFoundContent={loading ? <Loading /> : notFoundContent}
            />
        </div>
    );
};
