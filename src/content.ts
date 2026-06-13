import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';

export type ContentType = 'card' | 'chapter' | 'example' | 'facilitator-note' | 'governance';
export type ContentStatus = 'draft' | 'reviewed' | 'stable';

export interface ContentItem {
  title: string;
  description: string;
  type: ContentType;
  status: ContentStatus;
  version: string;
  last_updated: string;
  audience: string;
  tags: string[];
  slug: string;
  route: string;
  sourcePath: string;
  html: string;
}

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

const contentFiles = import.meta.glob('/content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const governanceFiles = import.meta.glob('/governance/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function routePrefix(type: ContentType): string {
  if (type === 'facilitator-note') return '/facilitator-notes';
  if (type === 'governance') return '/governance';
  return `/${type}s`;
}

function slugFromPath(path: string): string {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? path;
}

function formatDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value;
  return '2026-06-13';
}

function parseItem(path: string, raw: unknown): ContentItem {
  const parsed = matter(String(raw));
  const data = parsed.data as Partial<ContentItem>;
  const type = path.startsWith('/governance/') ? 'governance' : data.type;

  if (!type) {
    throw new Error(`Missing type in ${path}`);
  }

  const slug = slugFromPath(path);
  return {
    title: data.title ?? slug,
    description: data.description ?? '',
    type,
    status: data.status ?? 'draft',
    version: data.version ?? '0.1.0',
    last_updated: formatDate(data.last_updated),
    audience: data.audience ?? 'general',
    tags: Array.isArray(data.tags) ? data.tags : [],
    slug,
    route: `${routePrefix(type)}/${slug}`,
    sourcePath: path.replace(/^\//, ''),
    html: markdown.render(parsed.content),
  };
}

export const content = Object.entries({ ...contentFiles, ...governanceFiles })
  .map(([path, raw]) => parseItem(path, raw))
  .sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));

export function byType(type: ContentType): ContentItem[] {
  return content.filter((item) => item.type === type);
}

export function findContent(type: ContentType, slug: string): ContentItem | undefined {
  return content.find((item) => item.type === type && item.slug === slug);
}

export function sectionLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    card: 'Field Cards',
    chapter: 'Chapters',
    example: 'Examples',
    'facilitator-note': 'Facilitator Notes',
    governance: 'Governance',
  };
  return labels[type];
}
