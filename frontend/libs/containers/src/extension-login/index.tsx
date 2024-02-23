import { Button } from 'antd';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { MSG_OPEN_LOGIN } from '@/constants';
import { isExtension } from '@/utils';
import styles from './index.module.less';

export const ExtensionLogin = () => {
    const location = useLocation();
    const onHandleLogin = async () => {
        const searchParams = queryString.parse(location?.search);
        if (isExtension) {
            const Browser = await import('webextension-polyfill');
            Browser.runtime.sendMessage({
                type: MSG_OPEN_LOGIN,
                data: {
                    action: 'login',
                    windowScreenLeft: window?.screenLeft,
                    windowScreenTop: window?.screenTop,
                    windowWidth: window?.outerWidth,
                    windowHeight: window?.outerHeight,
                    location: location,
                    redirect: searchParams?.redirect
                }
            });
        }
    };
    return (
        <div className={styles.loginBtn}>
            <Button type="primary" style={{ width: '200px' }} onClick={onHandleLogin}>
                立即登录
            </Button>
        </div>
    );
};
