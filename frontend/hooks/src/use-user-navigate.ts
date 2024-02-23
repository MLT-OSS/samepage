/**
 * 用户相关页面跳转（如果有 inviteKey 携带当前的 state）
 */
import { NavigateOptions, To, useLocation, useNavigate } from 'react-router-dom';
import { CORP_REGISTER } from 'types/corp-register';

export const useUserNavigate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const locationState: CORP_REGISTER.LocationState = location?.state || {};
    const isLinkRegister = !!locationState?.inviteParams?.inviteKey;

    const userNavigate = (path: To, options: NavigateOptions = {}) => {
        navigate(path, {
            ...options,
            state: {
                ...(isLinkRegister ? location?.state || {} : {}),
                ...(options.state || {})
            }
        });
    };

    return userNavigate;
};
