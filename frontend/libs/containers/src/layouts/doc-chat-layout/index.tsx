import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MainHeader, RobotUnauthModal } from '@xm/packages';
import { useCallback, useEffect } from 'react';
import { useConversationContext } from '@xm/context';
import { ErrorBoundary, Loading } from '@xm/components';
import { isEmpty } from 'lodash-es';

export const DocChatLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { conversationState, dispatch } = useConversationContext();
    const { robotDict, docChatHeaderClickCount = 0, robotUnauthShow, mainLayoutKey } = conversationState;
    const onHeaderLogoClick = useCallback(() => {
        dispatch({
            type: 'i_doc_chat_header_click_count',
            payload: {
                docChatHeaderClickCount: docChatHeaderClickCount + 1
            }
        });
    }, [dispatch, docChatHeaderClickCount]);

    // 设置当前的模型为 gpt3.5
    useEffect(() => {
        if (isEmpty(robotDict)) {
            return;
        }
        const botList = robotDict?.bot || [];
        const gpt3_5Info = botList.find((i: any) => i.uniqKey === 'Chat Lite');
        if (!gpt3_5Info) {
            navigate('/403');
            return;
        }
        // 设置当前模型信息
        dispatch({
            type: 'i_model_info',
            payload: {
                modelInfo: gpt3_5Info
            }
        });
    }, [robotDict?.bot]);

    const isAppPath = location.pathname === '/';
    return (
        <div className="_ml_xm_layout" key={mainLayoutKey}>
            <ErrorBoundary>
                <MainHeader onHeaderLogoClick={onHeaderLogoClick} />
                <div className="_ml_xm_body">
                    {isAppPath && isEmpty(robotDict) ? (
                        <div
                            style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Loading />
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
                {!!robotUnauthShow && (
                    <RobotUnauthModal
                        onConfirm={() => {
                            navigate('/403');
                        }}
                    />
                )}
            </ErrorBoundary>
        </div>
    );
};
