import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

function copySourceMarkdown() {
  return {
    name: 'copy-source-markdown',
    closeBundle() {
      const sourceRoot = join(process.cwd(), 'dist', 'source');
      mkdirSync(sourceRoot, { recursive: true });

      for (const dir of ['content', 'governance']) {
        if (existsSync(dir)) {
          cpSync(dir, join(sourceRoot, dir), { recursive: true });
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [vue(), copySourceMarkdown()],
});
