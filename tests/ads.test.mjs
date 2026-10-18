import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPage} from '../src/templates.mjs';
import {pages,locales,translations} from '../content/articles.mjs';
import {renderBannerDocument,chooseRailFormat} from '../src/ads.mjs';
test('all locales and content pages have top, early native, two rails and mobile rectangle',()=>{
 for(const locale of locales)for(const page of [null,...pages]){
  const h=renderPage({locale,page});
  for(const slot of ['top','rail-left','rail-right','mobile-rectangle'])assert.ok(h.includes(`data-ad-slot="${slot}"`),slot);
  assert.equal((h.match(/id="container-3952dc2c06c3d82599fb1d1390ce87ba"/g)||[]).length,1);
  assert.ok(h.indexOf('id="container-3952')<h.indexOf('<main'));
  assert.equal((h.match(/src="\/assets\/ads-client.mjs"/g)||[]).length,1);
 }
});
test('banner documents preserve exact supplied keys, dimensions and provider scripts',()=>{
 for(const [format,key,w,h] of [['top','b6f1f1672cfe61512ae39447771e1bd4',320,50],['rectangle','35f9c495779e7060fd6c55d55d6320ec',300,250],['short','b7b97221c007431d03cf79b966193bbd',160,300],['tall','ae6051499d172137c6caa66007c6c833',160,600]]){
  const html=renderBannerDocument(format);assert.ok(html.includes(key));assert.ok(html.includes(`width: ${w}`));assert.ok(html.includes(`height: ${h}`));assert.ok(html.includes(`https://www.highrevenueformat.com/${key}/invoke.js`));
 }
 assert.equal(chooseRailFormat(1440,900),'tall');assert.equal(chooseRailFormat(1200,700),'short');assert.equal(chooseRailFormat(768,1000),null);
});
test('privacy copy discloses advertising in every locale',()=>{
 for(const locale of locales)assert.ok(translations[locale].articles[10].sections.some(s=>s.join(' ').includes('Adsterra')));
});
