const net = require('net');
const tls = require('tls');

class HttpsHandler {
  handle(req, clientSocket, head) {
    const serverPort = req.url.split(':')[1] || 443;
    const serverHost = req.url.split(':')[0];

    const proxySocket = new net.Socket();

    proxySocket.connect(serverPort, serverHost, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');

      const tlsSocket = tls.connect({
        socket: proxySocket,
        servername: serverHost,
      });

      tlsSocket.on('secureConnect', () => {
        clientSocket.pipe(tlsSocket);
        tlsSocket.pipe(clientSocket);
      });

      tlsSocket.on('error', (err) => {
        console.error('TLS error:', err);
        clientSocket.destroy();
      });
    });

    proxySocket.on('error', (err) => {
      console.error('Proxy socket error:', err);
      clientSocket.destroy();
    });

    clientSocket.on('error', (err) => {
      console.error('Client socket error:', err);
      proxySocket.destroy();
    });
  }
}

module.exports = HttpsHandler;
