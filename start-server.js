// Lightweight static file server that binds to process.env.PORT (if set)
// and 0.0.0.0 (by default). This avoids relying on `npx`/external tools
// when run in minimal deployment environments.

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.env.PORT, 10) || 8080;
const host = process.env.HOST || '0.0.0.0';
const root = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

console.log(`Starting lightweight static server on ${host}:${port}`);

const server = http.createServer((req, res) => {
  try {
    const safeUrl = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(root, safeUrl);

    // protect from path traversal
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    // If path is a directory, try index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mime[ext] || 'application/octet-stream';

    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
  } catch (err) {
    console.error('Server error', err);
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`);
});

// Helpful diagnostics in case the process exits unexpectedly in remote environments
server.on('error', (err) => {
  console.error('Server error event:', err && err.stack ? err.stack : err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason && reason.stack ? reason.stack : reason);
});

process.on('exit', (code) => {
  console.log(`process.exit event — code=${code}`);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
