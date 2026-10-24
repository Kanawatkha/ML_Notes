import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { PAGES, REFERENCE_PAGE } from '../../src/config/site.ts';
import { buildContent, writeOutput } from './index.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const result = buildContent(root, PAGES, [REFERENCE_PAGE]);

if (result.errors.length > 0) {
  console.error(`content: ${result.errors.length} error(s)`);
  for (const e of result.errors) console.error(`  - ${e}`);
  process.exit(1);
}

writeOutput(result, `${root}src/content/generated`);
const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;
for (const p of [...result.pages, ...result.extra]) {
  const c = p.counts;
  console.log(
    `content: ${p.file.id} -> ${kb(Buffer.byteLength(p.json))} (${kb(gzipSync(p.json).length)} gzip), ${c.sections} sections, ${c.subtopics} sub-topics, ${c.examples} examples`,
  );
}
console.log(
  `content: ${result.pages.length} page(s) converted, ${result.warnings.length} warning(s). Report: src/content/generated/report.txt`,
);
