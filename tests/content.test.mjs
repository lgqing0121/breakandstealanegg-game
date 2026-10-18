import test from 'node:test';
import assert from 'node:assert/strict';
import { locales, pages, translations, keywordMap } from '../content/articles.mjs';
import { pagePath } from '../src/routes.mjs';

test('four locales contain eight ordered modules and complete article translations', () => {
  assert.deepEqual(locales, ['en','pt-br','es','id']);
  for (const locale of locales) {
    assert.equal(translations[locale].modules.length, 8);
    assert.equal(pagePath(locale, 'codes'), `/${locale}/codes/`);
    for (const page of pages) {
      assert.ok(page.titleByLocale[locale]);
      assert.ok(page.summaryByLocale[locale]);
      assert.ok(page.sectionsByLocale[locale].length >= 2, page.slug);
    }
  }
  assert.equal(new Set(pages.slice(0,8).map(p=>JSON.stringify(p.sectionsByLocale.en))).size, 8);
});
test('28 source keywords are mapped without fabricating active codes', () => {
  assert.equal(keywordMap.length,28);
  assert.ok(keywordMap.every(k=>pages.some(p=>p.slug===k.targetSlug)));
  assert.equal(translations.en.activeCodes.length,0);
});
