class ErrorHandler {
  handleProxyError(err, req, res) {
    console.error('Proxy error:', err);
    if (res.writeHead && res.end) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error');
    }
  }
}

module.exports = ErrorHandler;
