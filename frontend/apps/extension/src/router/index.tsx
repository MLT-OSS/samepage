import { createMemoryRouter, Navigate } from 'react-router-dom';
import {
    ExtAppLayout,
    UserLayout,
    MainLayout,
    ExtensionLogin,
    ConvLayout,
    Conversation,
    PageNoFound,
    BotSetting
} from '@xm/containers';

const routerWapper = createMemoryRouter;

export const globalRouters = routerWapper([
    {
        path: '/',
        element: <ExtAppLayout />,
        children: [
            {
                path: '/user',
                element: <UserLayout />,
                children: [{ path: 'login', element: <ExtensionLogin /> }]
            },
            {
                path: '/',
                element: <MainLayout />,
                children: [
                    { path: '/', element: <Navigate to="/conversation" /> },
                    {
                        path: '/conversation',
                        element: <ConvLayout />,
                        children: [{ path: '/conversation/:type/:model', element: <Conversation /> }]
                    },
                    { path: '/bot-setting', element: <BotSetting /> },
                    { path: '*', element: <PageNoFound /> }
                ]
            }
        ]
    }
]);
