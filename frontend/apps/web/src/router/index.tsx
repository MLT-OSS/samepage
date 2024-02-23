import { createBrowserRouter } from 'react-router-dom';
import { ENV } from '@/utils';
import { WebAppLayout, MainLayout, ConvLayout, Conversation, PageNoFound, BotSetting } from '@xm/containers';

const routerWapper = createBrowserRouter;

export const globalRouters = routerWapper(
    [
        {
            path: '/',
            element: <WebAppLayout />,
            children: [
                {
                    path: '/',
                    element: <MainLayout />,
                    children: [
                        { path: '/bot-setting', element: <BotSetting /> },
                        {
                            path: '/',
                            element: <ConvLayout />,
                            children: [{ path: '/conversation/:type/:model', element: <Conversation /> }]
                        },
                        { path: '*', element: <PageNoFound /> }
                    ]
                }
            ]
        }
    ],
    {
        basename: ENV?.NX_WEB_BASE_URL ?? '/'
    }
);
