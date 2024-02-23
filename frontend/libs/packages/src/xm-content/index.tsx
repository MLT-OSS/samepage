import { XmButton } from '@xm/components';

import styles from './index.module.less';

/* eslint-disable-next-line */
export interface XmContentProps {}

export function XmContent(props: XmContentProps) {
    return (
        <div className={styles['container']}>
            <div>Welcome to XmContent!</div>
            <XmButton />
        </div>
    );
}

export default XmContent;
