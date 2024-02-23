import { translate } from '@/utils';
import { ReactComponent as TranslateLoadingIcon } from '@/assets/images/translate-loading.svg';
import Icon from '@ant-design/icons';

const { DEFAULT_COLOR } = translate;

export const TranslateLoading = () => (
    <Icon component={TranslateLoadingIcon} style={{ color: DEFAULT_COLOR, maxWidth: '1.2em', maxHeight: '1.2em' }} />
);
