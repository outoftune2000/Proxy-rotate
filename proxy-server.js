const http = require('http');
const net = require('net');
const url = require('url');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error');
});

const server = http.createServer((req, res) => {
  const targetUrl = url.parse(req.url);
  console.log(`Proxying HTTP request for: ${targetUrl.href}`);
  proxy.web(req, res, { target: targetUrl.href, changeOrigin: true }, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Proxy error');
    }
  });
});

server.on('connect', (req, clientSocket, head) => {
  const { port, hostname } = new URL(`http://${req.url}`);
  console.log(`Proxying HTTPS request for: ${hostname}:${port}`);
  const serverSocket = net.connect(port, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
      'Proxy-agent: Node.js-Proxy\r\n' +
      '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on('error', (err) => {
    console.error('Server Socket error:', err);
    clientSocket.end();
  });

  clientSocket.on('error', (err) => {
    console.error('Client Socket error:', err);
    serverSocket.end();
  });
});

server.listen(3128, () => {
  console.log('Proxy server is running on port 3128');
});
