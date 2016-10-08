const http = require('http');

const hostname = '127.0.0.1';
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  if (req.url === '/ping') return res.end('pong!\n');
  return res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
