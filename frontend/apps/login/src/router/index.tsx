import { createBrowserRouter } from 'react-router-dom';
import {
    Login,
    LoginAppLayout,
    Register,
    RetrievePassword,
    PageNoFound,
    RegisterResult,
    PrefectCorpInfo,
    LinkRegister,
    PrefectCorpInfoWrapper
} from '@xm/containers';
import { ENV } from '@/utils';

const routerWapper = createBrowserRouter;

export const globalRouters = routerWapper(
    [
        // 重定向移入 LoginAppLayout 内
        {
            path: '/',
            element: <LoginAppLayout />,
            children: [
                { path: '/login', element: <Login /> },
                { path: '/register', element: <Register /> },
                { path: '/prefect-corp-info', element: <PrefectCorpInfo /> },
                { path: '/prefect-corp-info-wrapper', element: <PrefectCorpInfoWrapper /> },
                { path: '/retrieve-password', element: <RetrievePassword /> },
                { path: '/link-register', element: <LinkRegister /> }
            ]
        },
        {
            path: '/',
            element: <LoginAppLayout hideLogo />,
            children: [
                { path: '/register/result', element: <RegisterResult /> },
                { path: '*', element: <PageNoFound /> }
            ]
        }
    ],
    {
        basename: ENV?.NX_LOGIN_BASE_URL ?? '/'
    }
);
