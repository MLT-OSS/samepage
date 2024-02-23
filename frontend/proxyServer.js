/**
 * proxy 转发服务
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const DEV_SERVER_CONFIG = require('./proxyConf');

const port = DEV_SERVER_CONFIG.port || 9996;

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to proxy server!');
});

// Set up the proxy.
if (DEV_SERVER_CONFIG.proxy) {
    Object.keys(DEV_SERVER_CONFIG.proxy).forEach(function (context) {
        app.use(context, createProxyMiddleware(DEV_SERVER_CONFIG.proxy[context]));
    });
}

app.listen(port, function () {
    console.log('Development proxy server listening on port ' + port);
});
