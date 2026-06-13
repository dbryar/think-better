import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

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
    return {
      title: parsed.data.title,
      description: parsed.data.description,
      markdown: `# ${parsed.data.title}\n\n${parsed.data.description}\n\n${parsed.content.trim()}`,
      html: marked.parse(parsed.content.trim()),
    };
  });

const body = [
  '# Field Cards Print Pack',
  '',
  'This Markdown source backs the printable HTML field-card pack.',
  '',
  ...cards.map((card) => `${card.markdown}\n\n---`),
  '',
].join('\n');

writeFileSync(join(outputDir, 'field-cards.md'), body);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Field Cards Print Pack</title>
    <style>
      :root {
        color: #20231f;
        background: #fbfaf6;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.45;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #fbfaf6;
      }

      main {
        margin: 0 auto;
        max-width: 1120px;
        padding: 32px 24px 56px;
      }

      header {
        border-bottom: 1px solid #d9d5c8;
        margin-bottom: 24px;
        padding-bottom: 20px;
      }

      h1 {
        font-size: 2.25rem;
        line-height: 1.1;
        margin: 0 0 8px;
      }

      .intro {
        color: #3f463f;
        max-width: 760px;
      }

      .toolbar {
        margin-top: 18px;
      }

      button {
        background: #245a63;
        border: 0;
        border-radius: 6px;
        color: #fff;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        min-height: 42px;
        padding: 9px 14px;
      }

      .cards {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }

      .card {
        background: #fff;
        border: 1px solid #222;
        border-radius: 6px;
        break-inside: avoid;
        min-height: 360px;
        padding: 22px;
      }

      .card h2 {
        font-size: 1.45rem;
        line-height: 1.15;
        margin: 0 0 8px;
      }

      .purpose {
        border-bottom: 1px solid #d9d5c8;
        color: #3f463f;
        margin: 0 0 16px;
        padding-bottom: 12px;
      }

      .card h3 {
        font-size: 0.86rem;
        letter-spacing: 0.04em;
        margin: 20px 0 8px;
        text-transform: uppercase;
      }

      .card ul {
        padding-left: 20px;
      }

      .card li + li {
        margin-top: 7px;
      }

      .card table {
        border-collapse: collapse;
        font-size: 0.88rem;
        margin: 16px 0;
        width: 100%;
      }

      .card th,
      .card td {
        border: 1px solid #9e9787;
        padding: 7px 8px;
        text-align: left;
        vertical-align: top;
      }

      .card th {
        background: #ebe7dc;
        font-weight: 800;
      }

      .card tbody tr:nth-child(even) {
        background: #f5f3ec;
      }

      footer {
        border-top: 1px solid #d9d5c8;
        color: #5b625c;
        margin-top: 24px;
        padding-top: 18px;
      }

      @page {
        margin: 10mm;
        size: A4 landscape;
      }

      @media print {
        :root,
        body {
          background: #fff;
          color: #000;
        }

        main {
          max-width: none;
          padding: 0;
        }

        header,
        footer,
        .toolbar {
          display: none;
        }

        .cards {
          display: grid;
          gap: 0;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .card {
          border: 1px solid #000;
          border-radius: 0;
          height: 188mm;
          padding: 7mm;
          page-break-inside: avoid;
        }

        .card:nth-child(2n) {
          break-after: page;
        }

        .card th,
        .card td {
          border-color: #000;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>Field Cards Print Pack</h1>
        <p class="intro">Short civic reasoning tools for checking claims, incentives, evidence, certainty, scapegoating, and manipulation. Print this page from your browser and cut or fold as needed.</p>
        <p class="toolbar"><button type="button" onclick="window.print()">Print field cards</button></p>
      </header>
      <section class="cards" aria-label="Field cards">
        ${cards
          .map(
            (card) => `<article class="card">
          <h2>${card.title}</h2>
          <p class="purpose">${card.description}</p>
          ${card.html}
        </article>`,
          )
          .join('\n')}
      </section>
      <footer>
        <p>Generated from Markdown source. Licensed CC-BY-SA-4.0.</p>
      </footer>
    </main>
  </body>
</html>
`;

writeFileSync(join(outputDir, 'field-cards.html'), html);
console.log(`Wrote ${join(outputDir, 'field-cards.html')} and ${join(outputDir, 'field-cards.md')}`);
