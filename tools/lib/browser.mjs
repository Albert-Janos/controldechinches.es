// Shared helpers: start the local server, launch an installed Chrome/Edge with puppeteer-core.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const here = fileURLToPath(new URL('.', import.meta.url));
export const repoRoot = join(here, '..', '..');

export function chromePath() {
  const c = [process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  const p = c.find(x => x && existsSync(x));
  if (!p) throw new Error('No Chrome/Edge found. Set CHROME_PATH.');
  return p;
}

export async function startServer(port = 4180, root = repoRoot) {
  const child = spawn(process.execPath, [join(here, '..', 'serve.mjs'), String(port), root], { stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((res, rej) => { child.stdout.once('data', res); child.once('error', rej); setTimeout(() => rej(new Error('server timeout')), 8000); });
  return { base: `http://127.0.0.1:${port}`, stop: () => child.kill() };
}

export async function launch() {
  return puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--no-sandbox'] });
}
