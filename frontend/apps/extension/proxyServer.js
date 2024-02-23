/**
 * proxy 转发服务
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PROXY_CONFIG = require('../../proxyConf');

const port = process.env.NX_API_PORT || 9996;

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to proxy server!');
});

// Set up the proxy.
if (PROXY_CONFIG) {
    Object.keys(PROXY_CONFIG).forEach(function (context) {
        app.use(context, createProxyMiddleware(PROXY_CONFIG[context]));
    });
}

app.listen(port, function () {
    console.log('Development proxy server listening on port ' + port);
});
