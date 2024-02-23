import { Outlet } from 'react-router-dom';
import { MainHeader } from '@xm/packages';
import { ErrorBoundary } from '@xm/components';

export const PlaygroundLayout = () => {
    return (
        <div className="_ml_xm_layout">
            <ErrorBoundary>
                <MainHeader />
                <Outlet />
            </ErrorBoundary>
        </div>
    );
};
