import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import matter from 'gray-matter';

const roots = ['content', 'governance'];
const contentTypes = new Set(['card', 'chapter', 'example', 'facilitator-note']);
const statuses = new Set(['draft', 'reviewed', 'stable']);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const markdownFiles = roots.flatMap((root) => walk(root)).filter((file) => file.endsWith('.md'));
const errors: string[] = [];

for (const file of markdownFiles) {
  const rel = relative(process.cwd(), file);
  const { data, content } = matter(readFileSync(file, 'utf8'));

  for (const field of ['title', 'description', 'status', 'version', 'last_updated', 'audience', 'tags']) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${rel}: missing frontmatter field "${field}"`);
    }
  }

  if (file.startsWith('content') && !contentTypes.has(data.type)) {
    errors.push(`${rel}: type must be one of ${Array.from(contentTypes).join(', ')}`);
  }

  if (!statuses.has(data.status)) {
    errors.push(`${rel}: status must be draft, reviewed, or stable`);
  }

  const lastUpdated =
    data.last_updated instanceof Date
      ? data.last_updated.toISOString().slice(0, 10)
      : String(data.last_updated);

  if (!datePattern.test(lastUpdated)) {
    errors.push(`${rel}: last_updated must use YYYY-MM-DD`);
  }

  if (!Array.isArray(data.tags)) {
    errors.push(`${rel}: tags must be a YAML list`);
  }

  if (!content.trim()) {
    errors.push(`${rel}: content body is empty`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${markdownFiles.length} Markdown files.`);
