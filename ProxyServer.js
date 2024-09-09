const http = require('http');
const httpProxy = require('http-proxy');
const HttpHandler = require('./HttpHandler');
const HttpsHandler = require('./HttpsHandler');
const ErrorHandler = require('./ErrorHandler');

class ProxyServer {
  constructor(options = {}) {
    this.port = options.port || 3128;
    this.host = options.host || '0.0.0.0';
    this.proxy = httpProxy.createProxyServer({});
    this.server = http.createServer(this.handleRequest.bind(this));
    
    this.httpHandler = new HttpHandler(this.proxy);
    this.httpsHandler = new HttpsHandler();
    this.errorHandler = new ErrorHandler();

    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.proxy.on('error', this.errorHandler.handleProxyError.bind(this.errorHandler));
    this.server.on('connect', this.httpsHandler.handle.bind(this.httpsHandler));
  }

  handleRequest(req, res) {
    if (req.method === 'CONNECT') {
      this.httpsHandler.handle(req, res);
    } else {
      this.httpHandler.handle(req, res);
    }
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      console.log(`Proxy server is running on ${this.host}:${this.port}`);
    });

    process.on('SIGINT', this.shutdown.bind(this));
  }

  shutdown() {
    console.log('Shutting down proxy server...');
    this.server.close(() => {
      console.log('Proxy server shut down.');
      process.exit(0);
    });
  }
}

module.exports = ProxyServer;
