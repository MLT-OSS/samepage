import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { setPageOpenTime } from '@/utils';
import { GlobalWapper } from '../../global-wapper';

import styles from './index.module.less';

export const ExtAppLayout = () => {
    useEffect(() => {
        setPageOpenTime();
    }, []);
    return (
        <div className={styles.extAppLayout}>
            <GlobalWapper>
                <Outlet />
            </GlobalWapper>
        </div>
    );
};
