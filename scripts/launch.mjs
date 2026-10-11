import { spawn } from 'node:child_process';
import { openSync, closeSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.RAYA_PORT || 8080);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Puerto no válido.');
const url = `http://127.0.0.1:${port}`;
const root = fileURLToPath(new URL('../', import.meta.url));

async function health() {
  try {
    const response = await fetch(url + '/__4enraya/health', { signal: AbortSignal.timeout(800) });
    const info = await response.json();
    if (info.name !== '4enraya' || !info.token) throw new Error();
    return info;
  } catch { return null; }
}

let info = await health();
if (process.argv.includes('--stop')) {
  if (info) {
    const response = await fetch(url + '/__4enraya/stop', { method: 'POST', headers: { Authorization: `Bearer ${info.token}` } });
    if (!response.ok) throw new Error('No se pudo detener el servidor.');
  }
  console.log('Servidor del juego detenido.');
} else {
  if (!info) {
    const log = openSync(new URL('../servidor.log', import.meta.url), 'a');
    try {
      const child = spawn(process.execPath, [fileURLToPath(new URL('./serve-dist.mjs', import.meta.url))], {
        cwd: root, detached: true, windowsHide: true, stdio: ['ignore', log, log],
      });
      child.on('error', error => console.error(error.message));
      child.unref();
    } finally { closeSync(log); }
    for (let attempt = 0; attempt < 30 && !info; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      info = await health();
    }
    if (!info) throw new Error(`No se pudo iniciar el juego. Comprueba si el puerto ${port} está ocupado y consulta servidor.log.`);
  }
  console.log(`Juego listo: ${url}/. Para cerrar el servidor usa el lanzador Detener o node run --stop.`);
  if (!process.argv.includes('--no-browser')) {
    const command = process.platform === 'win32' ? 'powershell.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const args = process.platform === 'win32' ? ['-NoProfile', '-NonInteractive', '-Command', `Start-Process '${url}/'`] : [url + '/'];
    const browser = spawn(command, args, { detached: true, windowsHide: true, stdio: 'ignore' });
    browser.on('error', () => console.error(`Abre manualmente ${url}/ en tu navegador.`));
    browser.on('exit', code => { if (code) console.error(`Abre manualmente ${url}/ en tu navegador.`); });
    browser.unref();
  }
}
