const ProxyServer = require('./ProxyServer');
const config = require('./config');

const proxyServer = new ProxyServer(config);
proxyServer.start();
