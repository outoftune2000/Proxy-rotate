const url = require('url');

class HttpHandler {
  constructor(proxy) {
    this.proxy = proxy;
  }

  handle(req, res) {
    const targetUrl = url.parse(req.url);
    console.log(`Proxying HTTP request for: ${targetUrl.href}`);
    this.proxy.web(req, res, { 
      target: targetUrl.href, 
      changeOrigin: true,
      timeout: 5000
    });
  }
}

module.exports = HttpHandler;
