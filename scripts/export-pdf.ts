import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const cardDir = 'content/cards';
const outputDir = 'dist/downloads';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

mkdirSync(outputDir, { recursive: true });

const cards = walk(cardDir)
  .filter((file) => file.endsWith('.md'))
  .sort()
  .map((file) => {
    const parsed = matter(readFileSync(file, 'utf8'));
    return `# ${parsed.data.title}\n\n${parsed.data.description}\n\n${parsed.content.trim()}`;
  });

const body = [
  '# Field Cards Print Pack',
  '',
  'This Markdown print pack is generated as the v1 export placeholder. A Playwright PDF exporter can be added later without changing the content model.',
  '',
  ...cards.map((card) => `${card}\n\n---`),
  '',
].join('\n');

writeFileSync(join(outputDir, 'field-cards.md'), body);
console.log(`Wrote ${join(outputDir, 'field-cards.md')}`);
