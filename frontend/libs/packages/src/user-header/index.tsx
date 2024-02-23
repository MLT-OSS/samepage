/**
 * user-layout 里面的 header
 */
import { isExtension } from '@/utils';
import { HeaderCloseBtn } from '../header-close-btn';

export const UserHeader = () => {
    if (!isExtension) {
        return null;
    }

    return (
        <div className="_ml_xm_header only_close">
            <HeaderCloseBtn />
        </div>
    );
};
