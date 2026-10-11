import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const stage = join(root, '.distribution', randomUUID());
const runtimeFiles = ['dist', 'run', 'run.cmd', 'iniciar.cmd', 'iniciar.sh', 'detener.cmd', 'detener.sh', 'Detener.desktop', 'README.md'];
const execute = promisify(execFile);
const quotePs = value => "'" + value.replaceAll("'", "''") + "'";
for (const platform of ['windows', 'linux']) {
  const directory = join(stage, platform);
  const app = join(directory, 'app');
  await mkdir(app, { recursive: true });
  for (const file of runtimeFiles) await cp(join(root, file), join(app, file), { recursive: true });
  await mkdir(join(app, 'scripts'));
  for (const file of ['launch.mjs', 'serve-dist.mjs']) await cp(join(root, 'scripts', file), join(app, 'scripts', file));
  const launcher = platform === 'windows' ? 'JUGAR - Windows.vbs' : 'JUGAR - Linux.desktop';
  const visibleLauncher = launcher;
  if (platform === 'windows') await cp(join(root, launcher), join(directory, visibleLauncher));
  else {
    const desktop = (await readFile(join(root, launcher), 'utf8')).replace('/iniciar.sh', '/app/iniciar.sh');
    await writeFile(join(directory, visibleLauncher), desktop);
  }
  const archive = join(root, `cuatro-en-raya-${platform}.zip`);
  if (process.platform === 'win32') {
    const temporary = join(stage, `${platform}.zip`);
    // Forward slashes in ZIP entries also work with Linux archive extractors.
    const command = `Add-Type -AssemblyName System.IO.Compression.FileSystem; $base=${quotePs(directory)}; $zip=[System.IO.Compression.ZipFile]::Open(${quotePs(temporary)},'Create'); try { Get-ChildItem -LiteralPath $base -Recurse -File | ForEach-Object { $name=$_.FullName.Substring($base.Length + 1).Replace('\\','/'); [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip,$_.FullName,$name) | Out-Null } } finally { $zip.Dispose() }`;
    await execute('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { windowsHide: true });
    await cp(temporary, archive);
  } else {
    // A fresh ZIP avoids retaining files from a previous layout.
    const temporary = join(directory, 'package.zip');
    await execute('zip', ['-qr', temporary, 'app', visibleLauncher], { cwd: directory });
    await cp(temporary, archive);
  }
}
await cp(join(root, 'cuatro-en-raya-windows.zip'), join(root, 'cuatro-en-raya.zip'));
console.log(`Paquetes generados. Carpeta de comprobación: ${stage}`);
