/**
 * header 上的关闭按钮
 */
import Icon from '@ant-design/icons';
import { ReactComponent as CloseIcon } from '@/assets/images/close.svg';
import { isExtension, eventEmitter, EventType } from '@/utils';
import { EVENT_CLOSE_EXTENSION } from '@/constants';

export const HeaderCloseBtn = () => {
    if (!isExtension) {
        return null;
    }

    const onClose = () => {
        eventEmitter.dispatch(EventType.CLOSE_EXTENSION, EVENT_CLOSE_EXTENSION, {
            type: EVENT_CLOSE_EXTENSION,
            data: {
                value: false
            }
        });
    };

    return <Icon component={CloseIcon} className="_ml_xm_close_icon" onClick={onClose} />;
};
