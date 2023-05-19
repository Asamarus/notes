const target = 'http://127.0.0.2:3333/';

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const cheerio = require('cheerio');
const _ = require('lodash');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');

const webpack_config = require('./webpack.config');
const config = webpack_config(process.env);

const compiler = webpack(config);
const instance = middleware(compiler, {
  publicPath: '/dist',
});

const browser = browserSync.create();
const browserReload = browser.reload;
browser.init({ notify: false, ghostMode: false });

const bundles = _.keys(config.entry);

compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
  browserReload();
});

const app = express();

app.use(require('connect-browser-sync')(browser));

const proxy = createProxyMiddleware({
  target: target,
  changeOrigin: true,
  autoRewrite: true,
  onProxyRes: onProxyRes,
  onProxyReq: onProxyReq,
});

function onProxyReq(proxyReq) {
  proxyReq.setHeader('remote-dev-server', 'yes');
}

function onProxyRes(proxyRes, req, res) {
  if (req.method === 'GET' && proxyRes.headers['content-type'] === 'text/html; charset=utf-8') {
    delete proxyRes.headers['content-length'];
    modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
      if (body) {
        const $ = cheerio.load(body);

        _.forEach(bundles, (bundle) => {
          $(`script[data-id=${bundle}]`).attr('src', `/dist/${bundle}.js`);
        });

        return $.html();
      }
      return body;
    });
  }
}

app.use(instance);
app.use('/', proxy);

app.listen(8080);
