import { createBrowserRouter } from 'react-router-dom';
import { ENV } from '@/utils';
import { DocChatAppLayout, DocChatLayout, DocChat, PageNoFound, DocChatUnauthorized } from '@xm/containers';

const routerWapper = createBrowserRouter;

export const globalRouters = routerWapper(
    [
        {
            path: '/',
            element: <DocChatAppLayout />,
            children: [
                {
                    path: '/',
                    element: <DocChatLayout />,
                    children: [
                        { path: '/', element: <DocChat /> },
                        { path: '/403', element: <DocChatUnauthorized /> },
                        { path: '*', element: <PageNoFound /> }
                    ]
                }
            ]
        }
    ],
    {
        basename: ENV?.NX_DOC_CHAT_BASE_URL ?? '/'
    }
);
