import { ReactNode } from 'react';
import { ReactComponent as Icon403 } from '@/assets/images/403.svg';
import { ReactComponent as Icon404 } from '@/assets/images/404.svg';
import styles from './index.module.less';

interface ResultPageProps {
    type: '403' | '404';
    text?: string;
    children?: ReactNode;
}

const DEFAULT_404_TEXT = '页面不存在';
const DEFAULT_403_TEXT = '用户无权限，请联系管理员';

export const ResultPage: React.FC<ResultPageProps> = (props) => {
    const { type, text } = props;
    const defaultText = type === '404' ? DEFAULT_404_TEXT : DEFAULT_403_TEXT;
    const Icon = type === '404' ? Icon404 : Icon403;

    return (
        <div className={styles.resultPage}>
            <Icon className={styles.img} />
            <div className={styles.text}>{text ?? defaultText}</div>
            <div className={styles.children}>{props.children}</div>
        </div>
    );
};
