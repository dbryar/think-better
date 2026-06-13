import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

interface Artifact {
  name: string;
  path: string;
  sha256: string;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function sha256(file: string): string {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function gitCommit(): string {
  try {
    return execSync('git rev-parse --verify HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'unknown';
  }
}

if (!existsSync('dist')) {
  throw new Error('dist does not exist. Run the site build before generating the manifest.');
}

const artifacts: Artifact[] = walk('dist')
  .filter((file) => !file.endsWith('release-manifest.json'))
  .sort()
  .map((file) => ({
    name: relative('dist', file) || 'site',
    path: relative(process.cwd(), file),
    sha256: sha256(file),
  }));

const manifest = {
  project: 'how-to-question-power',
  version: '0.1.0',
  commit: gitCommit(),
  published_at: new Date().toISOString(),
  artifacts,
};

writeFileSync('dist/release-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote dist/release-manifest.json with ${artifacts.length} artifacts.`);
