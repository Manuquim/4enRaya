import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
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
  console.error(error.code === 'EADDRINUSE' ? 'El puerto 8080 está ocupado. Cierra el otro servidor y vuelve a iniciar.' : 'No se pudo iniciar el servidor: ' + error.message);
  process.exitCode = 1;
});
server.listen(8080, '127.0.0.1', () => {
  console.log('Juego listo: http://127.0.0.1:8080/');
  console.log('No necesitas instalar paquetes. Pulsa Ctrl+C para cerrar.');
});
