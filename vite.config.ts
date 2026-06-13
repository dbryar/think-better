import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

interface RoutePage {
  title: string;
  description: string;
  route: string;
  sourcePath: string;
  type: string;
  status: string;
  version: string;
  last_updated: string;
  audience: string;
  tags: string[];
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function routePrefix(type: string): string {
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

function yamlList(values: string[]): string {
  return `[${values.join(', ')}]`;
}

function withFrontmatter(data: Record<string, unknown>, body: string): string {
  const lines = Object.entries(data).map(([key, value]) => {
    if (Array.isArray(value)) return `${key}: ${yamlList(value.map(String))}`;
    return `${key}: ${value}`;
  });
  return `---\n${lines.join('\n')}\n---\n\n${body.trim()}\n`;
}

function readRoutePages(): RoutePage[] {
  const contentPages = walk('content')
    .filter((file) => file.endsWith('.md'))
    .map((sourcePath) => {
      const parsed = matter(readFileSync(sourcePath, 'utf8'));
      const type = String(parsed.data.type);
      const slug = slugFromPath(sourcePath);
      return {
        title: parsed.data.title ?? slug,
        description: parsed.data.description ?? '',
        route: `${routePrefix(type)}/${slug}`,
        sourcePath,
        type,
        status: parsed.data.status ?? 'draft',
        version: parsed.data.version ?? '0.1.0',
        last_updated: formatDate(parsed.data.last_updated),
        audience: parsed.data.audience ?? 'general',
        tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
      };
    });

  const governancePages = walk('governance')
    .filter((file) => file.endsWith('.md'))
    .map((sourcePath) => {
      const parsed = matter(readFileSync(sourcePath, 'utf8'));
      const slug = slugFromPath(sourcePath);
      return {
        title: parsed.data.title ?? slug,
        description: parsed.data.description ?? '',
        route: `/governance/${slug}`,
        sourcePath,
        type: 'governance',
        status: parsed.data.status ?? 'draft',
        version: parsed.data.version ?? '0.1.0',
        last_updated: formatDate(parsed.data.last_updated),
        audience: parsed.data.audience ?? 'contributors',
        tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
      };
    });

  return [...contentPages, ...governancePages].sort((a, b) =>
    a.sourcePath.localeCompare(b.sourcePath),
  );
}

function writeRouteMarkdown(outDir: string, route: string, markdown: string) {
  const target = route === '/' ? join(outDir, 'index.md') : join(outDir, `${route}.md`);
  mkdirSync(target.split('/').slice(0, -1).join('/'), { recursive: true });
  writeFileSync(target, markdown);
}

function writeRouteShell(outDir: string, route: string, shell: string) {
  if (route === '/') return;
  const target = join(outDir, route, 'index.html');
  mkdirSync(target.split('/').slice(0, -1).join('/'), { recursive: true });
  writeFileSync(target, shell);
}

function indexPage(title: string, description: string, route: string, pages: RoutePage[]): string {
  const body = pages
    .map((page) => `- [${page.title}](${page.route}) - ${page.description}`)
    .join('\n');

  return withFrontmatter(
    {
      title,
      description,
      type: 'index',
      status: 'draft',
      version: '0.1.0',
      last_updated: '2026-06-13',
      audience: 'general',
      tags: ['index'],
    },
    body || `No ${title.toLowerCase()} have been published yet.`,
  );
}

function homePage(): string {
  return withFrontmatter(
    {
      title: 'How to Question Power Without Becoming a Mark',
      description:
        'A civic self-defence field guide for spotting manipulation, following incentives, checking claims, and staying sceptical without falling into paranoia.',
      type: 'index',
      status: 'draft',
      version: '0.1.0',
      last_updated: '2026-06-13',
      audience: 'general',
      tags: ['home'],
    },
    `
Most manipulation is boring. It works because people are tired, scared, flattered, angry, lonely, or looking for certainty.

This project is a public, open, inspectable field guide for asking better questions. It does not tell you who to vote for, who to trust, or what tribe to join. It teaches practical habits for checking claims, understanding incentives, spotting scapegoats, and avoiding grifters.

## Start Here

- Who benefits if I believe this?
- What evidence would change my mind?
- Is there a simpler, more boring explanation?
- Am I being aimed at someone with less power than me?
- Is this trying to make me angry before I think?
- Who is missing from the story?
- What would the claim look like if it were false?

## Main Sections

- [Field Cards](/cards): short, printable tools for real-life use.
- [Chapters](/chapters): deeper explanations for people who want the machinery.
- [Examples](/examples): breakdowns of common manipulation patterns.
- [Facilitator Notes](/facilitator-notes): safer ways for parents, teachers, coaches, librarians, and youth workers to use the material.
- [Governance](/governance): how the project avoids becoming a cult, party vehicle, or conspiracy pipeline.
- [Downloads](/downloads): PDFs, print packs, and versioned releases.

## Trust And Provenance

This project is designed to be copied, printed, forked, mirrored, and criticised. Each release should include a manifest that records the commit, timestamp, generated artefacts, and SHA-256 hashes. Where available, releases should include build provenance via GitHub artifact attestations.

> Do not trust this project because it sounds confident. Check it. Fork it. Improve it. Argue with it. Discard what fails.
`,
  );
}

function downloadsPage(): string {
  return withFrontmatter(
    {
      title: 'Downloads',
      description:
        'Release artefacts are generated during CI and local builds, including a field-card print pack and release manifest.',
      type: 'index',
      status: 'draft',
      version: '0.1.0',
      last_updated: '2026-06-13',
      audience: 'general',
      tags: ['downloads', 'provenance'],
    },
    `
- [Field Cards Print Pack](/downloads/field-cards.html): a printable field-card pack laid out for browser printing.
- [Field Cards Markdown Source](/downloads/field-cards.md): the generated Markdown source for the print pack.
- [Release Manifest](/release-manifest.json): commit, timestamp, artefact paths, and SHA-256 hashes generated at build time.
`,
  );
}

function copySourceMarkdown() {
  return {
    name: 'route-markdown',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist');
      const sourceRoot = join(outDir, 'source');
      mkdirSync(sourceRoot, { recursive: true });

      for (const dir of ['content', 'governance']) {
        if (existsSync(dir)) {
          cpSync(dir, join(sourceRoot, dir), { recursive: true });
        }
      }

      const pages = readRoutePages();
      const shell = readFileSync(join(outDir, 'index.html'), 'utf8');
      const types = new Map([
        ['card', { title: 'Field Cards', description: 'Short, printable tools for real-life use.', route: '/cards' }],
        ['chapter', { title: 'Chapters', description: 'Deeper explanations for people who want the machinery.', route: '/chapters' }],
        ['example', { title: 'Examples', description: 'Breakdowns of common manipulation patterns.', route: '/examples' }],
        ['facilitator-note', { title: 'Facilitator Notes', description: 'Safer ways for adults and youth workers to use the material.', route: '/facilitator-notes' }],
        ['governance', { title: 'Governance', description: 'How the project avoids becoming a cult, party vehicle, or conspiracy pipeline.', route: '/governance' }],
      ]);

      writeRouteMarkdown(outDir, '/', homePage());
      writeRouteMarkdown(outDir, '/downloads', downloadsPage());
      writeRouteShell(outDir, '/downloads', shell);

      for (const [type, section] of types) {
        writeRouteMarkdown(
          outDir,
          section.route,
          indexPage(section.title, section.description, section.route, pages.filter((page) => page.type === type)),
        );
        writeRouteShell(outDir, section.route, shell);
      }

      for (const page of pages) {
        writeRouteMarkdown(outDir, page.route, readFileSync(page.sourcePath, 'utf8'));
        writeRouteShell(outDir, page.route, shell);
      }
    },
  };
}

export default defineConfig({
  plugins: [vue(), copySourceMarkdown()],
});
