import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from '../error-fallback';

interface ErrorBoundaryProps {
    FallbackComponent?: any;
    children: ReactNode;
}
interface ErrorBoundaryState {
    hasError: any;
    error: any;
    errorInfo: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error: error, errorInfo: error.message };
    }

    state = { hasError: false, error: null, errorInfo: '' };

    // eslint-disable-next-line @typescript-eslint/member-ordering
    componentDidCatch(error: any, errorInfo: ErrorInfo) {
        console.log(error, errorInfo);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    render() {
        const { children, FallbackComponent = ErrorFallback } = this.props;
        const { error, errorInfo } = this.state;
        if (this.state.hasError) {
            return <FallbackComponent error={error} errorInfo={errorInfo} />;
        }

        return children;
    }
}
