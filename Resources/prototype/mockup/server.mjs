/**
 * server — start Vite for the length of one command, then stop it.
 *
 * The scripts are meant to be runnable in CI and from a cold checkout, so they
 * bring their own dev server rather than assuming one is up. If a server is
 * already listening on the port, they use it and leave it alone.
 */
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';

const PORT = Number(process.env.MOCKUP_PORT ?? 5173);
export const origin = `http://localhost:${PORT}`;

const isUp = () =>
  new Promise(resolve => {
    const socket = createConnection({ port: PORT, host: 'localhost' })
      .on('connect', () => (socket.end(), resolve(true)))
      .on('error', () => resolve(false));
  });

export async function withServer(fn) {
  if (await isUp()) {
    console.log(`· using the dev server already on ${origin}`);
    return fn(origin);
  }

  console.log('· starting vite…');
  const child = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
    stdio: 'ignore',
    detached: false,
  });

  try {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      if (await isUp()) break;
      await new Promise(r => setTimeout(r, 300));
    }
    if (!(await isUp())) throw new Error('vite did not come up within 30s');
    // Give the module graph a moment to warm, or the first capture races it.
    await new Promise(r => setTimeout(r, 1200));
    return await fn(origin);
  } finally {
    child.kill('SIGTERM');
  }
}
