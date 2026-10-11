/* eslint-env node */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

test('background launcher serves the game, reuses the server, and stops it', { timeout: 15000 }, async () => {
  const socket = createServer();
  await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const url = `http://127.0.0.1:${port}`;
  const run = fileURLToPath(new URL('../run', import.meta.url));
  const execute = args => promisify(execFile)(process.execPath, [run, ...args], { env: { ...process.env, RAYA_PORT: String(port) }, timeout: 8000 });
  try {
    await execute(['--no-browser']);
    const first = await (await fetch(url + '/__4enraya/health')).json();
    assert.equal(first.name, '4enraya');
    const page = await fetch(url);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /<title>4 en raya/);
    assert.equal((await fetch(url + '/__4enraya/stop', { method: 'POST' })).status, 403);
    await execute(['--no-browser']);
    const second = await (await fetch(url + '/__4enraya/health')).json();
    assert.equal(second.token, first.token);
    await execute(['--stop']);
    await assert.rejects(fetch(url));
    for (let attempt = 0; attempt < 30; attempt++) {
      try { process.kill(first.pid, 0); }
      catch { break; }
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    assert.throws(() => process.kill(first.pid, 0), { code: 'ESRCH' });
    const released = createServer();
    await new Promise((resolve, reject) => { released.once('error', reject); released.listen(port, '127.0.0.1', resolve); });
    await new Promise(resolve => released.close(resolve));
    await execute(['--stop']);
  } finally { await execute(['--stop']); }
});
