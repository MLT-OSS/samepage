import styles from './index.module.less';
import { ReactComponent as ServiceIcon } from '@/assets/images/service.svg';
import Icon from '@ant-design/icons';

interface CorpContactProps {
    style?: React.CSSProperties;
}

export const CorpContact: React.FC<CorpContactProps> = (props) => {
    const { style = {} } = props;
    return (
        <div className={styles.contact} style={style}>
            <Icon component={ServiceIcon} style={{ marginRight: '4px' }} />
            您可以联系您的销售人员开通企业账户
        </div>
    );
};
