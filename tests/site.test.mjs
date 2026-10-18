import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSite } from '../scripts/build.mjs';
import { readFile, access } from 'node:fs/promises';
import {renderPage} from '../src/templates.mjs';
import {pages} from '../content/articles.mjs';
test('static output contains complete body, SEO and matching locale alternatives', async () => {
  await buildSite({origin:''});
  const html=await readFile('dist/en/index.html','utf8');
  assert.match(html,/<h1[^>]*>Break and Steal an Egg/);
  assert.match(html,/name="description"/);
  assert.match(html,/lang="en"/);
  assert.match(html,/hreflang="pt-BR"/);
  assert.doesNotMatch(html,/rel="canonical"/);
  assert.equal((html.match(/class="explore-module/g)||[]).length,8);
  for(const lang of ['en','pt-br','es','id']) {
    await access(`dist/${lang}/codes/index.html`);
    const article=await readFile(`dist/${lang}/beginner-guide/index.html`,'utf8');
    for(const json of article.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json[1]);
  }
});
test('localized home metadata differs and articles expose breadcrumb structured data',()=>{
  const en=renderPage({locale:'en'}), es=renderPage({locale:'es'});
  assert.notEqual(en.match(/<title>(.*?)<\/title>/)[1],es.match(/<title>(.*?)<\/title>/)[1]);
  assert.ok(renderPage({locale:'en',page:pages[0],origin:'https://example.test'}).includes('BreadcrumbList'));
});
test('stat numbers stay paired with correct labels and code link describes its action', async()=>{
  const html=await readFile('dist/en/index.html','utf8');
  assert.match(html,/<strong>118\.8K<\/strong><span>players online<\/span>/);
  assert.match(html,/<strong>124\.8M\+<\/strong><span>total visits<\/span>/);
  assert.match(html,/<strong>7<\/strong><span>players per server<\/span>/);
  assert.match(html,/<strong>OCT 14<\/strong><span>last game update<\/span>/);
  assert.match(html,/class="hero-code-link"[^>]*>[\s\S]*?Check code status<\/a>/);
});
