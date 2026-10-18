import {mkdir,writeFile,cp,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {renderPage,escapeHtml} from '../src/templates.mjs';
import {locales,pages,translations,keywordMap} from '../content/articles.mjs';
import {pagePath} from '../src/routes.mjs';
const siteConfig=JSON.parse(await readFile(new URL('../site.config.json',import.meta.url),'utf8'));
export async function buildSite({origin=(process.env.SITE_URL||siteConfig.origin||'').replace(/\/$/,'')}={}){
 if(origin&&!/^https?:\/\/[^/]+$/.test(origin))throw new Error('SITE_URL must be an http(s) origin');
 await mkdir('dist/assets',{recursive:true});
 await cp('public/assets','dist/assets',{recursive:true});
 for(const f of ['styles.css','client.mjs','search.mjs','theme.js','images.mjs'])await cp('src/'+f,'dist/assets/'+f);
 const paths=[];
 for(const locale of locales){
  for(const page of [null,...pages]){
   const path=pagePath(locale,page?.slug);paths.push(path);
   await mkdir('dist'+path,{recursive:true});
   await writeFile('dist'+path+'index.html',renderPage({locale,page,origin}));
  }
  const items=pages.filter(p=>!['privacy','terms'].includes(p.slug)).map(p=>({title:p.titleByLocale[locale],summary:p.summaryByLocale[locale],category:p.category,href:pagePath(locale,p.slug),keywords:keywordMap.filter(k=>k.targetSlug===p.slug&&['confirmed','status'].includes(k.evidenceStatus)).map(k=>k.keyword)}));
  await writeFile(`dist/search-index.${locale}.json`,JSON.stringify(items));
 }
 await writeFile('dist/index.html',renderPage({locale:'en',origin}));
 const t=translations.en;
 await writeFile('dist/404.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Break and Steal an Egg</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/assets/styles.css"></head><body><main class="not-found"><span class="eyebrow">404</span><h1>${t.ui[42]}</h1><p>${t.ui[43]}</p><a class="button primary" href="/en/">${t.ui[41]}</a></main></body></html>`);
 await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${origin?`Sitemap: ${origin}/sitemap.xml\n`:''}`);
 await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin?paths.map(p=>`<url><loc>${escapeHtml(origin+p)}</loc></url>`).join(''):''}</urlset>`);
 return paths.length;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){console.log(`Built ${await buildSite()} localized pages + root and 404`);}
