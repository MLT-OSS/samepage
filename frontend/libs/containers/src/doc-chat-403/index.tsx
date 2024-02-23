import { HOME_URL } from '@/utils';
import { ResultPage } from '@xm/components';
import { Button } from 'antd';
import React from 'react';

export const DocChatUnauthorized: React.FC = () => {
    return (
        <ResultPage type="403">
            <Button
                type="primary"
                onClick={() => {
                    window.location.href = HOME_URL!;
                }}>
                返回首页
            </Button>
        </ResultPage>
    );
};
