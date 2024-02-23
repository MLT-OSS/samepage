/**
 * 前端开发代理配置
 */
const TARGET = process.env.NX_PROXY_DOMAIN;
const API_PATH = process.env.NX_API_PATH;

const PROXY_CONFIG = {
    [API_PATH]: {
        target: TARGET,
        secure: false,
        changeOrigin: true,
        // pathRewrite: {
        //     [`^${API_PATH}`]: ''
        // },
        onProxyReq: (proxyReq, req, res) => {
            if (req.headers.cookie) {
                proxyReq.setHeader('Cookie', req.headers.cookie);
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            let cookie = '';
            const _host = req.headers.host;
            const [_ip = ''] = _host.split(':');
            const _origin = req.headers.origin;
            Object.keys(proxyRes.headers).forEach((key) => {
                if (key === 'set-cookie' && proxyRes.headers[key] && _ip) {
                    const cookieTokens = proxyRes.headers[key];
                    const _cookie = cookieTokens.filter((element) => element.includes('XM_SESSION_ID')).join('');
                    const _cookieArr = _cookie.split(';').map((_) => _.trim());
                    _cookieArr.forEach((_, index) => {
                        const [key, value] = _.split('=');
                        if (key === 'Domain') {
                            _cookieArr[index] = `Domain=${_ip}`;
                        }
                        // if (key === 'Secure') {
                        //     _cookieArr[index] = ``;
                        // }
                    });
                    cookie = _cookieArr.filter((_) => !!_).join('; ');
                }
            });
            if (cookie) {
                proxyRes.headers['set-cookie'] = cookie;
            }

            proxyRes.headers['access-control-allow-origin'] = `${_origin}`;
            proxyRes.headers['access-control-allow-credentials'] = 'true';
            proxyRes.headers['access-control-allow-headers'] =
                'extension-version,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        }
    }
};

module.exports = PROXY_CONFIG;
