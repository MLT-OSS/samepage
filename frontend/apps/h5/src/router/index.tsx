import { createBrowserRouter } from 'react-router-dom';
import { ENV } from '@/utils';
import {
    PageNoFound,
    H5AppLayout,
    ConvLayout,
    H5ConversationWarpper,
    H5Conversation,
    BotSetting
} from '@xm/containers';
import { MainLayoutWrapper } from '@xm/packages';

const routerWapper = createBrowserRouter;

export const globalRouters = routerWapper(
    [
        {
            path: '/',
            element: <H5AppLayout />,
            children: [
                {
                    path: '/',
                    element: (
                        <MainLayoutWrapper>
                            <H5ConversationWarpper>
                                <ConvLayout showRebotList={false} />
                            </H5ConversationWarpper>
                        </MainLayoutWrapper>
                    ),
                    children: [
                        { path: '/bot-setting', element: <BotSetting /> },
                        { path: '/conversation/:type/:model', element: <H5Conversation /> }
                    ]
                },
                { path: '*', element: <PageNoFound /> }
            ]
        },
        { path: '*', element: <PageNoFound /> }
    ],
    {
        basename: ENV?.NX_H5_BASE_URL ?? '/'
    }
);
