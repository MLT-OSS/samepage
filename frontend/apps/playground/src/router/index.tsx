import { createBrowserRouter } from 'react-router-dom';
import { ENV } from '@/utils';
import { PageNoFound, Configure, Playground, DocChatAppLayout, PlaygroundLayout } from '@xm/containers';

const routerWapper = createBrowserRouter;

export const globalRouters = routerWapper(
    [
        {
            path: '/',
            element: <DocChatAppLayout />,
            children: [
                {
                    path: '/',
                    element: <PlaygroundLayout />,
                    children: [
                        { path: '/', element: <Playground /> },
                        { path: '/configure', element: <Configure /> },
                        { path: '*', element: <PageNoFound /> }
                    ]
                }
            ]
        }
    ],
    {
        basename: ENV?.NX_PLAYGROUND_BASE_URL ?? '/'
    }
);
