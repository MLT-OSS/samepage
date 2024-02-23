import { ResultPage } from '@xm/components';
import { useConversationContext } from '@xm/context';
import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PageNoFound: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useConversationContext();

    return (
        <ResultPage type="404">
            <Button
                type="primary"
                onClick={() => {
                    dispatch({
                        type: 'i_main_layout_key',
                        payload: {
                            mainLayoutKey: String(+new Date())
                        }
                    });
                    navigate('/');
                }}>
                返回首页
            </Button>
        </ResultPage>
    );
};
