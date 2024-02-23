import { Outlet } from 'react-router-dom';
import { useConversationContext } from '@xm/context';
import { UnsupportVersionPopup, MainHeader } from '@xm/packages';
import { isExtension } from '@/utils';
import { ErrorBoundary } from '@xm/components';

export const MainLayout = () => {
    const {
        conversationState: { layoutVersionInfoPopupShow, mainLayoutKey }
    } = useConversationContext();

    return (
        <div className="_ml_xm_layout" key={mainLayoutKey}>
            <ErrorBoundary>
                <MainHeader />
                <div className="_ml_xm_body">
                    <Outlet />
                </div>
                {isExtension && !!layoutVersionInfoPopupShow && <UnsupportVersionPopup />}
            </ErrorBoundary>
        </div>
    );
};
