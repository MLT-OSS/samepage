import Icon from '@ant-design/icons';
import { ReactComponent as LoadingIcon } from '@/assets/images/loading.svg';

import styles from './index.module.less';

interface IImageProgressProps {
    text?: React.ReactNode;
    progress?: string;
}
export const ImageProgress = (props: IImageProgressProps) => {
    const { text, progress } = props;
    return text || progress ? (
        <div className={styles['image-progress']}>
            <Icon component={LoadingIcon} className={styles.icon} />
            {text}
            {progress ? `（${progress}）` : ''}
        </div>
    ) : (
        <></>
    );
};
