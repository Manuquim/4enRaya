import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';
import { randomUUID } from 'node:crypto';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const token = randomUUID();
const port = Number(process.env.RAYA_PORT || 8080);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  if (request.url === '/__4enraya/health' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify({ name: '4enraya', token })); return;
  }
  if (request.url === '/__4enraya/stop' && request.method === 'POST') {
    if (request.headers.authorization !== `Bearer ${token}`) {
      response.writeHead(403); response.end(); return;
    }
    response.writeHead(200); response.end('Servidor detenido');
    server.close(); server.closeIdleConnections(); return;
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) {
      response.writeHead(403); response.end(); return;
    }
    if (!(await stat(path)).isFile()) throw new Error('Not a file');
    const contents = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Content-Length': contents.length, 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : contents);
  } catch {
    response.writeHead(404); response.end('Archivo no encontrado');
  }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? `El puerto ${port} está ocupado. Cierra el otro servidor y vuelve a iniciar.` : 'No se pudo iniciar el servidor: ' + error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Juego listo: http://127.0.0.1:${port}/`);
});
